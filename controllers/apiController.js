const handleError = require("../utils/handleError");
const { memosDB } = require("../functions/initDatabase");

const a = {};

const getAllMemos = async (db) => {
  const allMemos = await db.find();
  return allMemos
    .sort(({ rawLockTime: a }, { rawLockTime: b }) => a - b)
    .map(({ rawLockTime: d, memo, _id: txID }) => ({ date: d, memo, txID }));
};

a.getAllMemos = async ({ query }, res) => {
  try {
    const { page, size } = query;

    const lastPosibleIndex = (await memosDB.count()) - 1;
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;

    res.send({
      message: {
        hasNext: endIndex <= lastPosibleIndex,
        results: (await getAllMemos(memosDB)).slice(startIndex, endIndex),
      },
    });
  } catch (e) {
    handleError(res, e);
  }
};

module.exports = a;
