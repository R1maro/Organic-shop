interface Config {
    API_URL: string;
    APP_NAME: string;
}


const apiUrl = import.meta.env.VITE_APP_URL || 'http://localhost:8000/api';


const config: Config = {
    API_URL: apiUrl,
    APP_NAME: 'Organic-shop',
};

export default config;