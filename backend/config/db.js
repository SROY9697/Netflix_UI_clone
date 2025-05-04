import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://sayansroy1997:qMwrIAXsZOorOMTl@cluster0.ohm8rms.mongodb.net/Netflix_db",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("database connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

export default connectDB;
