module.exports = async (walletsDB) => {
  const wallets = await walletsDB.findOne({ _id: "wallets" });
  if (!wallets) await walletsDB.insert({ _id: "wallets", wallets: [] });
};
