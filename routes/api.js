const router = require("express").Router();
const c = require("../controllers/apiController");

router.get("/allMemos", c.getAllMemos);
router.get("/allMemosFiltered", c.getAllMemosFiltered);

module.exports = router;
