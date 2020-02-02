package router

import (
	"github.com/InsidiousClu/twitter-clone/pkg/controllers"
	"github.com/gorilla/mux"
	"log"
	"net/http"
	"strings"
)

func HeadersMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
		next.ServeHTTP(w, r)
	})
}

func AuthMiddleware(authController *controllers.AuthController) func (next http.Handler) http.Handler {
	return func (next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			autHeader := r.Header["Authorization"]
			str := strings.Replace(autHeader[0], "Bearer ", "", -1)
			authController.AuthService.ValidateJWTToken(str)
			next.ServeHTTP(w, r)
		})
	}
}

func OptionsMiddleware(next http.Handler) http.Handler  {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodOptions {
			return
		}
		next.ServeHTTP(w, r)
	})
}

func LoggerMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("%s %s %s %s\n", r.RemoteAddr, r.Method, r.URL, r.Header)
		next.ServeHTTP(w, r)
	})
}

func InitCommonMiddlewares(r *mux.Router) {
	r.Use(HeadersMiddleware)
	r.Use(LoggerMiddleware)
	r.Use(OptionsMiddleware)

}