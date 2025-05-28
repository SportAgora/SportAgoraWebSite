
module.exports = (application) => {

    application.use(application.config.middlewares.express.static("./app/public"));

    application.set("view engine", "ejs");
    application.set("views", "./app/views");

    application.use(application.config.middlewares.express.json());
    application.use(application.config.middlewares.express.urlencoded({ extended: true }));


    application.use(
        application.config.middlewares.session({
            secret: "SportAgoraWebsite",
            resave: false,
            saveUninitialized: false,
        }));
}

