module.exports = {
    devServer: {
        host: "localhost",
        proxy: {
            '^/files': {
                target: 'http://localhost:3007',
            },
        }

    }
};
