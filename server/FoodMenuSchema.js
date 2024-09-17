const mongoose = require("mongoose");

const FoodMenuSchema = new mongoose.Schema(
  {
    food: { type: String, required: true }, 
    description: { type: String, required: true }, 
    price: { type: String, required: true }, 
    image: { type: String, required: true }, 
    status: { type: String, required: true }, 
    // restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "RestaurantInfo", required: true }  // Reference to restaurant owner
  },
  {
    collection: "FoodMenu", 
  }
);

mongoose.model("FoodMenu", FoodMenuSchema);
