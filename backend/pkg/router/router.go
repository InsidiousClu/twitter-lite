package router

import (
	"github.com/InsidiousClu/twitter-clone/pkg/controllers"
	"github.com/InsidiousClu/twitter-clone/pkg/utils"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/jinzhu/gorm"
	"net/http"
)



func HandleRequest(conn *gorm.DB) (*mux.Router, utils.Broadcaster) {
	broadcaster := utils.NewBroadcaster(10)
	tc := controllers.NewTwitterController(conn, broadcaster)
	upgrader := websocket.Upgrader{ CheckOrigin: func(r *http.Request) bool { return true } }

	r := mux.NewRouter().StrictSlash(true)
	fs := CreateFileServer()
	r.PathPrefix(StaticDir).Handler(http.StripPrefix(StaticDir, fs))
	r.HandleFunc("/ws", WSHandler(broadcaster, upgrader))

	api := r.PathPrefix("/api").Subrouter()
	api.HandleFunc("/tweets/like", tc.HandleTweetLike).Methods(http.MethodOptions, http.MethodPost)
	api.HandleFunc("/tweets/retweet", tc.HandleRetweet).Methods(http.MethodOptions, http.MethodPost)
	api.HandleFunc("/tweets/{userId:[0-9]+}", tc.HandleTweetsGet).Methods(http.MethodOptions, http.MethodGet)

	api.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("pong"))
	})

	InitCommonMiddlewares(api)
	PrivateRoutes(api, tc)
	AuthRoutes(api, conn)

	return r, broadcaster
}