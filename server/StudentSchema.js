const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Student's name
    matricNumber: { type: String, required: true, unique: true }, // Matriculation number (unique)
    email: { type: String, required: true, unique: true }, // Email address (unique)
    password: { type: String, required: true }, // Password
  },
  {
    collection: "StudentInfo", 
  }
);

mongoose.model("StudentInfo", StudentSchema);
