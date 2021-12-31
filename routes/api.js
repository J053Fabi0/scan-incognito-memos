const router = require("express").Router();
const c = require("../controllers/apiController");
const paginationSchema = require("../schemas/paginationSchema");

router.get("/memos", paginationSchema, c.getMemos);
router.get("/lastPosiblePage", paginationSchema, c.getLastPosiblePage);

module.exports = router;
