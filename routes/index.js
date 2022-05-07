const express = require("express");
const path = require("path");
const router = express.Router();

router.get("/express_backend", (req, res) => {
    res.header("Cross-Origin-Embedder-Policy", "require-corp");
    res.header("Cross-Origin-Opener-Policy", "same-origin");
    res.send({ response: "I am alive" }).status(200);
    // res.sendFile(path.join(__dirname, './public/index.html'));
});
module.exports = router;