const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Student's name
    email: { type: String, required: true, unique: true }, // Email address (unique)
    password: { type: String, required: true }, // Password
    usertype: {type: String, required: true, enum: ['student', 'admin'], }
    
  },
  {
    collection: "StudentInfo", 
  }
);

mongoose.model("StudentInfo", StudentSchema);
