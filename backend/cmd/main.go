package main

import (
	"github.com/InsidiousClu/twitter-clone/config"
	"github.com/InsidiousClu/twitter-clone/pkg/router"
	"github.com/InsidiousClu/twitter-clone/pkg/utils"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

func createSignalHandler(broadcaster utils.Broadcaster) {
	signalCh := make(chan os.Signal, 1)
	signal.Notify(signalCh, os.Interrupt, syscall.SIGTERM)

	go func() {
		<-signalCh
		broadcaster.Close()
		log.Fatalln("interrupted, closing broadcaster")
	}()
}


func main() {
	// replace with .bash script for DB init wait loop
	//time.Sleep(time.Second * 10)

	c, err := config.NewConfig()
	if err != nil {
		log.Fatal(err)
	}

	handler, broadcaster := router.HandleRequest(c.Conn)
	createSignalHandler(broadcaster)

	srv := http.Server{
		Addr: c.AppAddr,
		Handler: handler,
		ReadTimeout: 10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	log.Println("Listening on:", c.AppAddr)
	log.Fatal(srv.ListenAndServe())
}