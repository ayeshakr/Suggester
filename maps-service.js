const { Client } = require("@googlemaps/google-maps-services-js");
const _ = require('lodash');
require('dotenv').config()

const client = new Client({});

const geocode = async (address) => {
  try {
    const response = await client.geocode({
      params: {
        address,
        key: process.env.MAPS_API_KEY
      }
    })
    return response.data.results[0].geometry.location;
  } catch (e) {
    console.log(e);
  }
}

const nearbySearch = async (keyword, latLong, type) => {
  try {
    const response = await client.placesNearby({
      params: {
        location: `${latLong.lat},${latLong.lng}`,
        radius: 2500,
        ...(keyword) && {keyword},
        key: process.env.MAPS_API_KEY,
        type: type
      }
    })

    return await Promise.all(response.data.results.slice(0, 5).map(async res => ({
      name: res.name,
      address: res.vicinity,
      rating: res.rating,
      url: await getMapsUrl(res.place_id)
    })));
  } catch (e) {
    console.log(e);
  }
}

const getMapsUrl = async (placeId) => {
  try {
    const response = await client.placeDetails({
      params: {
        place_id: placeId,
        key: process.env.MAPS_API_KEY
      }
    })
    return response.data.result.url;
  } catch (e) {
    console.log(e);
  }
}

module.exports = { geocode, nearbySearch }