const express = require("express")
const router = express.Router()
const multer = require('multer')

const filename = (req, file, next) => {
    let lastIndexof = file.originalname.lastIndexOf(".");
    let ext = file.originalname.substring(lastIndexof);
    next(null, `${Date.now()}${ext}`);
};

const destination = (req, file, next) => {
    next(null, `${__dirname}/../public/uploads`);
};

const upload = multer({
    storage: multer.diskStorage({ destination, filename }),
});

const {
    updatePassword,
    saveProfile,
    updateAvatar,
    removeAvatar
} = require("../controllers/profile-controller")

router.post('/', saveProfile)
router.post('/password', updatePassword)
router.post('/avatar', upload.single('avatar'), updateAvatar)
router.delete('/avatar', removeAvatar)
module.exports = router