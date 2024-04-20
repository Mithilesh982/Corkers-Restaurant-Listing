const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 4001;
const fs = require("fs");
const File_Path = "./restaurentdata.json";

app.get("/get-restaurent", (req, res) => {
  fs.readFile(File_Path, "utf-8", (err, data) => {
    if (err) {
      console.log("error reading data in get-restaurent :", err);
    }
    try {
      const restaurantData = JSON.parse(data);
      console.log(restaurantData.restaurants);
      res.send(restaurantData.restaurants);
    } catch (error) {
      console.log("reading restaurent data in get-restaurent");
    }
  });
});

app.post("/delete-restaurent", (req, res) => {
    const restaurantId = req.body.id;
  
    fs.readFile(File_Path, "utf-8", (err, data) => {
      if (err) {
        console.log("Error reading data from file:", err);
        return res.status(500).json({ message: "Error reading data" });
      }
  
      try {
        const fetchedData = JSON.parse(data);
        const updatedRestaurants = fetchedData.restaurants.filter(
          (restaurant) => restaurant.id !== restaurantId
        );
  
        // Update the IDs of the remaining restaurants
        const updatedData = {
          restaurants: updatedRestaurants.map((restaurant, index) => ({
            ...restaurant,
            id: index + 1,
          })),
        };
  
        const finalData = JSON.stringify(updatedData, null, 2);
  
        fs.writeFile(File_Path, finalData, "utf-8", (err) => {
          if (err) {
            console.log("Error writing data to file:", err);
            return res.status(500).json({ message: "Error writing data" });
          }
          res.status(200).json({ message: "Deletion successful", deleted: true });
        });
      } catch (error) {
        console.log("Error processing data:", error);
        res.status(500).json({ message: "Error processing data" });
      }
    });
  });
  
app.post("/add-restaurent", (req, res) => {
  const name = req.body.name;
  const location = req.body.location;
  const cuisine = req.body.cuisine;
  const specialty_dish = req.body.specialty_dish;
  const price_range = req.body.price_range;
  const description = req.body.description;

  fs.readFile(File_Path, "utf-8", (err, data) => {
    if (err) {
      console.log("error in fetching restaurent data :", err);
    }

    try {
      const restaurantData = JSON.parse(data);

      const newRestaurant = {
        id: restaurantData.restaurants.length + 1,
        name: name ? name : "Update Name",
        location: location ? location : "Add Location",
        cuisine: cuisine ? location : "Add Cuisine",
        specialty_dish: specialty_dish ? specialty_dish : "Add Special Dish",
        price_range: price_range ? price_range : "Add Price Range",
        description: description ? description : "Add Description",
      };

      restaurantData.restaurants.push(newRestaurant);

      const finalData = JSON.stringify(restaurantData,null,2)

      fs.writeFile(File_Path, finalData, "utf-8", (err) => {
        if (err) {
          console.log("error in write file", err);
        } else {
          console.log("added and write done");
          res.send({dataAdd:true, message:"Data added successful"})
        }
      });
    } catch (error) {
      console.log("error :", error);
    }
  });
});

app.post("/update-restaurent", (req, res) => {
  const id = req.body.id;
  const name = req.body.name;
  const location = req.body.location;
  const cuisine = req.body.cuisine;
  const specialty_dish = req.body.specialty_dish;
  const price_range = req.body.price_range;
  const description = req.body.description;

  fs.readFile(File_Path, "utf-8", (err, data) => {
    if (err) {
      console.log("error while reading data");
    }

    try {
      const dataForUpdate = JSON.parse(data);
      const updatedData = dataForUpdate.restaurants.map((data) => {
        if (data.id === id) {
          return {
            id: id,
            name: name ? name : data.name,
            location: location ? location : data.location,
            cuisine: cuisine ? cuisine : data.cuisine,
            specialty_dish: specialty_dish
              ? specialty_dish
              : data.specialty_dish,
            price_range: price_range ? price_range : data.price_range,
            description: description ? description : data.description,
          };
        } else {
          return data; // Return original data for other restaurants
        }
      });

      const finalData = { restaurants: updatedData };
      const updatedStringData = JSON.stringify(finalData, null, 2);

      fs.writeFile(File_Path, updatedStringData, "utf-8", (err) => {
        if (err) {
          console.log("error occured in write :", err);
          res.send({ messgae: "Failed to Update", update: false });
        } else {
          console.log("Update restaurent successfull");
          res.send({ messgae: "data Updated", update: true });
        }
      });
    } catch (error) {
      console.log("error");
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
