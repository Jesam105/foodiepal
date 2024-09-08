const mongoose = require("mongoose");

const FoodMenuSchema = new mongoose.Schema(
  {
    food: { type: String, required: true }, 
    description: { type: String, required: true }, 
    price: { type: String, required: true }, 
    image: { type: String, required: true }, 
    status: { type: String, required: true }, 
  },
  {
    collection: "FoodMenu", 
  }
);

mongoose.model("FoodMenu", FoodMenuSchema);
