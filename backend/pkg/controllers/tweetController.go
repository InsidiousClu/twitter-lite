package controllers

import (
	customErrors "github.com/InsidiousClu/twitter-clone/pkg/errors"
	"github.com/InsidiousClu/twitter-clone/pkg/services"
	"github.com/InsidiousClu/twitter-clone/pkg/utils"
	"github.com/gorilla/mux"
	"github.com/jinzhu/gorm"
	"net/http"
	"strconv"
)

type TwitterController struct {
	ts services.TwitterServiceInterface
}

// HTTP handlers
func (tc *TwitterController) HandleTweetLike(w http.ResponseWriter, r *http.Request) {
	fieldMap, err := utils.GetFields(r.Body, []string{ "tweetId" })
	if err != nil {
		utils.WriteResponse(w, err, nil)
		return
	}
	id, err := strconv.Atoi(fieldMap["tweetId"])
	if err != nil {
		utils.WriteResponse(w, err, nil)
		return
	}
	response, err := tc.ts.LikeTweet(uint(id))
	utils.WriteResponse(w, err, response)
}

func (tc *TwitterController) HandleRetweet(w http.ResponseWriter, r *http.Request) {
	fieldMap, err := utils.GetFields(r.Body, []string{ "tweetId" })
	if err != nil {
		utils.WriteResponse(w, err, nil)
		return
	}
	id, err := strconv.Atoi(fieldMap["tweetId"])
	if err != nil {
		utils.WriteResponse(w, err, nil)
		return
	}
	response, err := tc.ts.LikeTweet(uint(id))
	utils.WriteResponse(w, err, response)
}


func (tc *TwitterController) HandleTweetsGet(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	v := r.URL.Query()
	startsAt := v.Get("startsAt")
	endsAt := v.Get("endsAt")

	if userId, ok := vars["userId"]; ok && startsAt != "" && endsAt != "" {
		response, err := tc.ts.GetTweets(userId, startsAt, endsAt)
		utils.WriteResponse(w, err, response)
		return
	}
	utils.WriteResponse(w, customErrors.NewMissingParamError("userId not found", "userId"), nil)
}


func (tc *TwitterController) HandleTweetCreate(w http.ResponseWriter, r *http.Request) {
	fieldMap, err := utils.GetFields(r.Body, []string{ "tweet" })
	id := r.Context().Value("userId")
	if err != nil {
		utils.WriteResponse(w, err, nil)
		return
	}
	response, err := tc.ts.CreateTweet(id.(uint), fieldMap["tweet"])
	utils.WriteResponse(w, err, response)
}

func (tc *TwitterController) GetMyTweets(w http.ResponseWriter, r *http.Request) {
	id := r.Context().Value("userId")
	v := r.URL.Query()
	startsAt := v.Get("startsAt")
	endsAt := v.Get("endsAt")

	if id != nil && startsAt != "" && endsAt != "" {
		response, err := tc.ts.GetTweets(id, startsAt, endsAt)
		utils.WriteResponse(w, err, response)
		return
	}
	utils.WriteResponse(w, customErrors.NewMissingParamError("userId not found", "userId"), nil)
}



func NewTwitterController(c *gorm.DB, broadcaster utils.Broadcaster) *TwitterController {
	tc := TwitterController{ ts: services.NewTwitterService(c, broadcaster) }
	return &tc
}