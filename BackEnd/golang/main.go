package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"rcb/db"

	_ "github.com/mattn/go-sqlite3"
)

const dbName = "./foo.db"

var database db.RestaurantsDB

func main() {
	database, _ = db.PrepareDB(dbName) // for now this works
	defer database.Close()

	mux := http.NewServeMux()
	mux.HandleFunc("POST /goods", createGoodHandler)
	mux.HandleFunc("GET /goods", readAllGoodsHandler)
	mux.HandleFunc("GET /goods/{id}", readGoodHandler)
	mux.HandleFunc("PATCH /goods/{id}", updateGoodHandler)
	mux.HandleFunc("DELETE /goods/{id}", deleteGoodHandler)

	mux.HandleFunc("GET /{shop}", readShop)

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

	newGoodID, err := prepareResponse(&w, struct {
		Id int64 `json:"id"`
	}{Id: result})
	if err != nil {
		http.Error(w, "Could not respond with the new good ID", 500)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusCreated)
	if _, err = w.Write(newGoodID); err != nil {
		log.Println(err)
		return
	}

	log.Println(fmt.Sprintf("Created a good with ID: %d", newGoodID))
}

func readAllGoodsHandler(w http.ResponseWriter, r *http.Request) {
	goods, err := database.ReadAllGoods()
	if err != nil {
		http.Error(w, "Could not list all goods", 500)
		log.Println(err)
		return
	}

	goodsJSON, err := prepareResponse(&w, goods)
	if err != nil {
		http.Error(w, "Could not marshal JSON of the goods", 500)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
	if _, err = w.Write(goodsJSON); err != nil {
		log.Println(err)
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

	goodJSON, err := prepareResponse(&w, good)
	if err != nil {
		http.Error(w, "Could not marshal JSON of the sought good", 500)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
	if _, err = w.Write(goodJSON); err != nil {
		log.Println(err)
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

	updatedGoodJSON, err := prepareResponse(&w, updatedGood)
	if err != nil {
		http.Error(w, "Could not respond with the updated good", 500)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
	if _, err = w.Write(updatedGoodJSON); err != nil {
		log.Println(err)
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

	deletedGoodJSON, err := prepareResponse(&w, deletedGood)
	if err != nil {
		http.Error(w, "Could not respond with the deleted good", 500)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
	if _, err = w.Write(deletedGoodJSON); err != nil {
		log.Println(err)
		return
	}

	log.Println(fmt.Sprintf("Deleted a good with ID: %d", goodIDint))
}

func readShop(w http.ResponseWriter, r *http.Request) {
	shopSymbol := r.PathValue("shop")
	log.Println(shopSymbol)
	// if it's a valid id for shop or name of the shop, proceed accordingly
}

func prepareResponse(w *http.ResponseWriter, data any) ([]byte, error) {
	jr, err := json.Marshal(data)
	if err != nil {
		return nil, err
	}

	(*w).Header().Set("Content-Type", "application/json")
	(*w).Header().Set("Access-Control-Allow-Origin", "*")

	return jr, nil
}
