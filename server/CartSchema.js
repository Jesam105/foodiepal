const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Student' }, // Ensure this is set correctly
  items: [
    {
      _id: { type: String, required: true },
      food: { type: String, required: true },
      description: { type: String },
      // Include any other fields you need
    },
  ],
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
