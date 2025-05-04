import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateTokenAndSetCookie = (userId, res) => {
  let jwtSecretKey = process.env.JWT_SECRET;
  const token = jwt.sign({ userId }, jwtSecretKey, { expiresIn: "12h" });
  console.log(token);

  //create cookie
  res.cookie("netflix_token", token, {
    maxAge: 43200000, // Cookie expires in 1 hour (in milliseconds)
    httpOnly: true, // Cookie is only accessible by the server
    secure: false, // Set to true if using HTTPS
    sameSite: "lax", // Controls cross-site access
  });

  return token;
};
