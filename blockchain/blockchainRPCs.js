const axios = require("axios");

module.exports.getBlockchainInfo = async function () {
  const options = {
    method: "post",
    url: process.env.FULLNODE_DIRECTION,
    data: {
      id: 1,
      jsonrpc: "1.0",
      method: "getblockchaininfo",
      params: [],
    },
  };

  const res = await axios(options);

  if (res.data.Error) throw new Error(JSON.stringify(res.data.Error, null, 2));
  return res.data.Result;
};

module.exports.retrieveBlockByHeight = async function (blockHeight, shardID) {
  const options = {
    method: "post",
    url: process.env.FULLNODE_DIRECTION,
    data: {
      jsonrpc: "1.0",
      id: 2,
      method: "retrieveblockbyheight",
      params: [Number(blockHeight), Number(shardID), "1"],
    },
  };

  const res = await axios(options);

  if (res.data.Error) throw new Error(JSON.stringify(res.data.Error, null, 2));
  return res.data.Result[0];
};

module.exports.retrieveBlock = async function (blockHash) {
  const options = {
    method: "post",
    url: process.env.FULLNODE_DIRECTION,
    data: {
      id: 3,
      jsonrpc: "1.0",
      method: "retrieveblock",
      params: [blockHash, "1"],
    },
  };

  const res = await axios(options);

  if (res.data.Error) throw new Error(JSON.stringify(res.data.Error, null, 2));
  return res.data.Result;
};

module.exports.getTransactionByHash = async function (txID) {
  const options = {
    method: "post",
    url: process.env.FULLNODE_DIRECTION,
    data: {
      id: 3,
      jsonrpc: "1.0",
      method: "gettransactionbyhash",
      params: [txID],
    },
  };

  const res = await axios(options);

  if (res.data.Error) throw new Error(JSON.stringify(res.data.Error, null, 2));
  return res.data.Result;
};

module.exports.getMemPoolInfo = async function () {
  const options = {
    method: "post",
    url: process.env.FULLNODE_DIRECTION,
    data: {
      jsonrpc: "1.0",
      method: "getmempoolinfo",
      id: 1,
    },
  };

  const res = await axios(options);

  if (res.data.Error) throw new Error(JSON.stringify(res.data.Error, null, 2));
  return res.data.Result;
};

module.exports.getFullpDEXStatus = async (height) => {
  const options = {
    method: "POST",
    url: process.env.FULLNODE_DIRECTION,
    data: {
      id: 1,
      jsonrpc: "1.0",
      method: "getpdestate",
      params: [
        {
          BeaconHeight: height,
        },
      ],
    },
  };

  const res = await axios(options);

  if (res.data.Error) throw new Error(res.data.Error);
  return res.data.Result;
};

module.exports.getBeaconHeight = async () => {
  const options = {
    method: "get",
    url: process.env.FULLNODE_DIRECTION,
    data: {
      id: 1,
      jsonrpc: "1.0",
      method: "getblockchaininfo",
      params: [],
    },
  };

  const res = await axios(options);

  if (res.data.Error) throw new Error(JSON.stringify(res.data.Error, null, 2));

  return res.data.Result.BestBlocks[-1].Height;
};
