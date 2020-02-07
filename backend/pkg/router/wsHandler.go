package router

import (
	"github.com/InsidiousClu/twitter-clone/pkg/controllers"
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

func WSHandler(upgrader websocket.Upgrader) http.HandlerFunc {
	return func (w http.ResponseWriter, r *http.Request) {
		c, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println("upgrade", err)
		}
		tc := controllers.NewTickerController(c, 60)

		defer c.Close()
		for {
			mt, message, err := c.ReadMessage()
			msg := string(message)
			if err != nil {
				log.Println("read:", err)
				break
			}
			log.Printf("recv: %s", message)
			switch msg {
			case TickerSocketMessageStart:
				go tc.CreateTicker(mt)
			case TickerState:
				err := tc.GetRemainingTime(mt)
				if err != nil {
					log.Println(err)
					break
				}
			case ResetTicker:
				go tc.ResetTicker(mt)
				err := tc.GetRemainingTime(mt)
				if err != nil {
					log.Println(err)
					break
				}
			}
		}
	}
}