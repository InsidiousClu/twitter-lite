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
	r := mux.NewRouter()
	upgrader := websocket.Upgrader{ CheckOrigin: func(r *http.Request) bool { return true } }

	broadcaster := utils.NewBroadcaster(10)

	tc := controllers.NewTwitterController(conn, broadcaster)


	r.HandleFunc("/tweets/like", tc.HandleTweetLike).Methods(http.MethodOptions, http.MethodPost)
	r.HandleFunc("/tweets/retweet", tc.HandleRetweet).Methods(http.MethodOptions, http.MethodPost)
	r.HandleFunc("/tweets/{userId:[0-9]+}", tc.HandleTweetsGet).Methods(http.MethodOptions, http.MethodGet)

	r.HandleFunc("/ws", WSHandler(broadcaster, upgrader))
	r.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("pong"))
	})

	PrivateRoutes(r, tc)
	AuthRoutes(r, conn)
	InitCommonMiddlewares(r)

	return r, broadcaster
}