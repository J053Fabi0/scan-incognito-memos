const blockchainInfo = require("./blockchainRPCs");
const { memosDB, blocksDB } = require("../functions/initDatabase");

let counter = 1;
let stop = false;

const main = async () => {
  while (true) {
    try {
      await checkNewBlocks();
    } catch (err) {
      console.log(err);
    }
    counter++;
    if (typeof stop !== "boolean") {
      stop();
      return;
    }
  }
};

module.exports.main = main;
module.exports.getCounter = () => counter;
module.exports.stop = () => new Promise((resolve) => (stop = () => resolve()));

async function checkNewBlocks() {
  const blocksInDB = await blocksDB.find({});

  // If there are no blocks to search in the DB,
  // get them
  if (Object.keys(blocksInDB).length === 0) {
    const { BestBlocks } = await blockchainInfo.getBlockchainInfo();
    delete BestBlocks["-1"];

    for (const [_id, { Height: height }] of Object.entries(BestBlocks))
      await blocksDB.insert({ _id, height, counter: 0 });
    return;
  }

  if (blocksInDB[1].height === 0) {
    module.exports.stop();
    return;
  }

  const hashes = await (() =>
    new Promise((res) => {
      const returnData = [];
      // The function to get the hashes of a block
      const getHashesOfBlock = (height, id) =>
        new Promise((resolve, reject) => {
          blockchainInfo
            .retrieveBlockByHeight(height, id)
            .then((res) => {
              if (res.TxHashes) resolve(res.TxHashes);
              else resolve(false);
            })
            .catch((err) => reject(err));
        });

      let blocksToLook = blocksInDB.length;

      for (const { height, _id: id, counter } of blocksInDB) {
        if (height === 0) continue;

        getHashesOfBlock(height, id)
          .then((res) => {
            if (typeof res === "object" && res.length > 0) {
              returnData.push(...res);
            }
          })
          .catch(() => true)
          .finally(() => {
            blocksDB
              .update({ _id: id }, { $set: { height: height - 1, counter: counter + 1 } })
              .catch((err) => console.error(err));
            if (--blocksToLook <= 0) res(returnData);
          });
      }
    }))();

  if (hashes.length === 0) return;

  const infoOfTxs = await (() =>
    new Promise((res) => {
      const returnData = [];

      const getInfoOfTx = (txID) =>
        new Promise((resolve, reject) => {
          blockchainInfo
            .getTransactionByHash(txID)
            .then(({ Info, RawLockTime }) => resolve({ info: Info, txID, rawLockTime: RawLockTime * 1000 }))
            .catch((err) => reject(err));
        });

      let txsToLook = hashes.length;

      for (const txid of hashes)
        getInfoOfTx(txid)
          .then(({ info, ...otherData }) => {
            if (info && info !== "null") returnData.push({ info, ...otherData });
          })
          .catch((e) => console.error(e))
          .finally(() => {
            if (--txsToLook <= 0) res(returnData);
          });
    }))();

  for (const { info, txID, rawLockTime } of infoOfTxs) {
    console.log(new Date(rawLockTime).toLocaleString(), info);
    await memosDB.insert({ _id: txID, info, rawLockTime });
  }
}
