const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Database Connected"))
  .catch((e) => console.log(e));

require("./StudentSchema");
require("./RestaurantSchema");
require("./FoodMenuSchema");
require("./CartSchema");

const Student = mongoose.model("StudentInfo");
const Restaurant = mongoose.model("RestaurantInfo");
const Food = mongoose.model("FoodMenu");
const Cart = mongoose.model("Cart");

app.get("/", (req, res) => {
  res.send({ status: "Started" });
});

// Register restaurant owner API
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
// Register student API
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
// Login API
app.post("/login", async (req, res) => {
  console.log("Login request received:", req.body);
  const { email, password } = req.body;

  try {
    let user, usertype, id;

    // Try finding the user as a Student
    user = await Student.findOne({ email });
    if (user) {
      usertype = "student";
      id = user._id; // Save the studentId
    }

    // If not found, try finding the user as a Restaurant Owner
    if (!user) {
      user = await Restaurant.findOne({ email });
      if (user) {
        usertype = "admin";
        id = user._id; // Save the restaurantId
      }
    }

    // If no user found, send invalid credentials error
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

    // Generate JWT token with restaurantId or studentId, email, and usertype
    const token = jwt.sign(
      { id, email: user.email, usertype },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      status: "ok",
      message: "Login successful",
      token,
      usertype,
      id, // Send restaurantId or studentId in the response
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});
// Fetch restaurant user data by token
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
// Fetch student user data by token
app.post("/student-data", async (req, res) => {
  const { token } = req.body;

  try {
    console.log("Token received:", token); // Log the token

    const user = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", user); // Log the decoded token

    const userEmail = user.email;
    const foundUser = await Student.findOne({ email: userEmail });

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
// Add Food Item API
app.post("/food-menu", async (req, res) => {
  const { food, description, price, image, status } = req.body;
  const token = req.headers.authorization?.split(" ")[1]; // Use Bearer token format

  try {
    // Verify the token and get user details
    let user;
    try {
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid or expired token" });
    }

    // Fetch the restaurant owner using the token
    const restaurant = await Restaurant.findById(user.id);
    if (!restaurant) {
      return res
        .status(404)
        .json({ status: "error", message: "Restaurant not found" });
    }

    // Check if the food item already exists for the restaurant
    const existingFood = await Food.findOne({
      food,
      restaurant: restaurant._id,
    });
    if (existingFood) {
      return res.status(409).json({
        status: "error",
        message: "Food item already exists for this restaurant",
      });
    }

    // Create a new food item for the restaurant
    const newFood = new Food({
      food,
      description,
      price,
      image,
      status,
      restaurant: restaurant._id,
    });

    await newFood.save();
    res
      .status(201)
      .json({ status: "ok", message: "Food item added successfully" });
  } catch (error) {
    console.error("Error adding food item:", error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});
// Fetch Food Items for the logged-in restaurant
app.get("/food-menu", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  try {
    // Verify the token and extract user information
    let user;
    try {
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid or expired token" });
    }

    // Fetch the restaurant owner using the verified token (with the restaurant owner's ID from token)
    const restaurant = await Restaurant.findOne({ _id: user.id });
    if (!restaurant) {
      return res
        .status(404)
        .json({ status: "error", message: "Restaurant not found" });
    }

    // Fetch all food items belonging to this restaurant using the restaurant's _id
    const foodItems = await Food.find({ restaurant: restaurant._id });

    if (foodItems.length === 0) {
      return res
        .status(200)
        .json({ status: "ok", message: "No food items found", foodItems: [] });
    }

    // Return the found food items
    res.status(200).json({ status: "ok", foodItems });
  } catch (error) {
    console.error("Error fetching food items:", error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

// Fetch all restaurants API
app.get("/restaurants", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    console.log("Fetched restaurants:", restaurants); // Log fetched restaurants
    res.status(200).json(restaurants);
  } catch (error) {
    console.error("Error fetching restaurants:", error); // Log any error
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.get("/restaurant/:id/menu", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching food items for restaurant ID:", id);

    // Assuming `restaurant` field is referenced by an ID or name in the Food model
    const foodItems = await Food.find({ restaurant: id });

    if (!foodItems || foodItems.length === 0) {
      console.log("No food items found for this restaurant.");
      return res
        .status(404)
        .json({ message: "No food items found for this restaurant" });
    }

    console.log("Found food items:", foodItems);
    res.status(200).json({ foodItems });
  } catch (error) {
    console.error("Error fetching food items:", error);
    res.status(500).json({ error: "Failed to fetch food items" });
  }
});

app.post("/add-to-cart", async (req, res) => {
  const { food, quantity } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  try {
    // Verify the token and get the user details
    let user;
    try {
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid or expired token" });
    }

    // Check if the user is a student
    if (user.usertype !== "student") {
      return res
        .status(403)
        .json({
          status: "error",
          message: "Only students can add to the cart",
        });
    }

    // Fetch the student using the token
    const student = await Student.findById(user.id);
    if (!student) {
      return res
        .status(404)
        .json({ status: "error", message: "Student not found" });
    }

    // Check if the food item exists
    const foodItem = await Food.findById(food);
    if (!foodItem) {
      return res
        .status(404)
        .json({ status: "error", message: "Food item not found" });
    }

    // Check if the student already has a cart
    let cart = await Cart.findOne({ studentId: student._id });

    if (!cart) {
      // Create a new cart if none exists
      cart = new Cart({
        studentId: student._id,
        items: [{ foodId: foodItem._id, quantity }],
      });
    } else {
      // Check if the food item is already in the cart
      const itemIndex = cart.items.findIndex(
        (item) => item.food.toString() === foodItem._id.toString()
      );

      if (itemIndex > -1) {
        // Update quantity if the item already exists in the cart
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Add new item to the cart
        cart.items.push({ food: foodItem._id, quantity });
      }
    }

    // Save the cart
    await cart.save();

    res
      .status(201)
      .json({ status: "ok", message: "Item added to cart successfully", cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

app.get("/cart", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  try {
    // Verify the token and get the user details
    let user;
    try {
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ status: "error", message: "Invalid or expired token" });
    }

    // Fetch the student's cart
    const cart = await Cart.findOne({ student: user.id }).populate("items.food");

    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ status: "ok", message: "Cart is empty" });
    }

    res.status(200).json({ status: "ok", cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});


app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
