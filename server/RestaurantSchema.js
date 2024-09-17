const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema(
  {
    restaurant: { type: String, required: true }, 
    location: { type: String, required: true }, 
    secretkey: { type: String, required: true }, 
    email: { type: String, required: true, unique: true }, 
    password: { type: String, required: true }, 
    // ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "RestaurantInfo", required: true }, // Add ownerId field
    // foodItems: { type: mongoose.Schema.Types.ObjectId, ref: "FoodMenu" }
  },
  {
    collection: "RestaurantInfo", 
  }
);

mongoose.model("RestaurantInfo", RestaurantSchema);
