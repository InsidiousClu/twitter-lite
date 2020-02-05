package utils

import (
	"errors"
	"fmt"
	"net/http"
	"strings"
)


func ParseToken(r *http.Request) (string, error) {
	reqToken := r.Header.Get("Authorization")
	tokenString := strings.Split(reqToken, "Bearer")

	if len(tokenString) >= 1 {
		fmt.Println(strings.TrimSpace(tokenString[1]))
		return strings.TrimSpace(tokenString[1]), nil
	}
	return "", errors.New(fmt.Sprintf("cannot parse %v", tokenString))
}
