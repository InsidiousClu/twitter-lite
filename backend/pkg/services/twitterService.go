package services

import (
	"encoding/json"
	"github.com/InsidiousClu/twitter-clone/pkg/models"
	"github.com/InsidiousClu/twitter-clone/pkg/utils"
	"github.com/jinzhu/gorm"
)


const (
	UpdateLikes = "UPDATE_LIKES"
	UpdateRetweets = "UPDATE_RETWEETS"
)

type TwitterServiceInterface interface {
	CreateTweet(userId uint, text string, likes int) ([]byte, error)
	LikeTweet(tweetId uint) ([]byte, error)
	Retweet(tweetId uint) ([]byte, error)
	GetTweets(userId, startsAt, endsAt string) ([]byte, error)
}


type socketPayload struct {
	ID uint `json:"id"`
	Likes int `json:"likes"`
	Retweets int `json:"retweets"`
}

type SocketTweets struct {
	Type string `json:"type"`
	Payload socketPayload
}

type TwitterService struct {
	conn *gorm.DB
	broadcaster utils.Broadcaster
}

type TweetsResponse struct {
	tweets []models.Tweet
}

func (tw *TwitterService) CreateTweet(userId uint, text string, likes int) ([]byte, error) {
	t := models.Tweet {
		Text: text,
		Likes: likes,
		UserID: userId,
	}
	if err := tw.conn.Create(&t).Error; err != nil {
		return nil, err
	}
	tweet, err := json.Marshal(t)
	if err != nil {
 		return nil, err
	}
	return tweet, err
}

func (tw *TwitterService) getTweet(tweetId uint) (*models.Tweet, error) {
	var t models.Tweet
	if err := tw.conn.Where("id = ?", tweetId).First(&t).Error; err != nil {
		return nil, err
	}
	return &t, nil
}

func (tw *TwitterService) LikeTweet(tweetId uint) ([]byte, error) {
	t, err := tw.getTweet(tweetId)
	if err != nil {
		return nil, err
	}
	t.Likes += 1
	if err := tw.conn.Save(&t).Error; err != nil {
		return nil, err
	}
	tw.broadcaster.Submit(SocketTweets{
		Type: UpdateLikes,
		Payload: socketPayload{ ID: t.ID, Likes: t.Likes, Retweets: t.Retweeted },
	})
	tweet, err := json.Marshal(t)
	if err != nil {
		return nil, err
	}
	return tweet, err
}


func (tw *TwitterService) GetTweets(userId, startsAt, endsAt string) ([]byte, error) {
	var t []models.Tweet

	if err := tw.conn.Where("user_id = ? created_at BETWEEN ? AND ?", userId, startsAt, endsAt).Find(&t).Error; err != nil {
		return nil, err
	}

	tweets, err := json.Marshal(TweetsResponse{tweets:t})
	if err != nil {
		return nil, err
	}

	return tweets, err
}


func (tw *TwitterService) Retweet(tweetId uint) ([]byte, error) {
	t, err := tw.getTweet(tweetId)
	if err != nil {
		return nil, err
	}
	t.Retweeted += 1

	tw.broadcaster.Submit(SocketTweets{
		Type: UpdateRetweets,
		Payload: socketPayload{ ID: t.ID, Likes: t.Likes, Retweets: t.Retweeted },
	})

	if err := tw.conn.Save(&t).Error; err != nil {
		return nil, err
	}
	tweet, err := json.Marshal(t)
	if err != nil {
		return nil, err
	}
	return tweet, err
}

func NewTwitterService(c *gorm.DB, broadcaster utils.Broadcaster) TwitterServiceInterface {
	tw := TwitterService{ conn: c, broadcaster: broadcaster }
	return &tw
}