package main

import (
	"encoding/json"
	"fmt"
)

// this is a comment
func main() {
	s := `
{
  "target": "5",
  "structure": [
    {
      "0": []
    },
    {
      "15": [
        {
          "23": [
            {
              "1": [
                {
                  "5": []
                },
                {
                  "2": []
                },
                {
                  "3": []
                }
              ]
            },
            {
              "12": [
                {
                  "18": []
                },
                {
                  "11": []
                }
              ]
            }
          ]
        },
        {
          "4": [
            {
              "21": [
                {
                  "6": [
                    {
                      "8": []
                    },
                    {
                      "9": [
                        {
                          "14": [
                            {
                              "17": []
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "16": [
                        {
                          "19": []
                        }
                      ]
                    }
                  ]
                },
                {
                  "20": []
                },
                {
                  "22": []
                },
                {
                  "7": []
                }
              ]
            }
          ]
        },
        {
          "10": []
        },
        {
          "13": []
        }
      ]
    }
  ]
}`

	var data map[string]interface{}
	err := json.Unmarshal([]byte(s), &data)
	if err != nil {
		panic(err)
	}

	fmt.Println("target =", data["target"])
	// fmt.Println("structure =", data["structure"])

	structure, ok := data["structure"].([]interface{})
	if !ok {
		panic("failed to parse")
	}
	// for  _, v := range structure {
		// fmt.Println("first level", v)
	// }
	// fmt.Println("my structure parsed", structure)

	fmt.Println("Found value:", findKey(structure, "1", 0))
}

func findKey(structure []interface{}, target string, level int) string {
	level++
  fmt.Println("findKey", "level:", level, "struct len", len(structure))
	for  _, v := range structure {
		node, ok := v.(map[string]interface{})
    if !ok {
      panic("failed casting!")
    }
    // fmt.Printf("v: %#v", node) - len of node is always 1
    for k, v := range node {
      fmt.Println(" - level", level, "    k:", k)
      vSlice, ok := v.([]interface{})
      if !ok {
        panic("vSlice cast fail!")
      }
      fmt.Println("\n  vSlice len:", len(vSlice))
      if k == target {
        fmt.Println("!!! FOUND IT !!!")
        return k
      } else {
        fmt.Printf("  vSlice: %#v", vSlice)
      }
      // if (k == target) {
      //   return "FOUND TARGET" + k
      // } else {
      //   return findKey(vSlice, target, level)
      // }
    }
	}
  fmt.Println("\n\n   giving up search at level ", level)
	return "NOT FOUND"
}

func foo() string {
	return "Foo"
}

func goLoopsDontReturn() {

}
