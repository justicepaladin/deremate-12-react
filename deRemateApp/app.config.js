import 'dotenv/config';

export default {
  expo: {
    name: "deRemateApp",
    projectId: "d42bc8aa-a97e-4315-9730-6c0b138633e5",
    slug: "deRemateApp",
    version: "1.0.0",
    scheme: "deremateapp",
    extra: {
      eas: {
        projectId: "d42bc8aa-a97e-4315-9730-6c0b138633e5"
      },
      apiUrl: process.env.API_URL,
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    },
    plugins: [
      "expo-router",
      "expo-web-browser"
    ],
    permissions: [
      "CAMERA"
    ]
  },
};