package router

import (
	"github.com/gorilla/mux"
	"github.com/jinzhu/gorm"
	"net/http"
)

func HandleRequest(conn *gorm.DB) *mux.Router {
	r := mux.NewRouter()

	r.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("pong"))
	})

	InitCommonMiddlewares(r)
	AuthRoutes(r, conn)
	return r
}