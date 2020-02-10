package router

import (
	"github.com/InsidiousClu/twitter-clone/pkg/controllers"
	"github.com/InsidiousClu/twitter-clone/pkg/services"
	"github.com/InsidiousClu/twitter-clone/pkg/utils"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/jinzhu/gorm"
	"net/http"
)



func HandleRequest(conn *gorm.DB) (*mux.Router, utils.Broadcaster) {
	upgrader := websocket.Upgrader{ CheckOrigin: func(r *http.Request) bool { return true } }

	broadcaster := utils.NewBroadcaster(10)
	us := services.NewUserService(conn)

	tc := controllers.NewTwitterController(conn, broadcaster)
	uc := controllers.NewUserController(us)

	r := mux.NewRouter().StrictSlash(true)
	fs := CreateFileServer()
	r.PathPrefix(StaticDir).Handler(http.StripPrefix(StaticDir, fs))
	r.HandleFunc("/ws", WSHandler(broadcaster, upgrader))

	api := r.PathPrefix("/api").Subrouter()
	api.HandleFunc("/tweets/like", tc.HandleTweetLike).Methods(http.MethodOptions, http.MethodPost)
	api.HandleFunc("/tweets/retweet", tc.HandleRetweet).Methods(http.MethodOptions, http.MethodPost)
	api.HandleFunc("/tweets/{userId:[0-9]+}", tc.HandleTweetsGet).Methods(http.MethodOptions, http.MethodGet)
	api.HandleFunc("/search", uc.HandleUserSearch).Methods(http.MethodOptions, http.MethodGet)

	// test handler
	api.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("pong"))
	})

	InitCommonMiddlewares(api)
	PrivateRoutes(api, tc)
	AuthRoutes(api, us)

	return r, broadcaster
}