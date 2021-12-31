const blockchainInfo = require("./blockchainRPCs");
const sleep = require("util").promisify(setTimeout);
const escapeRegExp = require("../utils/escapeRegExp");
const { memosDB, blocksDB } = require("../functions/initDatabase");
const { iteratePromisesInChunks } = require("../utils/promisesYieldedInChunks");

let counter = 1;
let stop = false;
const MAX_SIMULTANEOUS_CONNECTIONS = 8;

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

async function getLatestBlockHeights() {
  const { BestBlocks } = await blockchainInfo.getBlockchainInfo();
  delete BestBlocks["-1"];
  const blockHeights = [];

  const blockEntries = Object.entries(BestBlocks);
  for (const [i, { Height: height }] of blockEntries) blockHeights[i] = height;
  return blockHeights;
}

async function checkNewBlocks() {
  const blocksInDB = await blocksDB.find({});

  // If there are no blocks in the DB, initialize them with 1.
  if (blocksInDB.length === 0) {
    const blockHeights = await getLatestBlockHeights();
    for (let i = 0; i < blockHeights.length; i++) await blocksDB.insert({ _id: i.toString(), height: 1 });
    return;
  }

  const getTxIDsOfBlockPromises = [];
  // Fill the array with the promises to request the hash of each block.
  for (const { height, _id: shardID } of blocksInDB)
    getTxIDsOfBlockPromises.push(
      () =>
        new Promise((resolve, reject) => {
          blockchainInfo
            .retrieveBlockByHeight(height, shardID)
            .then((res) => {
              if (res.TxHashes) resolve({ txIDs: res.TxHashes, shardID });
              else reject(new Error("No TxHashes in res."));
            })
            .catch((err) => reject(err));
        })
    );
  // Get all the txIDs.
  const txIDsRaw = await iteratePromisesInChunks(getTxIDsOfBlockPromises, MAX_SIMULTANEOUS_CONNECTIONS);

  // If all attempts were rejected, retry in 35 seconds.
  const numberOfBlocksThatReturnedError = txIDsRaw.reduce(
    (p, { status }) => (status === "rejected" ? 1 : 0) + p,
    0
  );
  if (numberOfBlocksThatReturnedError === blocksInDB.length) {
    console.log("Retrying getting txIDs in 35 seconds...");
    await sleep(35_000);
    return;
  }

  const getInfoOfTxPromises = [];
  for (let i = 0; i < blocksInDB.length; i++) {
    // If there was a problem getting the txIDs of this block, don't update the block's height, so that it retry
    // in the next run.
    if (txIDsRaw[i].status === "rejected") continue;

    const { txIDs, shardID } = txIDsRaw[i]["value"];

    // Increase the block's height in the database.
    await blocksDB.update({ _id: shardID }, { $inc: { height: 1 } });

    // Fill the array with the promises to request the information of each txID.
    for (const txID of txIDs)
      getInfoOfTxPromises.push(
        () =>
          new Promise((resolve, reject) => {
            blockchainInfo
              .getTransactionByHash(txID)
              .then(({ Info, RawLockTime }) => resolve({ memo: Info, rawLockTime: RawLockTime * 1000, txID }))
              .catch((err) => reject({ err, shardID, txID }));
          })
      );
  }

  // Get all the txIDs' info.
  const rawTxIDsInfo = await iteratePromisesInChunks(getInfoOfTxPromises, MAX_SIMULTANEOUS_CONNECTIONS);

  const shardsWithErrors = [];
  for (const { value: rawTxIDInfo, status, reason } of rawTxIDsInfo) {
    if (status === "rejected") {
      // Decrease the block's height in the database, because there was an error getting the info of one txID, and
      // it will need to retry it.
      if (!shardsWithErrors.includes(reason.shardID)) {
        // Only decrease each shard 1 time, in case there were multiple errors in the same one.
        shardsWithErrors.push(reason.shardID);
        await blocksDB.update({ _id: reason.shardID }, { $inc: { height: -1 } });

        // Print the error.
        console.error(reason);
      }

      continue;
    }

    const { memo, txID, rawLockTime, ...otherData } = rawTxIDInfo;
    // If there is a memo and is not one of this common memos.
    if (
      memo &&
      memo !== "null" &&
      memo !== '""' &&
      memo !== "Bot" &&
      !(
        !isNaN(+memo) || //
        /UA/.test(memo) ||
        / ua /.test(memo) ||
        /QUEST/.test(memo) ||
        /^mapurush/.test(memo) ||
        /^\w{40,}$/.test(memo) ||
        /membership/.test(memo) ||
        /scholarship/i.test(memo) ||
        /^refund trade/.test(memo) ||
        /Enjoy Your Perks Gift/.test(memo) ||
        /^Abundance is flowing!/.test(memo) ||
        /^(rewards|reward) from/i.test(memo)
      )
    ) {
      // Only if the memo is unique, add it to database.
      // It is searched trimmed and using ignore case.
      const finded = await memosDB.findOne({ memo: new RegExp(`^${escapeRegExp(memo.trim())}$`, "i") });

      if (!finded) {
        console.log(new Date(rawLockTime).toLocaleString(), memo);

        await memosDB.insert({ _id: txID, memo: memo.trim(), rawLockTime, ...otherData });
      }
    }
  }
}
