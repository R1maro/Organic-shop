interface Config {
  API_URL: string;
  PUBLIC_URL: string;
  APP_NAME: string;
}

const apiUrl = "https://api.freshoil.ir/api";
const publicUrl = "https://api.freshoil.ir/";

const config: Config = {
  API_URL: apiUrl,
  PUBLIC_URL: publicUrl,
  APP_NAME: "Organic-shop",
};

export default config;
