package db

import (
	"database/sql"
	"os"
	"strings"
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

// TODO: Panic right here instead of returning the error - starting the database is critical
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
	res, err := db.Exec(`
insert into Goods(
    name, description, price, imgUrl, shopId
) values (
    ?, ?, ?, ?, ?
)
`, good.Name, good.Description, good.Price, good.ImgURL, good.ShopID)

	if err != nil {
		return 0, err
	}
	return res.LastInsertId()
}

func (db *RestaurantsDB) ReadGood(id int64) (Good, error) {
	row := db.QueryRow(`select * from Goods where id = ?`, id)
	var good Good
	err := row.Scan(&good.Id, &good.Name, &good.Description, &good.Price, &good.ImgURL, &good.ShopID)
	if err != nil {
		return Good{}, err
	}
	return good, nil
}

func (db *RestaurantsDB) ReadAllGoods() ([]Good, error) {
	rows, err := db.Query(`select * from Goods`)
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

func (db *RestaurantsDB) UpdateGood(id int64, values map[string]string) (Good, error) {
	query := `update Goods set `
	cols := [5]string{"name", "description", "price", "imgUrl", "shopId"}
	parts := make([]string, 0, 5)
	args := make([]any, 0, 5)

	for _, col := range cols {
		if value, ok := values[col]; ok {
			parts = append(parts, col+` = ?`)
			args = append(args, value)
		}
	}

	query += strings.Join(parts, ",") + ` where id = ? returning *`
	args = append(args, id)
	row := db.QueryRow(query, args...)

	var updatedGood Good
	err := row.Scan(&updatedGood.Id, &updatedGood.Name, &updatedGood.Description, &updatedGood.Price, &updatedGood.ImgURL, &updatedGood.ShopID)
	if err != nil {
		return Good{}, err
	}
	return updatedGood, nil
}

func (db *RestaurantsDB) DeleteGood(id int64) (Good, error) {
	row := db.QueryRow(`delete from Goods where id = ? returning *`, id)
	var good Good
	err := row.Scan(&good.Id, &good.Name, &good.Description, &good.Price, &good.ImgURL, &good.ShopID)
	if err != nil {
		return Good{}, err
	}
	return good, nil
}
