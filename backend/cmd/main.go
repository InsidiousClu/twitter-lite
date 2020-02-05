package main

import (
	"github.com/InsidiousClu/twitter-clone/config"
	"github.com/InsidiousClu/twitter-clone/pkg/router"
	"log"
	"net/http"
	"time"
)

func main() {
	// replace with .bash script for DB init wait loop
	//time.Sleep(time.Second * 10)

	c, err := config.NewConfig()
	if err != nil {
		log.Fatal(err)
	}

	srv := http.Server{
		Addr: c.AppAddr,
		Handler: router.HandleRequest(c.Conn),
		ReadTimeout: 10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}
	log.Println("Listening on:", c.AppAddr)
	log.Fatal(srv.ListenAndServe())
}