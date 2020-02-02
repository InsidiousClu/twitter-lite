package router

import (
	"github.com/InsidiousClu/twitter-clone/pkg/controllers"
	"github.com/gorilla/mux"
	"github.com/jinzhu/gorm"
)

func AuthRoutes(r *mux.Router, conn *gorm.DB) {
	authRouter := r.PathPrefix("/auth").Subrouter()
	ac := controllers.NewAuthController(conn)
	authRouter.Use(AuthMiddleware(ac))

	authRouter.HandleFunc("/register", ac.HandleUserRegister)
	authRouter.HandleFunc("/login", ac.HandleUserLogin)

}