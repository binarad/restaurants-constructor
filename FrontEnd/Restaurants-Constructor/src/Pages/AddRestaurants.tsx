import { TextField, Button, Alert } from "@mui/material";
import { AddRestaurantType } from "../data";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function AddRestaurants(props: AddRestaurantType) {
  const { title, setTitle, description, setDescription, imgUrl, setImgUrl } =
    props;

  const [previewImg, setPreviewImg] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // const [imgUrl, setImgUrl] = useState<string>()
  const allowedFileTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
  ]; // Allowed file types for restaurant icon

  const uploadImg = async (file: File) => {
    try {
      const imgForm = new FormData();
      imgForm.append("image", file);

      const resp = await fetch("http://localhost:1337/images", {
        method: "POST",
        // mode: 'no-cors',
        // headers: {
        // 	'Content-Type': 'image/png',
        // 	'Access-Control-Allow-Origin': '*',
        // },
        body: imgForm,
      });
      const respJSON = await resp.json();
      setImgUrl(respJSON.link);
      console.log(imgUrl);
    } catch (error) {
      console.error("Something unexpected happened: ", error);
    }
    // alert(JSON.stringify(data))
  };
  const AddGoods = async (
    name: string,
    description: string,
    price: string,
    imgUrl: string,
  ) => {
    try {
      const GoodsData = {
        name: name,
        description: description,
        price: price,
        imgUrl: imgUrl,
      };

      const goodsResponse = await fetch("http://localhost:1337/goods", {
        method: "POST",
        // mode: 'no-cors',
        // headers: {
        // 	'Content-Type': 'Application/JSON',
        // 	'Access-Control-Allow-Origin': '*',
        // },
        body: JSON.stringify(GoodsData),
      });

      const newGood = await goodsResponse.json();
      // console.log(newGood)
      console.log(imgUrl);
    } catch (error) {
      console.error(`Unexpected error while adding restaurant: ${error}`);
    }
  };
  const PrintDB = async () => {
    const data = await fetch("http://localhost:1337/goods");
    const jsonData = await data.json();
    console.log(jsonData);
  };

  return (
    <div
      id="add-restaurant-container"
      className="flex justify-center items-center h-full"
    >
      <div className="w-[1200px] h-[700px] bg-slate-100 rounded-[20px] flex items-center justify-center border-slate-300 border-2 flex-col gap-3">
        <TextField
          required
          label="Restaurant name"
          variant="outlined"
          autoComplete="off"
          onChange={(e) => {
            e.preventDefault();
            setTitle(e.target.value);
          }}
          value={title || ""}
          sx={{ width: "300px", fontSize: "18px", m: "5px" }}
        />
        <TextField
          required
          multiline
          variant="outlined"
          autoComplete="off"
          onChange={(e) => {
            e.preventDefault();
            setDescription(e.target.value);
          }}
          value={description}
          label="Restaurant description"
          sx={{ width: "300px", fontSize: "18px", m: "5px" }}
        />
        <img
          src={previewImg}
          className="w-[300px] h-[300px] rounded-lg object-cover border-none"
        />
        <Button variant="contained">
          <label htmlFor="restaurant-icon-input">Click to upload photo</label>
        </Button>
        <input
          style={{ display: "none" }}
          type="file"
          name="restaurant-icon-input"
          id="restaurant-icon-input"
          onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
            e.preventDefault();
            if (e.target.files && e.target.files[0]) {
              const file = e.target.files[0];
              setSelectedFile(file);
              setPreviewImg(URL.createObjectURL(e.target.files![0])); //Prewiew image
            }
          }}
          width={300}
          height={300}
          accept={allowedFileTypes.join(",")}
        />
        <div className=" w-[250px] justify-between flex">
          <Link to="/admin">
            <Button
              variant="contained"
              sx={{ width: "100px" }}
              onClick={() => {
                uploadImg(selectedFile!);
                AddGoods(title!, description!, "1", imgUrl);
                PrintDB();
              }}
            >
              Add
            </Button>
          </Link>
          <Link to="/admin">
            <Button variant="outlined" sx={{ width: "100px" }}>
              Cancel
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
