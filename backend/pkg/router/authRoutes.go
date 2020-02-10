package router

import (
	"github.com/InsidiousClu/twitter-clone/pkg/controllers"
	"github.com/InsidiousClu/twitter-clone/pkg/services"
	"github.com/gorilla/mux"
	"net/http"
)

func AuthRoutes(r *mux.Router, us services.UserServiceInterface) {
	authRouter := r.PathPrefix("/auth").Subrouter()
	ac := controllers.NewAuthController(us)
	authRouter.HandleFunc("/register", ac.HandleUserRegister).Methods(http.MethodOptions, http.MethodPost)
	authRouter.HandleFunc("/login", ac.HandleUserLogin).Methods(http.MethodOptions, http.MethodPost)
}