package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"log"
	"mime"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"rcb/db"

	_ "github.com/mattn/go-sqlite3"
)

const dbName = "./foo.db"

var (
	testing    = flag.Bool("t", false, "launch for testing purposes")
	domainName = flag.String("d", "localhost", "specifies the domain name (or hostname) by which the server refers to itself")
)

var database db.RestaurantsDB

func main() {
	flag.Parse()
	if *testing {
		os.Remove(dbName) // for testing purposes
	}
	database = db.PrepareDB(dbName)
	defer database.Close()

	mux := http.NewServeMux()

	mux.HandleFunc("POST /goods", createGoodHandler)
	mux.HandleFunc("GET /goods", readAllGoodsHandler)
	mux.HandleFunc("GET /goods/{id}", readGoodHandler)
	mux.HandleFunc("PATCH /goods/{id}", updateGoodHandler)
	mux.HandleFunc("DELETE /goods/{id}", deleteGoodHandler)
	mux.HandleFunc("OPTIONS /goods/{id}", optionsHandler)

	mux.HandleFunc("POST /images", uploadImageHandler)
	// TODO: Hide the view of the entire folder, serve just the images inside
	mux.Handle("GET /images/", http.FileServer(http.Dir(".")))

	mux.HandleFunc("POST /shops", createShopHandler)
	mux.HandleFunc("GET /shops", readAllShopsHandler)
	mux.HandleFunc("GET /shops/{id}", readShopHandler)
	mux.HandleFunc("PATCH /shops/{id}", updateShopHandler)
	mux.HandleFunc("DELETE /shops/{id}", deleteShopHandler)
	mux.HandleFunc("GET /{shop}", readShop)
	mux.HandleFunc("OPTIONS /shops/{id}", optionsHandler)

	fmt.Println("Starting the server...")
	log.Fatal(http.ListenAndServe(":1337", mux))
}

func createGoodHandler(w http.ResponseWriter, r *http.Request) {
	var newGood db.Good
	json.NewDecoder(r.Body).Decode(&newGood)
	log.Println(newGood)

	result, err := database.CreateGood(newGood)
	if err != nil {
		http.Error(w, "Could not create good", 500)
		log.Println(err)
		return
	}

    // TODO: Better naming? sendResponseJSON?
	err = sendResponse(w, struct {
		Id int64 `json:"id"`
	}{Id: result}, http.StatusCreated)
	if err != nil {
		http.Error(w, "Could not respond with the new good ID", 500)
		return
	}

	log.Println(fmt.Sprintf("Created a good with ID: %d", result))
}

func optionsHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Access-Control-Allow-Origin", "*")
    w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
    w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
    w.WriteHeader(http.StatusOK)
}

func readAllGoodsHandler(w http.ResponseWriter, r *http.Request) {
	goods, err := database.ReadAllGoods()
	if err != nil {
		http.Error(w, "Could not list all goods", 500)
		log.Println(err)
		return
	}

	err = sendResponse(w, goods, http.StatusOK)
	if err != nil {
		http.Error(w, "Could not respond with the goods", 500)
		return
	}

	log.Println("Listed all goods")
}

func readGoodHandler(w http.ResponseWriter, r *http.Request) {
	var good db.Good
	var err error

	goodID := r.PathValue("id")
	goodIDint, err := strconv.ParseInt(goodID, 10, 64)
	if err != nil {
		http.Error(w, "Invalid good ID", 400)
		log.Println(err)
		return
	}

	good, err = database.ReadGood(goodIDint)
	if err != nil {
		http.Error(w, fmt.Sprintf("Could not find a good with ID: %d", goodIDint), 404)
		log.Println(err)
		return
	}

	err = sendResponse(w, good, http.StatusOK)
	if err != nil {
		http.Error(w, "Could not respond with the sought good", 500)
		return
	}

	log.Println(fmt.Sprintf("Found and listed a good with ID: %d", goodIDint))
}

func updateGoodHandler(w http.ResponseWriter, r *http.Request) {
	var updateValues = map[string]string{}
	var updatedGood db.Good
	json.NewDecoder(r.Body).Decode(&updateValues)
	log.Println(updateValues)

	goodID := r.PathValue("id")
	if goodID == "" {
		http.Error(w, "You need to provide an ID of some good", 400)
		return
	}

	goodIDint, err := strconv.ParseInt(goodID, 10, 64)
	if err != nil {
		http.Error(w, "Invalid good ID", 400)
		log.Println(err)
		return
	}

	updatedGood, err = database.UpdateGood(goodIDint, updateValues)
	if err != nil {
		http.Error(w, fmt.Sprintf("Could not find a good with ID: %d", goodIDint), 404)
		log.Println(err)
		return
	}

	err = sendResponse(w, updatedGood, http.StatusOK)
	if err != nil {
		http.Error(w, "Could not respond with the updated good", 500)
		return
	}

	log.Println(fmt.Sprintf("Patched a good with ID: %d", goodIDint))
}

func deleteGoodHandler(w http.ResponseWriter, r *http.Request) {
	goodID := r.PathValue("id")
	if goodID == "" {
		http.Error(w, "You need to provide an ID of some good", 400)
		return
	}

	goodIDint, err := strconv.ParseInt(goodID, 10, 64)
	if err != nil {
		http.Error(w, "Invalid good ID", 400)
		log.Println(err)
		return
	}

	deletedGood, err := database.DeleteGood(goodIDint)
	if err != nil {
		http.Error(w, fmt.Sprintf("Could not find a good with ID: %d", goodIDint), 404)
		log.Println(err)
		return
	}

	err = sendResponse(w, deletedGood, http.StatusOK)
	if err != nil {
		http.Error(w, "Could not respond with the deleted good", 500)
		return
	}

	log.Println(fmt.Sprintf("Deleted a good with ID: %d", goodIDint))
}

func uploadImageHandler(w http.ResponseWriter, r *http.Request) {
	err := r.ParseMultipartForm(10485760) // 10 MB
	if err != nil {
		http.Error(w, "Could not parse form", 400)
		log.Println(err)
		return
	}

	image, handler, err := r.FormFile("image")
	if err != nil {
		http.Error(w, "Invalid form file", 400)
		log.Println(err)
		return
	}
	defer image.Close()

	log.Println("Filename:", handler.Filename)
	log.Println("File size:", handler.Size)
	log.Println("Request header:", handler.Header)

	// checking whether the file is an image
	imageBytes, err := io.ReadAll(image)
	if err != nil {
		http.Error(w, "Could not read the file", 500)
		log.Println(err)
		return
	}

	contentType := handler.Header["Content-Type"][0]
	if strings.HasPrefix(contentType, "image") &&
		mime.TypeByExtension(filepath.Ext(handler.Filename)) == contentType &&
		http.DetectContentType(imageBytes) == contentType {
		log.Println(handler.Filename, "seems to be a valid image")
	} else {
		http.Error(w, "File seems not to be an image", 400)
		log.Println(handler.Filename, "seems not to be an image")
		return
	}

	// saving the file on the server in the ./images dir
	err = os.MkdirAll("images", os.ModePerm)
	if err != nil {
		http.Error(w, "Could not save the file on the server", 500)
		panic(err)
	}

	file, err := os.Create(fmt.Sprintf("images/%s", handler.Filename))
	if err != nil {
		http.Error(w, "Could not save the file on the server 2", 500)
		log.Println(err)
		return
	}
	defer file.Close()

	_, err = file.Write(imageBytes)
	if err != nil {
		http.Error(w, "Could not write the file", 500)
		log.Println(err)
		return
	}

	// sending the link to the file in response
	err = sendResponse(w, struct {
		Link string `json:"link"`
	}{
		Link: fmt.Sprintf("http://%s:1337/images/%s", *domainName, handler.Filename),
	}, http.StatusCreated)
	if err != nil {
		// TODO: Ensure closing of the request
		http.Error(w, "Could not respond with the link to the uploaded image", 500)
		return
	}

	log.Println(fmt.Sprintf("Created an image with name: %s", handler.Filename))
}

func createShopHandler(w http.ResponseWriter, r *http.Request) {
	var newShop db.Shop
	json.NewDecoder(r.Body).Decode(&newShop)
	log.Println(newShop)

	result, err := database.CreateShop(newShop)
	if err != nil {
		http.Error(w, "Could not create shop", 500)
		log.Println(err)
		return
	}

	err = sendResponse(w, struct {
		Id int64 `json:"id"`
	}{Id: result}, http.StatusCreated)
	if err != nil {
		http.Error(w, "Could not respond with the new shop ID", 500)
		return
	}

	log.Println(fmt.Sprintf("Created a shop with ID: %d", result))
}

func readAllShopsHandler(w http.ResponseWriter, r *http.Request) {
	shops, err := database.ReadAllShops()
	if err != nil {
		http.Error(w, "Could not list all shops", 500)
		log.Println(err)
		return
	}

	err = sendResponse(w, shops, http.StatusOK)
	if err != nil {
		http.Error(w, "Could not respond with the shops", 500)
		return
	}

	log.Println("Listed all shops")
}

func readShopHandler(w http.ResponseWriter, r *http.Request) {
	var shop db.Shop
	var err error

	shopID := r.PathValue("id")
	shopIDint, err := strconv.ParseInt(shopID, 10, 64)
	if err != nil {
		http.Error(w, "Invalid shop ID", 400)
		log.Println(err)
		return
	}

	shop, err = database.ReadShop(shopIDint)
	if err != nil {
		http.Error(w, fmt.Sprintf("Could not find a shop with ID: %d", shopIDint), 404)
		log.Println(err)
		return
	}

	err = sendResponse(w, shop, http.StatusOK)
	if err != nil {
		http.Error(w, "Could not respond with the sought shop", 500)
		return
	}

	log.Println(fmt.Sprintf("Found and listed a shop with ID: %d", shopIDint))
}

func updateShopHandler(w http.ResponseWriter, r *http.Request) {
	var updateValues = map[string]string{}
	var updatedShop db.Shop
	json.NewDecoder(r.Body).Decode(&updateValues)
	log.Println(updateValues)

	shopID := r.PathValue("id")
	if shopID == "" {
		http.Error(w, "You need to provide an ID of some shop", 400)
		return
	}

	shopIDint, err := strconv.ParseInt(shopID, 10, 64)
	if err != nil {
		http.Error(w, "Invalid shop ID", 400)
		log.Println(err)
		return
	}

	updatedShop, err = database.UpdateShop(shopIDint, updateValues)
	if err != nil {
		http.Error(w, fmt.Sprintf("Could not find a shop with ID: %d", shopIDint), 404)
		log.Println(err)
		return
	}

	err = sendResponse(w, updatedShop, http.StatusOK)
	if err != nil {
		http.Error(w, "Could not respond with the updated shop", 500)
		return
	}

	log.Println(fmt.Sprintf("Patched a shop with ID: %d", shopIDint))
}

func deleteShopHandler(w http.ResponseWriter, r *http.Request) {
	shopID := r.PathValue("id")
	if shopID == "" {
		http.Error(w, "You need to provide an ID of some shop", 400)
		return
	}

	shopIDint, err := strconv.ParseInt(shopID, 10, 64)
	if err != nil {
		http.Error(w, "Invalid shop ID", 400)
		log.Println(err)
		return
	}

	deletedShop, err := database.DeleteShop(shopIDint)
	if err != nil {
		http.Error(w, fmt.Sprintf("Could not find a shop with ID: %d", shopIDint), 404)
		log.Println(err)
		return
	}

	err = sendResponse(w, deletedShop, http.StatusOK)
	if err != nil {
		http.Error(w, "Could not respond with the deleted shop", 500)
		return
	}

	log.Println(fmt.Sprintf("Deleted a shop with ID: %d", shopIDint))
}

func readShop(w http.ResponseWriter, r *http.Request) {
	shopSymbol := r.PathValue("shop")
	log.Println(shopSymbol)
	// if it's a valid id for shop or name of the shop, proceed accordingly
}

func sendResponse(w http.ResponseWriter, data any, status int) error {
	jr, err := json.Marshal(data)
	if err != nil {
		log.Println(err)
		return err
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.WriteHeader(status)

	if _, err = w.Write(jr); err != nil {
		// at this point I couldn't send anything to the client
		log.Println(err)
		return err
	}
	return nil
}
