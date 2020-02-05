package customErrors

import (
	"encoding/json"
	"fmt"
	"log"
)

type EntityNotFound struct {
	Message string `json:"message"`
	Entity string `json:"entity"`
}

func NewEntityNotFoundError(message, entity string) error {
	return &EntityNotFound{ Message: message, Entity: entity }
}

func (en *EntityNotFound) Error() string {
	return fmt.Sprintf("UserError occudred: %s", en.Message)
}

func (en *EntityNotFound) JsonError() []byte {
	response, err := json.Marshal(en)
	if err != nil {
		log.Println("cannot marshal entity", err)
	}
	return response
}