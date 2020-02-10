package controllers

import (
	"github.com/InsidiousClu/twitter-clone/pkg/services"
	"github.com/InsidiousClu/twitter-clone/pkg/utils"
	"net/http"
)


type UserControllerInterface interface {
	HandleUserSearch(w http.ResponseWriter, r *http.Request)
}

type UserController struct {
	us services.UserServiceInterface
}

func (uc *UserController) HandleUserSearch(w http.ResponseWriter, r *http.Request) {
	v := r.URL.Query()
	username := v.Get("username")
	response, err := uc.us.GetUserByUsername(username)
	utils.WriteResponse(w, err, response)
}

func NewUserController(us services.UserServiceInterface) UserControllerInterface {
	uc := UserController{ us: us }
	return &uc
}