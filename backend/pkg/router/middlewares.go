package router

import (
	"context"
	"fmt"
	"github.com/InsidiousClu/twitter-clone/pkg/services"
	"github.com/InsidiousClu/twitter-clone/pkg/utils"
	"github.com/gorilla/mux"
	log "github.com/sirupsen/logrus"
	"net/http"
	"os"
)

const StaticDir = "/public/"

func headersMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Add("Accept-Charset","utf-8")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT")
		w.Header().Set("Access-Control-Allow-Headers", "*")

		next.ServeHTTP(w, r)
	})
}

func loggerMiddleware(next http.Handler) http.Handler {
	log.SetFormatter(&log.TextFormatter{ FullTimestamp: true})
	log.SetOutput(os.Stdout)
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.WithFields(log.Fields{
			"remote": r.RemoteAddr,
			"method": r.Method,
			"path": r.URL,
			"headers":  r.Header,
		}).Info("REQUEST:")
		next.ServeHTTP(w, r)
	})
}

func optionsMiddleware(next http.Handler) http.Handler  {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodOptions {
			return
		}
		next.ServeHTTP(w, r)
	})
}

func AuthenticationMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func (w http.ResponseWriter, r *http.Request) {
		token, err := utils.ParseToken(r)
		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte("{ \"message\": \"not allowed\" }"))
			return
		}
		userId, err := services.ValidateJWTToken(token)
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte("{ \"message\": \"not allowed\" }"))
			return
		}
		ctx := context.WithValue(r.Context(), "userId", userId)
		fmt.Println("CONTEXT:", ctx.Value("userId"))
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func InitCommonMiddlewares(r *mux.Router) {
	r.Use(headersMiddleware)
	r.Use(loggerMiddleware)
	r.Use(optionsMiddleware)

}