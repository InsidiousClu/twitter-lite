package controllers

import (
	"github.com/InsidiousClu/twitter-clone/pkg/services"
	"github.com/InsidiousClu/twitter-clone/pkg/utils"
	"net/http"
)

type AuthController struct {
	us services.UserServiceInterface
}

func (ac *AuthController) HandleUserLogin(w http.ResponseWriter, r *http.Request) {
	fieldMap, err := utils.GetFields(r.Body, []string{ "password", "email"})
	if err != nil {
		utils.WriteResponse(w, err, nil)
		return
	}
	user, err := ac.us.GetUserByPassword(fieldMap["email"], fieldMap["password"])
	utils.WriteResponse(w, err, user)
}

func (ac *AuthController) HandleUserRegister(w http.ResponseWriter, r *http.Request) {
	fieldMap, err := utils.GetFields(r.Body, []string{ "password", "email" })
	if err != nil {
		utils.WriteResponse(w, err, nil)
		return
	}
	response, err := ac.us.CreateUser(fieldMap["email"], fieldMap["password"])
	if err != nil {
		utils.WriteResponse(w, err, nil)
		return
	}
	utils.WriteResponse(w, nil, response)
}



func NewAuthController(us services.UserServiceInterface) *AuthController {
	ac := AuthController{ us: us }
	return &ac
}