module.exports = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// const results = {};
// for (let i = 0; i < 100000; i++) {
//   const rand = module.exports(1, 3);
//   results[rand] = results[rand] ? results[rand] + 1 : 1;
// }
// console.log(results);
