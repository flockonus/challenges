package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
)

type problemInput struct {
	Values   []int64 `json:"values"`
	Elements int64   `json:"elements"`
	Target   int64   `json:"target"`
}

func check(e error) {
	if e != nil {
		panic(e)
	}
}

func main() {
	inputFiles := []string{
		"1_1",
		// "1_2",
		// "1_3",
	}

	for _, fileName := range inputFiles {
		filePath := fmt.Sprintf("./input/level%s.json", fileName)
		fmt.Println("reading", filePath)

		s, err := ioutil.ReadFile(filePath)
		check(err)

		var data problemInput
		check(json.Unmarshal(s, &data))

		fmt.Printf(" %#v\n", data)
		// fmt.Println("")
	}

	fmt.Println(inputFiles)

	comb(5, 3, func(c []int64) {
		fmt.Println(c, sum(c))
	})
}

// i think this will be slow.. original by https://rosettacode.org/wiki/Combinations#Go
func comb(n, m int64, emit func([]int64)) {
	// var last int64
	s := make([]int64, m)
	last := m - 1
	var rc func(int64, int64)
	rc = func(i, next int64) {
		var j int64
		for j = next; j < n; j++ {
			s[i] = j
			if i == last {
				emit(s)
			} else {
				rc(i+1, j+1)
			}
		}
		return
	}
	rc(0, 0)
}

func sum(arr []int64) int64 {
	var result int64
	for _, x := range arr {
		result += x
	}
	return result
}
