const path = require('path');
const { engine } = require('express-handlebars');
const express = require('express');

//Dang ky file duoi .hanldebar == .hbs
const viewEngineConfig = (app) => {
    app.engine(
        'hbs',
        engine({
            extname: '.hbs',
        }),
    );

    //Su dung handldebar de render views
    app.set('view engine', 'hbs');

    //Duong dan den thu muc chua views
    app.set('views', path.join(__dirname, '..', 'views'));

    //config static files: image/css/js
    app.use(express.static(path.join('./src', 'public')));

    // Cấu hình để truy cập ảnh đã upload
    app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
}

module.exports = viewEngineConfig;
