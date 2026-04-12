/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Habilita la exportación estática
  basePath: '/fast-finger-songs', // Ruta de tu repositorio en GitHub Pages
  images: {
    unoptimized: true, // GitHub Pages no soporta la optimización de imágenes nativa de Next.js
  },
  reactStrictMode: true,
  sassOptions: {
    includePaths: ['./styles'],
  },
};

export default nextConfig;
