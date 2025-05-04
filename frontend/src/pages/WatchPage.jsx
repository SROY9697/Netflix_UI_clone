import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useContentStore } from "../store/content";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ReactPlayer from "react-player";
import { ORIGINAL_IMG_BASE_URL, SMALL_IMG_BASE_URL } from "../utils/constants";
import { formatReleaseDate } from "../utils/dateFunction";
import { ShimmerTitle } from "react-shimmer-effects";
import Navbar from "../components/Navbar";

const WatchPage = () => {
  const { id } = useParams();
  const sliderRef = useRef(null);
  const [trailers, setTrailers] = useState([]);
  const [currentTrailerIndex, setCurrentTrailerIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState({});
  const [similarContent, setSimilarContent] = useState([]);

  const { contentType } = useContentStore();

  //get movie trailers
  useEffect(() => {
    const getTrailers = async () => {
      try {
        const response = await axios.get(
          `/api/v1/${contentType}/${id}/trailers`
        );
        setTrailers(response.data.content);
      } catch (error) {
        console.error("Error fetching trailers:", error);
      } finally {
        setLoading(false);
      }
    };

    getTrailers();
  }, [contentType, id]);

  console.log("trailers", trailers);

  //get movie details
  useEffect(() => {
    const getContents = async () => {
      try {
        const response = await axios.get(
          `/api/v1/${contentType}/${id}/details`
        );
        setContent(response.data.content);
      } catch (error) {
        console.error("Error fetching details:", error);
        setContent(null);
      } finally {
        setLoading(false);
      }
    };

    getContents();
  }, [contentType, id]);

  // console.log("content", content);

  //get similar contents
  useEffect(() => {
    const getSimilar = async () => {
      try {
        const response = await axios.get(
          `/api/v1/${contentType}/${id}/similar`
        );
        setSimilarContent(response.data.similar);
      } catch (error) {
        console.error("Error fetching similar contents:", error);
      } finally {
        setLoading(false);
      }
    };

    getSimilar();
  }, [contentType, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-10">
        <ShimmerTitle line={5} gap={30} variant="primary" />;
      </div>
    );
  }

  // no post found with the params id
  if (!content) {
    return (
      <div className="bg-black text-white h-screen">
        <div className="max-w-6xl mx-auto">
          <Navbar />
          <div className="text-center mx-auto px-4 py-8 h-full mt-40">
            <h2 className="text-2xl sm:text-5xl font-bold text-balance">
              Content not found 😥
            </h2>
          </div>
        </div>
      </div>
    );
  }

  //button functions
  function handleNext() {
    if (currentTrailerIndex < trailers.length - 1) {
      setCurrentTrailerIndex(currentTrailerIndex + 1);
    }
  }
  function handlePrevious() {
    if (currentTrailerIndex > 0) {
      setCurrentTrailerIndex(currentTrailerIndex - 1);
    }
  }

  // scrolling functions
  const scrollLeft = () => {
    if (sliderRef.current)
      sliderRef.current.scrollBy({
        left: -sliderRef.current.offsetWidth,
        behavior: "smooth",
      });
  };
  const scrollRight = () => {
    if (sliderRef.current)
      sliderRef.current.scrollBy({
        left: sliderRef.current.offsetWidth,
        behavior: "smooth",
      });
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="mx-auto container px-4 py-8 h-full">
        <Navbar />
        {trailers?.length > 0 && (
          <div className="flex justify-between items-center mb-4">
            <button
              className={`
							bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded-md ${
                currentTrailerIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={currentTrailerIndex === 0}
              onClick={handlePrevious}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className={`
							bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded-md ${
                currentTrailerIndex === trailers.length - 1
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={currentTrailerIndex === trailers.length - 1}
              onClick={handleNext}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}
        {/* video player */}
        <div className="aspect-video mb-8 p-2 sm:px-10 md:px-32">
          {trailers?.length > 0 && (
            <ReactPlayer
              controls={true}
              width={"100%"}
              height={"70vh"}
              className="mx-auto rounded-lg"
              url={`https://www.youtube.com/watch?v=${trailers[currentTrailerIndex].key}`}
            />
          )}
          {trailers?.length === 0 && (
            <h2 className="text-xl text-center mt-5">
              No trailers available for{" "}
              <span className="font-bold text-red-600">
                {content?.title || content?.name}
              </span>{" "}
              😥
            </h2>
          )}
        </div>
        {/* movie details */}
        <div className="flex flex-col items-center justify-center gap-20 max-w-6xl mx-auto md:flex-row">
          {/* details */}
          <div className="mb-4 md:mb-0">
            <h2 className="text-5xl font-bold text-balance">
              {content?.title || content?.name}
            </h2>

            <p className="mt-2 text-lg">
              {formatReleaseDate(
                content?.release_date || content?.first_air_date
              )}{" "}
              |{" "}
              {content?.adult ? (
                <span className="text-red-600">18+</span>
              ) : (
                <span className="text-green-600">PG-13</span>
              )}{" "}
            </p>
            <p className="mt-4 text-lg">{content?.overview}</p>
          </div>
          {/* image */}
          <img
            src={ORIGINAL_IMG_BASE_URL + content?.poster_path}
            alt="Poster image"
            className="max-h-[600px] rounded-md"
          />
        </div>

        {/* similar contents */}
        {similarContent?.length > 0 && (
          <div className="mt-12 max-w-6xl mx-auto relative">
            <h3 className="text-3xl font-bold mb-4">Similar Movies/Tv Show</h3>
            <div
              className="flex overflow-x-scroll gap-4 pb-4 group"
              ref={sliderRef}
            >
              {similarContent.map((content) => {
                if (content.poster_path === null) return null;
                return (
                  <Link
                    key={content.id}
                    to={`/watch/${content.id}`}
                    className="w-52 flex-none"
                  >
                    <img
                      src={SMALL_IMG_BASE_URL + content.poster_path}
                      alt="Poster path"
                      className="w-full h-auto rounded-md"
                    />
                    <h4 className="mt-2 text-lg font-semibold">
                      {content.title || content.name}
                    </h4>
                  </Link>
                );
              })}

              <ChevronRight
                className="absolute top-1/2 -translate-y-1/2 right-2 w-8 h-8
										opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer
										 bg-red-600 text-white rounded-full"
                onClick={scrollRight}
              />
              <ChevronLeft
                className="absolute top-1/2 -translate-y-1/2 left-2 w-8 h-8 opacity-0 
								group-hover:opacity-100 transition-all duration-300 cursor-pointer bg-red-600 
								text-white rounded-full"
                onClick={scrollLeft}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchPage;
