const handleError = require("../utils/handleError");
const { memosDB } = require("../functions/initDatabase");

const a = {};

a.getAllMemos = async function (_, res) {
  try {
    const memos = await memosDB.find();
    const toReturn = memos
      .sort(({ rawLockTime: a }, { rawLockTime: b }) => a - b)
      .map(({ rawLockTime: r, info, _id: txID }) => ({ date: new Date(r).toLocaleString(), info, txID }));

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
      .filter(({ info }) => {
        if (info.length === 4 && !isNaN(+info)) return false;
        if (info.length === 6 && !isNaN(+info)) return false;
        if (info === "consolidate") return false;
        return true;
      })
      .sort(({ rawLockTime: a }, { rawLockTime: b }) => a - b)
      .map(({ rawLockTime: r, info, _id: txID }) => ({ date: new Date(r).toLocaleString(), info, txID }));

    // Quitar aquellas que no tienen datos de trade y enviar el resto
    return res.send({ message: toReturn });
  } catch (err) {
    return handleError(res, err);
  }
};

module.exports = a;
