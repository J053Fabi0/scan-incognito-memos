module.exports = {
  PRV_ID: "0000000000000000000000000000000000000000000000000000000000000004",

  /**
   * If it returns true, the memo is good to go, otherwise, it should not be added.
   */
  filters: (memo) =>
    memo &&
    memo !== "null" &&
    memo !== '""' &&
    memo !== "Bot" &&
    !(
      !isNaN(+memo) ||
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
    ),
};
