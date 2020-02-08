package router

import (
	"github.com/InsidiousClu/twitter-clone/pkg/controllers"
	"github.com/gorilla/mux"
)

func PrivateRoutes(r *mux.Router, tc *controllers.TwitterController) {
	me := r.PathPrefix("/me").Subrouter()

	me.Use(AuthenticationMiddleware)
	me.HandleFunc("/tweets", tc.GetMyTweets)

}