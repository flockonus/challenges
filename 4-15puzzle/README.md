## run with:

```
time node generator.js 3 level_1.json
time node --max_old_space_size=6096 generator.js 4 level_2.json
```

Next best optimizations to try:
- when generating solutions, replace previous path if found a shorter
- when searching solution, test all possible paths, choose one that has least entropy

## solutions samples:


for puzzle 3: solved! 1527
solved!! 541
solved!! 515

solved 4:
4422180
4770236
6417422
