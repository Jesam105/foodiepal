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
  const { restaurant, location, secretkey, email, password, usertype } =
    req.body;

  try {
    // Validate the usertype to ensure it's an admin (restaurant owner)
    if (usertype !== "admin") {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid usertype" });
    }

    // Check if the email already exists in the Restaurant collection
    const oldRestaurant = await Restaurant.findOne({ email });
    if (oldRestaurant) {
      return res
        .status(409)
        .json({ status: "error", message: "Restaurant already exists" });
    }

    // Validate secret key
    if (secretkey !== "vuna") {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid Secret Key" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new restaurant (admin) object
    const newRestaurant = new Restaurant({
      restaurant,
      location,
      secretkey, // you may omit storing the secret key if it is not needed in the database
      email,
      password: hashedPassword,
      usertype, // "admin"
    });

    // Save the new restaurant to the database
    await newRestaurant.save();

    // Respond with success message
    res
      .status(201)
      .json({ status: "ok", message: "Restaurant registered successfully" });
  } catch (error) {
    console.error("Error registering restaurant:", error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

app.post("/student", async (req, res) => {
  const { name, email, password, usertype } = req.body;

  try {
    // Validate the usertype to ensure it's a student
    if (usertype !== "student") {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid usertype" });
    }

    // Check if the email already exists in the Student collection
    const oldStudent = await Student.findOne({ email });
    if (oldStudent) {
      return res
        .status(409)
        .json({ status: "error", message: "Student already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new student object
    const newStudent = new Student({
      name,
      email,
      password: hashedPassword,
      usertype, // "student"
    });

    // Save the new student to the database
    await newStudent.save();

    // Respond with success message
    res
      .status(201)
      .json({ status: "ok", message: "Student registered successfully" });
  } catch (error) {
    console.error("Error registering student:", error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

// Login restaurant
// app.post("/login-restaurant", async (req, res) => {
//   const { email, password } = req.body;

//   const oldEmail = await Restaurant.findOne({ email });
//   if (!oldEmail) {
//     return res
//       .status(404)
//       .json({ status: "error", message: "Restaurant not found" });
//   }

//   const isMatch = await bcrypt.compare(password, oldEmail.password);
//   if (!isMatch) {
//     return res
//       .status(401)
//       .json({ status: "error", message: "Invalid credentials" });
//   }

//   const token = jwt.sign(
//     { userId: oldEmail._id, email: oldEmail.email },
//     process.env.JWT_SECRET,
//     {
//       expiresIn: "24h",
//     }
//   );

//   res.status(200).json({ status: "ok", message: "Login successful", token });
// });

app.post("/login", async (req, res) => {
  console.log("Login request received:", req.body);

  const { email, password } = req.body;

  try {
    let user;
    let usertype;

    user = await Student.findOne({ email });
    if (user) {
      usertype = "student";
    }

    if (!user) {
      user = await Restaurant.findOne({ email });
      if (user) {
        usertype = "admin";
      }
    }
    if (!user) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        usertype,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    // Respond with token and usertype
    res.status(200).json({
      status: "ok",
      message: "Login successful",
      token,
      usertype,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

// Fetch user data by token
app.post("/restaurant-data", async (req, res) => {
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
      return res
        .status(401)
        .send({ status: "Error", message: "Token expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res
        .status(400)
        .send({ status: "Error", message: "Invalid token" });
    }
    res.status(500).send({ status: "Error", message: error.message });
  }
});

app.post("/student-data", async (req, res) => {
  const { token } = req.body;

  try {
    console.log("Token received:", token); // Log the token

    const user = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", user); // Log the decoded token

    const userEmail = user.email;
    const foundUser = await Student.findOne({ email: userEmail });

    if (foundUser) {
      console.log("User found:", foundUser); // Log the found user
      res.send({ status: "Ok", data: foundUser });
    } else {
      res.status(404).send({ status: "Error", message: "User not found" });
    }
  } catch (error) {
    console.error("Error verifying token:", error); // Log any errors
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .send({ status: "Error", message: "Token expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res
        .status(400)
        .send({ status: "Error", message: "Invalid token" });
    }
    res.status(500).send({ status: "Error", message: error.message });
  }
});

// Food Menu API
app.post("/food-menu", async (req, res) => {
  const { food, description, price, image, status } = req.body;

  const oldFood = await Food.findOne({ food });
  if (oldFood) {
    return res.status(409).json({
      status: "error",
      data: "Food Item already exists for this restaurant",
    });
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

app.get('/restaurants', async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
