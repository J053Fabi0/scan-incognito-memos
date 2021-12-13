const axios = require("axios");
const { PRV_ID } = require("../utils/constants");
const pDEXStatus = require("../blockchain/pDEXStatus");

const a = {};

a.getpCustomTokens = async function () {
  const { data } = await axios.get("https://api.incognito.org/pcustomtoken/list");
  if (data.Error) throw new Error(data.Error);
  return data.Result;
};

a.getpTokens = async function () {
  const { data } = await axios.get("https://api.incognito.org/ptoken/list");
  if (data.Error) throw new Error(data.Error);
  return data.Result;
};

/**
 * Returns an object containing all information of the tokens, with the token id as key and all info as value.
 */
a.getAllTokens = async function () {
  const merge = {};
  const list = await this.getpTokens();
  const customList = await this.getpCustomTokens();

  for (const key of Object.keys(list)) merge[list[key].TokenID] = list[key];
  for (const key of Object.keys(customList)) {
    if (customList[key].TokenID in merge) continue;
    merge[customList[key].TokenID] = customList[key];
  }

  return merge;
};

/**
 * Checks if the pair exists in the pool.
 */
a.doesPairExists = async function (tokenID) {
  const { PDEPoolPairs: pools } = await pDEXStatus.getFullpDEXStatus();
  const [, height] = Object.keys(pools)[0].split("-");
  return (
    Boolean(pools?.[`pdepool-${height}-${PRV_ID}-${tokenID}`]?.Token1PoolValue) ||
    Boolean(pools?.[`pdepool-${height}-${tokenID}-${PRV_ID}`]?.Token1PoolValue)
  );
};

module.exports = a;
