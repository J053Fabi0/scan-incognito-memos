const handleError = require("../utils/handleError");
const { memosDB } = require("../functions/initDatabase");

const a = {};

a.getMemos = async ({ query }, res) => {
  try {
    const { page, size } = query;

    const lastPosibleIndex = (await memosDB.count()) - 1;
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;

    const allMemos = (await memosDB.find())
      .sort(({ rawLockTime: a }, { rawLockTime: b }) => a - b)
      .map(({ rawLockTime: d, memo, _id: txID }) => ({ date: d, memo, txID }));

    res.send({
      message: {
        hasNext: endIndex <= lastPosibleIndex,
        results: allMemos.slice(startIndex, endIndex).reverse(),
      },
    });
  } catch (e) {
    handleError(res, e);
  }
};

a.getLastPosiblePage = async ({ query }, res) => {
  try {
    const { size } = query;
    const numberOfMemos = await memosDB.count();

    res.send({
      message: {
        size,
        lastPosiblePage: Math.ceil(numberOfMemos / size),
      },
    });
  } catch (e) {
    handleError(res, e);
  }
};

module.exports = a;
