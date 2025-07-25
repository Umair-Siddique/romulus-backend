import axios from "axios";
import createError from "http-errors";

import { env } from "#config/index.js";

const { GOOGLE_MAPS_API_KEY } = env;

export const getCoordinates = async (address) => {
  const API_URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${GOOGLE_MAPS_API_KEY}`;

  const response = await axios.get(API_URL);

  if (response.data.status === "OK") {
    const location = response.data.results[0].geometry.location;

    return { type: "Point", coordinates: [location.lng, location.lat] };
  } else {
    throw createError(400, "Enter the correct address.");
  }
};
