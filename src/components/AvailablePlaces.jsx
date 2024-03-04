import { useState, useEffect } from "react";
import Error from "./Error.jsx";
import { sortPlacesByDistance } from "../loc.js";
import Places from "./Places.jsx";
import { fetchAvailablePlaces } from "../http.js";

const places = localStorage.getItem("places");

export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetching, setIsFetching] = useState();
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [error, setError] = useState();



  useEffect(() => {
    setIsFetching(true);
    async function fetchPlaces() {
      try {
        // inside try because it could return error(throw error)
        // await bcs it will return promise (decorated with async)
        const places = await fetchAvailablePlaces();
        // cb handling async code
        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
            places,
            position.coords.latitude,
            position.coords.longitude
          );
          setAvailablePlaces(sortedPlaces);
          setIsFetching(false);
        });
      } catch (error) {
        // application wont crash, you will catch granade
        // handle error in React app means showing error UI to the user
        setError({
          message:
            error.message ||
            "Could not fetched places, please try again later.",
        });
        setIsFetching(false);
      }
    }
    fetchPlaces();
  }, []);

  if (error) {
    return <Error title="An error occured!" message={error.message} />;
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="Fetching place data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
