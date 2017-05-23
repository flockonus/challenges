package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"time"
)

type problemInput struct {
	Values   []int64 `json:"values"`
	Elements int64   `json:"elements"`
	Target   int64   `json:"target"`
}

type abort struct {
	Halt *bool
}

func check(e error) {
	if e != nil {
		panic(e)
	}
}

func main() {
	inputFiles := []string{
		"1_1",
		"1_2",
		"1_3",
		"2_1",
		"2_2",
		"2_3",
		"3_1",
		"3_2",
		"3_3",
		"4_1",
		"4_2",
		"4_3",
	}
	fmt.Println(inputFiles)

	fmt.Println("file | target | found? | answer | time")
	fmt.Println("--- | --- | --- | --- | ---")
	for _, fileName := range inputFiles {
		// var abortButton *abort
		// abortButton = *(abortFn{false})
		probe := abort{Halt: &[]bool{false}[0]}
		// fmt.Println(*probe.Halt) // Prints true
		start := time.Now()
		var answer []int64
		found := false
		filePath := fmt.Sprintf("./input/level%s.json", fileName)
		// fmt.Println("reading", filePath)

		s, err := ioutil.ReadFile(filePath)
		check(err)

		var data problemInput
		check(json.Unmarshal(s, &data))

		// h := handler{is: func() *bool { b := true; return &b }()}

		// fmt.Printf(" %#v\n", data)

		comb(data.Values, data.Elements, probe.Halt, func(c []int64) {
			soma := sum(c)
			// fmt.Println("-->", c, soma)
			if soma == data.Target {
				answer = c
				// fmt.Println("found it!!!", c)
				found = true
				// data.ResultCount++
				*probe.Halt = true
			}
		})
		elapsed := time.Since(start)
		fmt.Printf("%s.json | %d | %t | %v | %s\n", fileName, data.Target, found, answer, elapsed)
	}

	// comb(5, 3, func(c []int64) {
	// 	fmt.Println(c, sum(c))
	// })
}

// i think this will be slow.. original by https://rosettacode.org/wiki/Combinations#Go
func comb(values []int64, m int64, stop *bool, emit func([]int64)) {
	var n int64
	n = int64(len(values))
	// var last int64
	s := make([]int64, m)
	last := m - 1
	var rc func(int64, int64)
	rc = func(i, next int64) {
		var j int64
		for j = next; j < n; j++ {
			if *stop {
				// fmt.Println("ASKED TO STOP!")
				break
			}
			// s[i] = j
			s[i] = values[j]
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
