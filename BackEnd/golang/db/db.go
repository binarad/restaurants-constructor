package db

import (
	"database/sql"
	"fmt"
	"os"
)

const (
	schema = `
create table if not exists Shops (
    id INTEGER PRIMARY KEY,
    name TEXT,
    description TEXT,
    imgUrl TEXT
);
create table if not exists Goods (
    id INTEGER PRIMARY KEY,
    name TEXT,
    description TEXT,
    price INTEGER,
    imgUrl TEXT,
    shopId INTEGER,
    FOREIGN KEY (shopId) REFERENCES Shops(id)
);
`
)

type Good struct {
	Id          int    `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Price       int    `json:"price"`
	ImgURL      string `json:"imgUrl"`
	ShopID      int    `json:"shopId"`
}

type Shop struct {
	Id          int    `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	ImgURL      string `json:"imgUrl"`
}

type RestaurantsDB struct {
	*sql.DB
}

func PrepareDB(dbfile string) (RestaurantsDB, error) {
	os.Remove(dbfile) // for testing purposes
	sqldb, err := sql.Open("sqlite3", dbfile)
	if err != nil {
		return RestaurantsDB{}, err
	}

	if _, err := sqldb.Exec(schema); err != nil {
		return RestaurantsDB{}, err
	}

	return RestaurantsDB{sqldb}, nil
}

func (db *RestaurantsDB) CreateGood(good Good) (int64, error) {
	fmt.Println(good)
	res, err := db.Exec(`
insert into Goods(
    name, description, price, imgUrl, shopId
) values (
    ?, ?, ?, ?, ?
);
`, good.Name, good.Description, good.Price, good.ImgURL, good.ShopID)

	if err != nil {
		return 0, err
	}
	return res.LastInsertId()
}

func (db *RestaurantsDB) ReadAllGoods() ([]Good, error) {
	rows, err := db.Query(`select * from Goods;`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result = make([]Good, 0)
	for rows.Next() {
		var curr Good
		err = rows.Scan(&curr.Id, &curr.Name, &curr.Description, &curr.Price, &curr.ImgURL, &curr.ShopID)
		if err != nil {
			return nil, err
		}
		result = append(result, curr)
	}
	err = rows.Err()
	if err != nil {
		return nil, err
	}
	return result, nil
}
