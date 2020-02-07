package services

import (
	"time"
)

type TickerState struct {
	RemainTime time.Duration
	handler func()
	exit chan bool
	abortHandler bool
}

func (ts *TickerState) CreateTicker() {
	var currBase time.Duration
	if ts.RemainTime == 0 {
		currBase = 60
	} else {
		currBase = ts.RemainTime
	}
	ticker := time.NewTicker(1 * time.Second)
	timeTicker := time.NewTicker(currBase * time.Second)

	go func() {
		for range ticker.C {
			if ts.RemainTime == 0 || <- ts.exit {
				ticker.Stop()
				break
			}
			ts.RemainTime -= 1
		}
	}()

	go func() {
		for {
			<- ts.exit
			ts.abortHandler = true
			timeTicker.Stop()
			break
		}
	}()

	<- timeTicker.C
	if !ts.abortHandler {
		ts.handler()
	}
}


func (ts *TickerState) HandleTickerCleanup() {
	ts.exit <- true
}

func (ts *TickerState) GetRemainingTime() time.Duration {
	return ts.RemainTime
}

func (ts *TickerState) SetHandler(handler func()) {
	if ts.handler == nil {
		ts.handler = handler
	}
}

func NewTicker(remainTime time.Duration) *TickerState {
	ts := TickerState{ RemainTime: remainTime, exit: make(chan bool, 1) }
	return &ts
}
