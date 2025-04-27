const uploadImgService = async (req, res) => {
    if (!req.file) {
        return { error: "No file uploaded" };
    }
    return {
        message: "Upload thành công!",
        filePath: `/uploads/${req.file.filename}`,
    };
}

module.exports = { uploadImgService }
