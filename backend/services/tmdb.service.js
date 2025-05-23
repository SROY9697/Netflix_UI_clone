import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
export const fetchFromTMDB = async (url) => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + process.env.TMDB_API_KEY,
    },
  };

  const response = await axios.get(url, options);
  if (response.status !== 200) {
    throw new Error("Error fetching data from TMDB API");
  }

  return response.data;
};
