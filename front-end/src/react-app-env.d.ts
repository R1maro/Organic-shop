declare module '*.png';
declare module '*.svg';
declare module '*.jpeg';
declare module '*.jpg';

interface ImportMetaEnv {
    readonly VITE_PUBLIC_URL: string
    readonly VITE_APP_URL: string
    // Add other env variables here
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}