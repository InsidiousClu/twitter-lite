package utils

import (
	customErrors "github.com/InsidiousClu/twitter-clone/pkg/errors"
	"net/http"
)


func WriteResponse(w http.ResponseWriter, err error, data []byte) {
	if err != nil {
		switch err.(type) {
		case *customErrors.MissingParamError:
			curr := err.(*customErrors.MissingParamError)
			w.WriteHeader(http.StatusMethodNotAllowed)
			w.Write(curr.JsonError())
			return
		case *customErrors.EntityNotFound:
			curr := err.(*customErrors.EntityNotFound)
			w.WriteHeader(http.StatusMethodNotAllowed)
			w.Write(curr.JsonError())
			return
		default:
			w.WriteHeader(http.StatusTeapot)
			w.Write([]byte(err.Error()))
		}
	}
	w.WriteHeader(http.StatusOK)
	w.Write(data)
}