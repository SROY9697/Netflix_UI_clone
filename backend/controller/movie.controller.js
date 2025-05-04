import { fetchFromTMDB } from "../services/tmdb.service.js";

export async function getTrendingMovie(req, res) {
  try {
    const data = await fetchFromTMDB(
      "https://api.themoviedb.org/3/trending/movie/day?language=en-US"
    );
    const randomMovie =
      data.results[Math.floor(Math.random() * data.results?.length)];
    res.status(200).json({
      success: true,
      message: "Trending movie fetched successfully",
      content: randomMovie,
    });
  } catch (error) {
    console.log("Error is in getTrendingMovie :", error.message);
    res.status(400).json({ success: false, message: "Server error" });
  }
}

export async function getMovieTrailers(req, res) {
  try {
    const { id } = req.params;
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`
    );
    res.status(200).json({
      success: true,
      message: "Movie details fetched successfully",
      content: data.results,
    });
  } catch (error) {
    console.log("Error is in getMovieDetails :", error.message);
    res.status(400).json({ success: false, message: "Server error" });
  }
}

export async function getMovieDetails(req, res) {
  const { id } = req.params;
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${id}?language=en-US`
    );
    console.log(data);
    res.status(200).json({
      success: true,
      message: "Movie details fetched successfully",
      content: data,
    });
  } catch (error) {
    console.log("Error is in getMovieDetails :", error.message);
    res.status(400).json({ success: false, message: "Server error" });
  }
}

export async function getSimilarMovies(req, res) {
  const { id } = req.params;
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`
    );
    res.status(200).json({ success: true, similar: data.results });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function getMoviesByCategory(req, res) {
  const { category } = req.params;
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=2`
    );
    res.status(200).json({ success: true, content: data.results });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
