export default {
    wlan0: {
        secret: 'secret',
        host: '192.168.1.9',
        port: 3000
    },
    ws: {
        port: 8000
    },
    folders: {
        files: "Share/files",
        musics: "Share/musics",
        videos: {
            programming: "Share/videos/programming",
            porno: "Share/videos/porno",
            math: "Share/videos/math"
        },
        images: "Share/images",
        public: "public",
        code: "Share/code",
        books: "Share/books",
        gifs: "Share/gifs"
    },

    routes: {
        files: "/downloads",
        musics: "/musics",
        videos: {
            programming: "/videos",
            porno: "/videos",
            math: "/videos"
        },
        images: "/images",
        public: "/public",
        libraries: "/libraries",
        gifs: "/gifs"
    }
};
