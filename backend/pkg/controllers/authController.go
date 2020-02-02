package controllers

import (
	"github.com/InsidiousClu/twitter-clone/pkg/services"
	"github.com/jinzhu/gorm"
	"net/http"
)

type AuthController struct {
	AuthService *services.AuthService
}

func (ac *AuthController) HandleUserLogin(w http.ResponseWriter, r *http.Request) {
	panic("Not implemented")
}

func (ac *AuthController) HandleUserRegister(w http.ResponseWriter, r *http.Request) {
	panic("Not implemented")
}


func NewAuthController(conn *gorm.DB) *AuthController {
	ac := AuthController{ AuthService: services.NewAuthService(conn) }
	return &ac
}