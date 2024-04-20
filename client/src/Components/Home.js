import React, { useState, useEffect } from "react";
import axios from "axios";
import './Home.css'

function Home() {
  const [restaurantData, setRestaurantData] = useState([]);
  const [modalRestaurant, setModalRestaurant] = useState({});
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [specialDish, setSpecialDish] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const getRestaurent = () => {
    axios
      .get("http://localhost:4001/get-restaurent")
      .then((response) => {
        setRestaurantData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching restaurant data:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    getRestaurent();
  }, []);

  const updateModalRestaurant = (id) => {
    const restaurant = restaurantData.find((data) => data.id === id);
    setModalRestaurant(restaurant || {});
    setId(restaurant?.id || "");
    setName(restaurant?.name || "");
    setLocation(restaurant?.location || "");
    setCuisine(restaurant?.cuisine || "");
    setSpecialDish(restaurant?.specialty_dish || "");
    setPrice(restaurant?.price_range || "");
  };

  const handleSave = () => {
    axios
      .post("http://localhost:4001/update-restaurent", {
        id: id,
        name: name,
        location: location,
        cuisine: cuisine,
        specialty_dish: specialDish,
        price_range: price,
        description: "",
      })
      .then((response) => {
        if (response.data.update) {
          getRestaurent();
        }
      });
  };

  const DeleteRestaurent = (id) => {
    axios
      .post("http://localhost:4001/delete-restaurent", {
        id: id,
      })
      .then((response) => {
        if (response.data.deleted) {
          getRestaurent();
        }
      });
  };

  const AddRestaurent = () => {
    axios
      .post("http://localhost:4001/add-restaurent", {
        name: name,
        location: location,
        cuisine: cuisine,
        specialty_dish: specialDish,
        price_range: price,
        description: description,
      })
      .then((response) => {
        if (response.data.dataAdd) {
          getRestaurent();
        }
      });
  };

  const clearValues = () => {
    setId("");
    setName("");
    setLocation("");
    setCuisine("");
    setSpecialDish("");
    setPrice("");
    setDescription("");
  };

  return (
    <>
      {loading ? (
        <>
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "100vh" }}
          >
            <div className="spinner-border" role="status"></div>
          </div>
        </>
      ) : (
        <>
          <div className="p-5">
            <div className="d-flex justify-content-center my-2">
              <button
                type="button"
                className="btn btn-outline-primary"
                data-bs-toggle="modal"
                data-bs-target="#CreateModal"
              >
                Add Restaurant
              </button>
            </div>

            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Location</th>
                  <th scope="col">Cuisine</th>
                  <th scope="col">specialty_dish</th>
                  <th scope="col">price_range</th>
                  <th scope="col">description</th>
                  <th scope="col">Access</th>
                </tr>
              </thead>
              <tbody>
                {restaurantData.map((data) => (
                  <tr key={data.id}>
                    <th scope="row">{data.id}</th>
                    <td className="name">{data.name}</td>
                    <td className="location">{data.location}</td>
                    <td className="cuisine" >{data.cuisine}</td>
                    <td>{data.specialty_dish}</td>
                    <td>{data.price_range}</td>
                    <td>{data.description}</td>
                    <td className="">
                      <div className="d-flex my-3">
                        <button
                          type="button"
                          className="btn btn-outline-dark"
                          data-bs-toggle="modal"
                          data-bs-target="#UpdateModal"
                          onClick={() => updateModalRestaurant(data.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-outline-danger mx-1"
                          onClick={() => {
                            DeleteRestaurent(data.id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* <!--Update Modal --> */}
      <div
        className="modal fade"
        id="UpdateModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="UpdateModal">
                {" "}
                Update Restaurant Data
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={clearValues}
              ></button>
            </div>
            <div className="modal-body">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingName"
                  name="name"
                  placeholder="Name"
                  value={name || ""}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
                <label htmlFor="floatingName">Name</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatinglocation"
                  name="Location"
                  placeholder="Location"
                  value={location || ""}
                  onChange={(e) => {
                    setLocation(e.target.value);
                  }}
                />
                <label htmlFor="floatinglocation">Location</label>
              </div>
              {/* More input fields */}
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingcuisine"
                  name="cuisine"
                  placeholder="Cuisine"
                  value={cuisine || ""}
                  onChange={(e) => {
                    setCuisine(e.target.value);
                  }}
                />
                <label htmlFor="floatingcuisine">Cuisine</label>
              </div>
              {/* More input fields */}
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingspecialty_dish"
                  name="Special Dish"
                  placeholder="Special Dish"
                  value={specialDish || ""}
                  onChange={(e) => {
                    setSpecialDish(e.target.value);
                  }}
                />
                <label htmlFor="floatingspecialty_dish">Special Dish</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingPrice"
                  name="price"
                  placeholder="Price"
                  value={price || ""}
                  onChange={(e) => {
                    setPrice(e.target.value);
                  }}
                />
                <label htmlFor="floatingspecialty_dish">Prize Range</label>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={clearValues}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
              >
                Update Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* <!--Create Modal --> */}
      <div
        className="modal fade"
        id="CreateModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                Add Restaurant
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={clearValues}
              ></button>
            </div>
            <div className="modal-body">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingName"
                  name="name"
                  placeholder="Name"
                  value={name || ""}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
                <label htmlFor="floatingName">Name</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatinglocation"
                  name="Location"
                  placeholder="Location"
                  value={location || ""}
                  onChange={(e) => {
                    setLocation(e.target.value);
                  }}
                />
                <label htmlFor="floatinglocation">Location</label>
              </div>
              {/* More input fields */}
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingcuisine"
                  name="cuisine"
                  placeholder="Cuisine"
                  value={cuisine || ""}
                  onChange={(e) => {
                    setCuisine(e.target.value);
                  }}
                />
                <label htmlFor="floatingcuisine">Cuisine</label>
              </div>
              {/* More input fields */}
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingspecialty_dish"
                  name="Special Dish"
                  placeholder="Special Dish"
                  value={specialDish || ""}
                  onChange={(e) => {
                    setSpecialDish(e.target.value);
                  }}
                />
                <label htmlFor="floatingspecialty_dish">Special Dish</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingPrice"
                  name="price"
                  placeholder="Price"
                  value={price || ""}
                  onChange={(e) => {
                    setPrice(e.target.value);
                  }}
                />
                <label htmlFor="floatingspecialty_dish">Prize Range</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingDescription"
                  name="Description"
                  placeholder="Description"
                  value={description || ""}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                />
                <label htmlFor="floatingDescription">Description</label>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={clearValues}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-oulinr-primary"
                onClick={AddRestaurent}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
