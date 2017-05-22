package main

import (
	"testing"
)

func TestFoo(t *testing.T) {
	if foo() != "Foo" {
		t.Error(foo())
	}
}
