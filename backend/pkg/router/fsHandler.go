package router

import (
	"net/http"
)



func handleStaticFiles(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "max-age=3600")
		next.ServeHTTP(w, r)
	})
}

func CreateFileServer() http.Handler {
	staticServer := http.FileServer(http.Dir("../static"))
	return handleStaticFiles(staticServer)
}
