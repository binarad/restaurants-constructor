import sqlite3 from "sqlite3";

export type Good = {
  id: number;
  name: string;
  description: string;
  price: number;
  imgUrl: string;
};

class Goods {
  db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database("db");
    this.db.run(
      "create table if not exists GOODS(id INTEGER PRIMARY KEY, name TEXT, description TEXT, price INTEGER, imgUrl TEXT)"
    );
  }

  push(good: Good) {
    this.db.run(
      "insert into GOODS(name, description, price, imgUrl) values(?, ?, ?, ?)",
      [good.name, good.description, good.price, good.imgUrl]
    );
  }

  edit(good: Good) {
    this.db.run(
      "update GOODS set name=?, description=?, price=?, imgUrl=? where id = ?",
      [good.name, good.description, good.price, good.imgUrl, good.id]
    );
  }

  delete(goodId: number): boolean {
    this.db.run("delete from GOODS where id = ?", [goodId]);
    return true;
  }

  find(goodId: number): Promise<Good | null> {
    return new Promise((resolve) => {
      this.db.all(
        "select name from GOODS where id=?",
        [goodId],
        (err: Error, rows: Good[]) => {
          resolve(rows[0] ?? null);
        }
      );
    });
  }

  readAll(): Promise<Good[]> {
    return new Promise((resolve) => {
      this.db.all("select * from GOODS", (err: Error, rows: Good[]) => {
        resolve(rows);
      });
    });
  }
}

const goods = new Goods();

export default goods;
