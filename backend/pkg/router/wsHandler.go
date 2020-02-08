package router

import (
	"encoding/json"
	"github.com/InsidiousClu/twitter-clone/pkg/controllers"
	"github.com/InsidiousClu/twitter-clone/pkg/services"
	"github.com/InsidiousClu/twitter-clone/pkg/utils"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
)


const (
	TickerSocketMessageStart = "TICKER_START"
	TickerState = "GET_TICKER_SECONDS"
	ResetTicker = "RESET_TICKER"
)

type Message struct {
	Type string `json:"type"`
	Payload string `json:"payload"`
}


func handleBroadcast(broadcaster utils.Broadcaster, c *websocket.Conn, tc *controllers.TickerController) {
	ch := make(chan interface{})
	broadcaster.Register(ch)
	defer broadcaster.Unregister(ch)
	for v := range ch {
		switch v.(type) {
		case services.SocketTweets:
			msg, err := json.Marshal(v.(services.SocketTweets))
			if err != nil {
				log.Println(err)
				return
			}
			go tc.ResetTicker(1)
			tc.GetRemainingTime(1)

			err = c.WriteMessage(1, msg)
			if err != nil {
				log.Println(err)
				return
			}
		}
	}
}

func WSHandler(broadcaster utils.Broadcaster, upgrader websocket.Upgrader) http.HandlerFunc {
	return func (w http.ResponseWriter, r *http.Request) {
		c, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println("upgrade", err)
		}
		tc := controllers.NewTickerController(c, 60)

		defer c.Close()
		go handleBroadcast(broadcaster, c, tc)

		for {
			mt, message, err := c.ReadMessage()
			msg := string(message)
			if err != nil {
				log.Println("Read:", err)
				break
			}
			log.Printf("Received: %s", message)
			switch msg {
			case TickerSocketMessageStart:
				go tc.CreateTicker(mt)
			case TickerState:
				tc.GetRemainingTime(mt)
			case ResetTicker:
				go tc.ResetTicker(mt)
				tc.GetRemainingTime(mt)
			}
		}
	}
}