const { coinsDB } = require("./initDatabase");
const tokensList = require("./tokensList");

const updateTokens = async () => {
  try {
    const list = await tokensList.getAllTokens();

    const entries = Object.entries(list);
    for (const [
      id,
      { PDecimals: decimals, PSymbol: pSymbol, Symbol: symbol, Name: name, Verified: verified },
    ] of entries) {
      const isInPool = await tokensList.doesPairExists(id);
      if (isInPool && (pSymbol || symbol) && name && id) {
        let tokenInfo = await coinsDB.findOne({ _id: id });
        if (!tokenInfo) {
          await coinsDB.update(
            { _id: id },
            {
              _id: id,
              symbol: pSymbol || symbol,
              name,
              decimals: decimals || 0,
              verified: Boolean(pSymbol) || verified,
            },
            { upsert: true }
          );
        }
      }
    }
  } catch (err) {
    console.log(err);
  } finally {
    setTimeout(() => updateTokens(), 24 * 60 * 60 * 1000); // 24 hours
  }
};

module.exports = updateTokens;
