package main

import (
	"encoding/json"
	"fmt"
)

// given input files, make a grid
// func makeGrid() {

// }

// func snakes() {

// }

// this is a comment
func main() {
	fmt.Println("Hello World", foo())
	s := `{
		"text":"I'm a text.",
		"number":1234,
		"floats":[1.1, 2.2, 3.3],
    	"innermap":{
			"foo":1,
			"bar":2
		}
	}`

	var data map[string]interface{}
	err := json.Unmarshal([]byte(s), &data)
	if err != nil {
		panic(err)
	}

	fmt.Println("text =", data["text"])
	fmt.Println("number =", data["number"])
	fmt.Println("floats =", data["floats"])
	fmt.Println("innermap =", data["innermap"])

	innermap, ok := data["innermap"].(map[string]interface{})
	if !ok {
		panic("inner map is not a map!")
	}
	fmt.Println("innermap.foo =", innermap["foo"])
	fmt.Println("innermap.bar =", innermap["bar"])

	fmt.Println("The whole map:", data)
}

func foo() string {
	return "Foo"
}
