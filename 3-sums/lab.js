/*
void print_combinations(const char *string)
{
    int i, j, k;
    int len = strlen(string);

    for (i = 0; i < len - 2; i++)
    {
        for (j = i + 1; j < len - 1; j++)
        {
            for (k = j + 1; k < len; k++)
                printf("%c%c%c\n", string[i], string[j], string[k]);
        }
    }
}
*/

function printCombinations(array, comb) {
  var i = 0
  const pairs = (new Array(comb)).fill(0).map(() => i++)

  const len = array.length

  for (var i = 0; i < array.length; i++) {
    array[i]
  }

  return pairs
}

// var res = getPermutations(list, 3);
// console.log(res.length); // 27
// console.log(res);

res = printCombinations([0,1,2,3,4], 3)
console.log(res)
