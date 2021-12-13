module.exports = (arr) => {
  if (arr.length === 1) {
    return [arr];
  } else {
    const permutations = [];
    // All the values, except the first one
    const toPermut = [...arr].filter((_, i) => i !== 0);

    for (let i = 0; i < arr.length; i++) {
      const newPermutations = module.exports(toPermut);
      for (const permutation of newPermutations) permutations.push([arr[i], ...permutation]);
    }

    return permutations;
  }
};
