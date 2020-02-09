package router

import (
	"github.com/InsidiousClu/twitter-clone/pkg/controllers"
	"github.com/gorilla/mux"
	"net/http"
)

func PrivateRoutes(r *mux.Router, tc *controllers.TwitterController) {
	me := r.PathPrefix("/me").Subrouter()

	me.Use(AuthenticationMiddleware)
	me.HandleFunc("/tweets", tc.GetMyTweets).Methods(http.MethodGet, http.MethodOptions)
	me.HandleFunc("/create", tc.HandleTweetCreate).Methods(http.MethodOptions, http.MethodPost)
}