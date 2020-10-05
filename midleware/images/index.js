const multer = require('multer')
// deploy heroku: s3 amazon, D.O
module.exports.uploadImage = (type) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `${__dirname}/../../images/${type}s`)
        },
        filename: function (req, file, cb) {
            cb(null,  Date.now() + '-' + file.originalname)
        }
    })
    
    const upload = multer({storage: storage})
    return upload.single(type)
}