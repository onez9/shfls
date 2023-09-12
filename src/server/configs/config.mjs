export default {
    wlan0: {
        secret: 'secret',
        host: '192.168.1.103',
        port: 3000
    },
    ws: {
        port: 8000
    },
    folders: {
        files: "Share/files",
        musics: "Share/musics",
        videos: {
            programming: "Share/videos/stuff",
            porno: "Share/videos/porno",
            math: "Share/videos/math",
            _2r2r: "Share/videos/clips",
            video1: "Share/video"
        },
        images: "Share/images",
        public: "public",
        code: "Share/code",
        books: "Share/books",
        gifs: "Share/videos/porno"
    },

    routes: {
        files: "/downloads",
        musics: "/musics",
        videos: {
            programming: "/videos",
            porno: "/videos",
            math: "/videos",
            _2r2r: "/videos",
            video1: "/videos"

        },
        images: "/images",
        public: "/public",
        libraries: "/libraries",
        gifs: "/gifs"
    }
};
