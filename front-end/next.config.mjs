/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8000',
                pathname: '/storage/**',
            },
            {
                protocol: 'https',
                hostname: 'western-jemima-freshoil-daafab46.koyeb.app',
                pathname: '/storage/**',
            },
            {
                protocol: 'https',
                hostname: 'api.freshoil.ir',
                pathname: '/storage/**',
            },
        ],
    },
};

export default nextConfig;
