require('dotenv').config();
const express = require('express'); //commonjs
const viewEngineConfig = require('./config/viewEngine');
const connection = require('./config/database');
const route = require('./routes');
const app = express();
const port = process.env.PORT || 8888;
var cors = require('cors')

//Sửa lỗi CORS khi gọi API từ FrontEnd
app.use(cors());

// Xử lý form data (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// Xử lý JSON nếu gửi request dạng JSON
app.use(express.json());


//Cài đăt template engine(hanldebars)
viewEngineConfig(app);

//Khai báo route đường ai nấy đi
route(app);

(async () => {
    try {
        //Kết nối database
        await connection();

        app.listen(port, () => {
            console.log(`App listening on port http://localhost:${port}`);
        })
    } catch (error) {
        console.log(">>> Error connect to DB: ", error)
    }
})()
