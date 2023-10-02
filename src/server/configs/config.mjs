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
        videos: "Share/video/",
        images: "Share/images",
        public: "public",
        code: "Share/code",
        books: "Share/books",
        gifs: "Share/video/"
    },
    routes: {
        files: "/downloads",
        musics: "/musics",
        videos: "/videos",

        images: "/images",
        public: "/public",
        libraries: "/libraries",
        gifs: "/gifs"
    }
};
