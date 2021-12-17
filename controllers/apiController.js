const handleError = require("../utils/handleError");
const { memosDB } = require("../functions/initDatabase");

const a = {};

a.getAllMemos = async function (_, res) {
  try {
    const memos = await memosDB.find();
    const toReturn = memos
      .sort(({ rawLockTime: a }, { rawLockTime: b }) => a - b)
      .map(({ rawLockTime: r, info, _id: txID }) => ({ date: r, info, txID }));

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
        info = info.trim();
        const exactMatches = [
          ...["to stake", "consolidate", "pnode", "trade", "rendimiento", "freyo"],
          ...["defragment", "send prv", "meme", "test", "loan", "send", "refund"],
          ...["memes", "ua pay", "enjoy", "transfer", "send prv home", "yup", "rendimientos"],
        ];

        if (
          exactMatches.includes(info.toLowerCase().trim()) ||
          !isNaN(+info) || //
          /^Abundance is flowing!/.test(info) ||
          /^(rewards|reward) from/i.test(info) ||
          /UA/.test(info) ||
          / ua /.test(info) ||
          /membership/.test(info) ||
          /^refund trade/.test(info) ||
          /scholarship/i.test(info) ||
          /^mapurush/.test(info) ||
          /^\w{40,}$/.test(info)
        )
          return false;

        return true;
      })
      .sort(({ rawLockTime: a }, { rawLockTime: b }) => a - b)
      .map(({ rawLockTime: r, info, _id: txID }) => ({ date: r, info, txID }));

    return res.send({ message: toReturn });
  } catch (err) {
    return handleError(res, err);
  }
};

module.exports = a;
