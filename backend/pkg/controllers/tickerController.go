package controllers

import (
	"encoding/json"
	"github.com/InsidiousClu/twitter-clone/pkg/services"
	"github.com/gorilla/websocket"
	"log"
	"strconv"
	"time"
)


const (
	TickerSessionClose = "SESSION_CLOSE"
	TickerState = "GET_TICKER_SECONDS"
)

type TickerController struct {
	c *websocket.Conn
	t *services.TickerState
	sessionTime time.Duration
}

type Message struct {
	Type string `json:"type"`
	Payload string `json:"payload"`
}
func marshalMessage(currType, payload string) ([]byte, error) {
	msg, err := json.Marshal(Message{ Type: currType, Payload: payload })
	if err != nil {
		return nil, err
	}
	return msg, err
}


func (tc *TickerController) CreateTicker(mt int) {
	msg, err := marshalMessage(TickerSessionClose, "")
	if err != nil {
		log.Println(err)
	}
	tc.t.SetHandler(func() {
		err := tc.c.WriteMessage(mt, msg)
		log.Println("Session expired")
		if err != nil {
			log.Println(err)
		}
	})
	tc.t.CreateTicker()
}


func (tc *TickerController) ResetTicker(mt int) {
	tc.t.HandleTickerCleanup()
	tc.t = services.NewTicker(tc.sessionTime)
	tc.CreateTicker(mt)
}

func (tc *TickerController) GetRemainingTime(mt int) error {
	remainTime := tc.t.GetRemainingTime()
	msg, err := marshalMessage(TickerState, strconv.Itoa(int(remainTime)))
	if err != nil {
		return err
	}
	err = tc.c.WriteMessage(mt, msg)
	if err != nil {
		return err
	}
	return nil
}

func NewTickerController(c *websocket.Conn, sessionTime time.Duration) *TickerController {
	tc := TickerController{ c: c, t: services.NewTicker(sessionTime), sessionTime: sessionTime }
	tc.c.SetCloseHandler(func(code int, text string) error {
		tc.t.HandleTickerCleanup()
		return nil
	})
	return &tc
}