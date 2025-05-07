const mongoose = require("mongoose");
require("dotenv").config(); // Correctly configure dotenv
mongoose
  .connect("mongodb+srv://karan:karan@cluster0.qlekw.mongodb.net/ByteNotes")
  .then((res) => console.log("MongoDB Connected Succesfully"))
  .catch((error) => {
    console.log(error);
  });
