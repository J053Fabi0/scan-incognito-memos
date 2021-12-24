const handleError = require("../utils/handleError");
const { memosDB } = require("../functions/initDatabase");

const a = {};

a.getAllMemos = async function (_, res) {
  try {
    const memos = await memosDB.find();
    const toReturn = memos
      .sort(({ rawLockTime: a }, { rawLockTime: b }) => b - a)
      .map(({ rawLockTime: r, memo, _id: txID }) => ({ date: r, memo, txID }));

    // Quitar aquellas que no tienen datos de trade y enviar el resto
    return res.send({ message: toReturn });
  } catch (err) {
    return handleError(res, err);
  }
};

a.getAllMemosFiltered = async function (_, res) {
  try {
    const memos = await memosDB.find();
    const toReturn = memos
      .filter(({ memo }) => {
        if (
          !isNaN(+memo) || //
          /^Abundance is flowing!/.test(memo) ||
          /^(rewards|reward) from/i.test(memo) ||
          /UA/.test(memo) ||
          /QUEST/.test(memo) ||
          / ua /.test(memo) ||
          /membership/.test(memo) ||
          /^refund trade/.test(memo) ||
          /scholarship/i.test(memo) ||
          /^mapurush/.test(memo) ||
          /^\w{40,}$/.test(memo)
        )
          return false;

        return true;
      })
      .sort(({ rawLockTime: a }, { rawLockTime: b }) => b - a)
      .map(({ rawLockTime: r, memo, _id: txID }) => ({ date: r, memo, txID }));

    return res.send({ message: toReturn });
  } catch (err) {
    return handleError(res, err);
  }
};

module.exports = a;
