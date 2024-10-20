import http from "node:http";
import goods from "./goods";
import type { Good } from "./goods";

// Create an HTTP server
const server = http.createServer((_, res) => {
  res.writeHead(200, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
});

const makeJSONError = (error: string): string => {
  return JSON.stringify({
    error,
  });
};

const parseGoodFromUrlParams = (params: URLSearchParams): Good | null => {
  const goodFieldsValues: string[] = [];
  for (let paramName of ["id", "name", "description", "price", "imgUrl"]) {
    const value = params.get(paramName);
    if (!value) {
      console.error(`${paramName} is missing`);
      return null;
    }
    goodFieldsValues.push(value);
  }

  const [id, name, description, price, imgUrl] = goodFieldsValues;
  return {
    id: parseInt(id),
    name,
    description,
    price: parseInt(price),
    imgUrl,
  };
};

const addGood = async (
  searchParams: URLSearchParams,
  res: http.ServerResponse
) => {
  const good = parseGoodFromUrlParams(searchParams);
  if (!good) {
    res.write(makeJSONError("bad good info"));
    return;
  }
  goods.push(good);
  res.write(JSON.stringify({ status: "ok" }));
};

const editGood = async (
  searchParams: URLSearchParams,
  res: http.ServerResponse
) => {
  const newGood = parseGoodFromUrlParams(searchParams);
  if (!newGood) {
    res.write(makeJSONError("bad good info"));
    return;
  }

  const existingGood = await goods.find(newGood.id);
  if (!existingGood) {
    goods.push(newGood);
  } else {
    goods.edit(newGood);
  }

  res.write(JSON.stringify({ status: "ok" }));
};

const deleteGood = (
  searchParams: URLSearchParams,
  res: http.ServerResponse
) => {
  const id = searchParams.get("id");
  if (!id) {
    res.write(makeJSONError("bad good info"));
    return;
  }

  if (!goods.delete(parseInt(id))) {
    console.error("good not exist");
    return;
  }
  res.write(JSON.stringify({ status: "ok" }));
};

const printGoods = async (
  searchParams: URLSearchParams,
  res: http.ServerResponse
) => {
  res.write(JSON.stringify(await goods.readAll()));
};

const processUrl = async (url: URL, res: http.ServerResponse) => {
  switch (url.pathname) {
    case "/goods/add":
      await addGood(url.searchParams, res);
      break;
    case "/goods/edit":
      await editGood(url.searchParams, res);
      break;
    case "/goods/delete":
      deleteGood(url.searchParams, res);
      break;
    case "/goods/print":
      await printGoods(url.searchParams, res);
      break;
    default:
      res.writeHead(400, "bad url");
  }
  res.end();
};

server.on("request", (req, res) => {
  const url = new URL(`http://${process.env.HOST ?? "localhost"}${req.url}`);
  processUrl(url, res);
});

// Now that server is running
server.listen(1337, "127.0.0.1", () => {
  console.log("started server");
});
