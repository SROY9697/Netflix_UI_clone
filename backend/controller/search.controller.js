import User from "../models/user.model.js";
import { fetchFromTMDB } from "../services/tmdb.service.js";

export const searchPerson = async (req, res) => {
  const { query } = req.params;
  try {
    const response = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/person?query=${query}&language=en-US&page=1`
    );
    //if no results found
    if (response.results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No results found",
      });
    }
    //add this details to the user object
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        searchHistory: {
          id: response.results[0].id,
          title: response.results[0].name,
          image: response.results[0].profile_path,
          searchType: "person",
          createdAt: new Date(),
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Person search results fetched successfully",
      content: response.results,
    });
  } catch (error) {
    console.log("Error is in searchPerson :", error.message);
    res.status(400).json({ success: false, message: "Server error" });
  }
};
export const searchMovie = async (req, res) => {
  const { query } = req.params;

  try {
    const response = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`
    );

    if (response.results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No results found",
      });
    }

    //if it is alredy in the search history, then don't add it again
    const isAlreadyInHistory = req.user.searchHistory.some(
      (item) => item.id === response.results[0].id
    );
    if (isAlreadyInHistory) {
      return res.status(200).json({
        success: true,
        message: "Already in search history",
      });
    }
    //  otherwise add it
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        searchHistory: {
          id: response.results[0].id,
          image: response.results[0].poster_path,
          title: response.results[0].title,
          searchType: "movie",
          createdAt: new Date(),
        },
      },
    });
    res.status(200).json({ success: true, content: response.results });
  } catch (error) {
    console.log("Error in searchMovie controller: ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
export const searchTv = async (req, res) => {
  const { query } = req.params;

  try {
    const response = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=1`
    );

    if (response.results.length === 0) {
      return res.status(404).send(null);
    }

    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        searchHistory: {
          id: response.results[0].id,
          image: response.results[0].poster_path,
          title: response.results[0].name,
          searchType: "tv",
          createdAt: new Date(),
        },
      },
    });
    res.json({ success: true, content: response.results });
  } catch (error) {
    console.log("Error in searchTv controller: ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//get all the search history of the user
export const getSearchHistory = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      results: req.user.searchHistory,
    });
  } catch (error) {
    console.log("Error in getSearchHistory controller: ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteItemFromSearchHistory = async (req, res) => {
  let { id } = req.params;
  let newId = Number(id); //convert the string id to number

  //delete the item from the search history of the user
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: {
        searchHistory: { id: newId },
      },
    });

    res.status(200).json({
      success: true,
      message: "Item deleted from search history",
    });
  } catch (error) {
    console.log(
      "Error in deleteItemFromSearchHistory controller: ",
      error.message
    );
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
