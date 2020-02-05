package customErrors

import (
	"encoding/json"
	"fmt"
	"log"
)

type MissingParamError struct {
	Message string `json:"message"`
	MissingParam string `json:"missingParam"`
}

func NewMissingParamError(message, missingParam string) error {
	return &MissingParamError{ Message: message, MissingParam: missingParam }
}

func (u *MissingParamError) Error() string {
	return fmt.Sprintf("NewMissingParamError occudred: %s", u.Message)
}

func (u *MissingParamError) JsonError() []byte {
	response, err := json.Marshal(u)
	if err != nil {
		log.Println("cannot marshal MissingParamError", err)
	}
	return response
}