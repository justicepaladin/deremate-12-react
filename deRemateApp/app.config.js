import 'dotenv/config';

export default {
  expo: {
    // ...other config
    extra: {
      apiUrl: process.env.API_URL,
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    },
  },
};