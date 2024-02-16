export default {
    wlan0: {
        secret: 'secret',
        host4: '192.168.1.106',
        host6: '192.168.1.106',
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
