export default {
    base: './',
    build: {
        outDir: './public',
        emptyOutDir: true,
    },
    server: {
        port: 5173,
        proxy: {
            '/stocks': 'http://localhost:3000',
            '/static': 'http://localhost:3000',
        },
    },
};
