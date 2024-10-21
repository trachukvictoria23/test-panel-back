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
    getChats,
    getChatById,
    initChat,
    getMessages,
    sendMessage
} = require("../controllers/chats-controller")

router.get('/', getChats)
router.get('/:id', getChatById)
router.post('/init', initChat)
router.get('/:id/messages', getMessages)
router.post('/:id/messages', upload.single('file'), sendMessage)
module.exports = router