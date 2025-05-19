import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/userModel.js";

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
    await User.deleteMany();

    const users = [
      {
        f_name: "Alice",
        l_name: "Anderson",
        username: "alice",
        email: "alice@example.com",
        password: "123456",
      },
      {
        f_name: "Bob",
        l_name: "Brown",
        username: "bob",
        email: "bob@example.com",
        password: "123456",
      },
      {
        f_name: "Charlie",
        l_name: "Clark",
        username: "charlie",
        email: "charlie@example.com",
        password: "123456",
      },
    ];

    await User.insertMany(users);
    console.log("Users seeded successfully!");
  } catch (err) {
    console.error("Seeding failed:", err);
  } finally {
    mongoose.disconnect();
  }
};
seedUsers();