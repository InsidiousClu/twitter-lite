package utils

import (
	"encoding/json"
	customErrors "github.com/InsidiousClu/twitter-clone/pkg/errors"
	"io"
)

func GetFields(body io.Reader, keys []string) (map[string]string, error) {
	var decoded map[string]interface{}
	fields := make(map[string]string)

	err := json.NewDecoder(body).Decode(&decoded)
	if err != nil {
		return nil, customErrors.NewMissingParamError("Cannot decoded passed request body", err.Error())
	}

	for i := 0; i < len(keys); i++ {
		if field, ok := decoded[keys[i]]; ok {
			fields[keys[i]] = field.(string)
		} else {
			return nil, customErrors.NewMissingParamError("Cannot find passed parameter", keys[i])
		}
	}
	return fields, nil
}