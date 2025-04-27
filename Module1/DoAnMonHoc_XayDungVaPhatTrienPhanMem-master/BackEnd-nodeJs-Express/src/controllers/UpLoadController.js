const { uploadImgService } = require("../services/uploadService");

const UpLoadImg = async (req, res) => {
    try {
        const data = await uploadImgService(req);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Lỗi server khi upload ảnh" });
    }
}

module.exports = { UpLoadImg }
