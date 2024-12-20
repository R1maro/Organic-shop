interface Config {
    API_URL: string;
    PUBLIC_URL:string;
    APP_NAME: string;
}


const apiUrl = import.meta.env.VITE_APP_URL || 'http://localhost:8000/api';
const publicUrl = import.meta.env.VITE_PUBLIC_URL || 'http://localhost:8000';


const config: Config = {
    API_URL: apiUrl,
    PUBLIC_URL: publicUrl,
    APP_NAME: 'Organic-shop',
};

export default config;