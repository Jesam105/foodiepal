const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StudentInfo",
    required: true,
  },
  items: [
    {
      food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FoodMenu",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
});

mongoose.model("Cart", CartSchema);
