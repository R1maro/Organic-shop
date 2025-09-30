/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8000',
                pathname: 'public/storage/**',
            },
            {
                protocol: 'https',
                hostname: 'western-jemima-freshoil-daafab46.koyeb.app',
                pathname: 'public/storage/**',
            },
            {
                protocol: 'https',
                hostname: 'api.freshoil.ir',
                pathname: 'public/storage/**',
            },
        ],
    },
};

export default nextConfig;
