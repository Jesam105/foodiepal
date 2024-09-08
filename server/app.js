const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables from .env file

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Database Connected"))
  .catch((e) => console.log(e));

require("./StudentSchema");
require("./RestaurantSchema");
require("./FoodMenuSchema");

const Student = mongoose.model("StudentInfo");
const Restaurant = mongoose.model("RestaurantInfo");
const Food = mongoose.model("FoodMenu");

app.get("/", (req, res) => {
  res.send({ status: "Started" });
});

// Register restaurant owner
app.post("/restaurant", async (req, res) => {
  const { restaurant, location, secretkey, email, password, confirmPassword } = req.body;

  // if (password !== confirmPassword) {
  //   return res.status(400).json({ status: "error", message: "Passwords do not match" });
  // }

  const oldRestaurant = await Restaurant.findOne({ email });
  if (oldRestaurant) {
    return res.status(409).json({ data: "Restaurant already exists" });
  }

  if (secretkey !== "vuna") {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid Secret Key" });
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  try {
    await Restaurant.create({
      restaurant,
      location,
      secretkey,
      email,
      password: encryptedPassword,
    });
    res
      .status(201)
      .json({ status: "ok", data: "Account Created Successfully" });
  } catch (error) {
    res.status(500).json({ status: "error", data: error.message });
  }
});

// Login restaurant
app.post("/login-restaurant", async (req, res) => {
  const { email, password } = req.body;

  const oldEmail = await Restaurant.findOne({ email });
  if (!oldEmail) {
    return res
      .status(404)
      .json({ status: "error", message: "Restaurant not found" });
  }

  const isMatch = await bcrypt.compare(password, oldEmail.password);
  if (!isMatch) {
    return res
      .status(401)
      .json({ status: "error", message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: oldEmail._id, email: oldEmail.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  res.status(200).json({ status: "ok", message: "Login successful", token });
});

// Fetch user data by token
app.post("/userdata", async (req, res) => {
  const { token } = req.body;

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    const userEmail = user.email;

    const foundUser = await Restaurant.findOne({ email: userEmail });

    if (foundUser) {
      res.send({ status: "Ok", data: foundUser });
    } else {
      res.status(404).send({ status: "Error", message: "User not found" });
    }
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).send({ status: "Error", message: "Token expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(400).send({ status: "Error", message: "Invalid token" });
    }
    res.status(500).send({ status: "Error", message: error.message });
  }
});

// Food Menu API
app.post("/food-menu", async (req, res) => {
  const { food, description, price, image, status } = req.body;

  const oldFood = await Food.findOne({ food });
  if (oldFood) {
    return res.status(409).json({ data: "Food Item already exists" });
  }

  try {
    await Food.create({
      food,
      description,
      price,
      image,
      status,
    });
    res.status(201).json({ status: "ok", data: "Added Successfully" });
  } catch (error) {
    res.status(500).json({ status: "error", data: error.message });
  }
});

app.get("/food-menu", async (req, res) => {
  try {
    const foodItems = await Food.find();
    res.status(200).json(foodItems);
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
