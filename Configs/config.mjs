export default {
    wlan0: {
        secret: 'secret',
        host: '192.168.188.184',
        port: 3000
    },
    ws: {
        port: 8000
    },
    folders: {
        files: "Share/files",
        musics: "Share/musics",
        videos: "Share/videos",
        images: "Share/images",
        public: "public",
        books: "Share/books",
        gifs: "Share/gifs"
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
