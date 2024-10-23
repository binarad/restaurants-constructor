package main

import (
	"encoding/json"
	"log"
	"net/http"
	"net/url"
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
	mux.HandleFunc("GET /goods/create", createGood)
	mux.HandleFunc("GET /goods/read", readGood)
	mux.HandleFunc("GET /{shop}", showShop)
	log.Fatal(http.ListenAndServe(":1337", mux))
}

func createGood(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseForm(); err != nil {
		http.Error(w, "Could not parse the form", http.StatusBadRequest)
		log.Println(err)
		return
	}
	good := parseGood(r.Form)
	log.Println(good)

	result, err := database.CreateGood(good)
	if err != nil {
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		log.Println(err)
		return
	}

    bytes, err := prepareResponse(&w, result)
    if err != nil {
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		log.Println(err)
		return
    }

    w.WriteHeader(http.StatusCreated)
    if _, err := w.Write(bytes); err != nil {
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		log.Println(err)
		return
    }
}

func readGood(w http.ResponseWriter, r *http.Request) {
	result, err := database.ReadAllGoods()
	if err != nil {
		log.Println(err)
		return
	}

    bytes, err := prepareResponse(&w, result)
    if err != nil {
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		log.Println(err)
		return
    }

    if _, err := w.Write(bytes); err != nil {
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		log.Println(err)
		return
    }
}

func showShop(w http.ResponseWriter, r *http.Request) {
	shopSymbol := r.PathValue("shop")
	log.Println(shopSymbol)
	// if it's a valid id for shop or name of the shop, proceed accordingly
}

func parseGood(v url.Values) db.Good {
	id, _ := strconv.Atoi(v.Get("id"))
	price, _ := strconv.Atoi(v.Get("price"))
	shopId, _ := strconv.Atoi(v.Get("shopId"))

	good := db.Good{
		Id:          id,
		Name:        v.Get("name"),
		Description: v.Get("description"),
		Price:       price,
		ImgURL:      v.Get("imgUrl"),
		ShopID:      shopId,
	}
	return good
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
