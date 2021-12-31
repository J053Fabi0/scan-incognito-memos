require("dotenv").config();

const scanBlocks = require("./blockchain/scanBlocks");
scanBlocks.main();

// (async () => {
//   const { memosDB } = require("./functions/initDatabase");
//   const allMemos = await memosDB.find();

//   for ({ _id, memo } of allMemos)
//     if (
//       !isNaN(+memo) || //
//       /UA/.test(memo) ||
//       / ua /.test(memo) ||
//       /QUEST/.test(memo) ||
//       /^mapurush/.test(memo) ||
//       /^\w{40,}$/.test(memo) ||
//       /membership/.test(memo) ||
//       /scholarship/i.test(memo) ||
//       /^refund trade/.test(memo) ||
//       /Enjoy Your Perks Gift/.test(memo) ||
//       /^Abundance is flowing!/.test(memo) ||
//       /^(rewards|reward) from/i.test(memo)
//     ) {
//       await memosDB.remove({ _id });
//     }
// })();

const ON_DEATH = require("death");
let hasAskedToStop = false;
ON_DEATH(async function () {
  if (hasAskedToStop) return process.exit(0);
  hasAskedToStop = true;

  console.log("\nStoping blocks scanner");
  await scanBlocks.stop();
  console.log("Done. Exiting now.");
  process.exit(0);
});

/*
 * Exrpess
 */
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(function (_, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const routes = require("./routes");
app.use(routes);

const ip = require("ip");
const activateServer = (port) =>
  app
    .listen(port, () => console.log(`Server on http://${ip.address()}:${port}`))
    .on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.log("Error EADDRINUSE on port " + port);
        activateServer(port + 1);
      }
    });
activateServer(3030);
