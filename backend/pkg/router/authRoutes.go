package router

import (
	"github.com/InsidiousClu/twitter-clone/pkg/controllers"
	"github.com/gorilla/mux"
	"github.com/jinzhu/gorm"
	"net/http"
)

func AuthRoutes(r *mux.Router, conn *gorm.DB) {
	authRouter := r.PathPrefix("/auth").Subrouter()
	ac := controllers.NewAuthController(conn)
	authRouter.HandleFunc("/register", ac.HandleUserRegister).Methods(http.MethodOptions, http.MethodPost)
	authRouter.HandleFunc("/login", ac.HandleUserLogin).Methods(http.MethodOptions, http.MethodPost)

}