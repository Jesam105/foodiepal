const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema(
  {
    restaurant: { type: String, required: true }, 
    location: { type: String, required: true }, 
    secretkey: { type: String, required: true }, 
    email: { type: String, required: true, unique: true }, 
    password: { type: String, required: true }, 
  },
  {
    collection: "RestaurantInfo", 
  }
);

mongoose.model("RestaurantInfo", RestaurantSchema);
