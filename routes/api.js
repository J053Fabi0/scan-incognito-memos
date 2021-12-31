const router = require("express").Router();
const c = require("../controllers/apiController");
const paginationSchema = require("../schemas/paginationSchema");

router.get("/allMemos", paginationSchema, c.getAllMemos);

module.exports = router;
