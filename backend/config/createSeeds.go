package config

import (
	"fmt"
	"github.com/InsidiousClu/twitter-clone/pkg/models"
	"github.com/InsidiousClu/twitter-clone/pkg/services"
	"github.com/jinzhu/gorm"
)


type Model struct {
	email string
	avatarNo int
	userName string
	firstName string
	lastName string
	password string
	tweets []models.Tweet
}

func createUserWithTweets(m Model) models.User {
	userPass, _ := services.CreateHashPass(m.password)
	usr :=  models.User{
		Base: models.Base{},
		Email:     m.email,
		Avatar:    fmt.Sprintf("http://localhost:8082/public/avatar_%d.jpg", m.avatarNo),
		Password:  string(userPass),
		UserName: m.userName,
		FirstName: m.firstName,
		LastName:  m.lastName,
		Followers: 0,
		Followed:  0,
	}

	for i := 0; i < len(m.tweets); i++ {
		usr.Tweets = append(usr.Tweets, m.tweets[i])
	}
	return usr
}

func CreateSeeds(c *gorm.DB) {
	users := []Model{
		{
			email:     "cat@cat.com",
			avatarNo:  1,
			firstName: "Cat",
			lastName:  "Cat",
			userName: "TheRealCat",
			password:  "meow123",
			tweets:    []models.Tweet{ { Text: "Meow meow!" }, { Text: "Meow meow meeeeeooooooow!" }, { Text: "Meow?" }, },
		},
		{
			email:     "ricardo@milos.com",
			avatarNo:  2,
			firstName: "Ricardo",
			lastName:  "Milos",
			userName: "DancinRicardo",
			password:  "dancin",
			tweets:    []models.Tweet{ { Text: "Watch my moves" }, { Text: "Flex flex flex" }, { Text: "DANCING!" }, },
		},
		{
			email:     "boomer@guy.com",
			avatarNo:  3,
			firstName: "Boomer",
			lastName:  "Boomer",
			userName: "SippinMonster",
			password:  "monsterDrink",
			tweets:    []models.Tweet{ { Text: "What's up Zoomers" }, { Text: "Listening to Led Zeppelin" }, { Text: "Gonna take a sip of that awesome monster drink" }, },
		},
		{
			email:     "dommer@lost.com",
			avatarNo:  4,
			firstName: "Doomer",
			lastName:  "Doomer",
			userName: "IamAnxios",
			password:  "anxiety123",
			tweets:    []models.Tweet{ { Text: "Russian depression" }, { Text: "Date was abandoned again" }, { Text: "Looking for doomer girl" }, },
		},
		{
			email:     "doomguy@slayer.com",
			avatarNo:  5,
			firstName: "Doomguy",
			lastName:  "Slayer",
			userName: "WhereAreTheDemons",
			password:  "destroyTheHell",
			tweets:    []models.Tweet{ { Text: "Teleporting to hell stay tuned" }, { Text: "WOAH! So much demons to kill" }, { Text: "They are on earth, I will resolve this till March of 2020" }, },
		},
		{
			email:     "arthur.fleck@joker.com",
			avatarNo:  6,
			firstName: "Arthur",
			lastName:  "Fleck",
			userName: "TheRealJoker",
			password:  "dancin",
			tweets:    []models.Tweet{ { Text: "MR.Wayne is my father?" }, { Text: "Nope, but I have met young Bruce. I think when he grows up we are gonna have a lot of fun" }, { Text: "SOCIETY IS SICK" }, },
		},

	}
	for i := 0; i < len(users); i++ {
		usr := createUserWithTweets(users[i])
		c.Create(&usr)
	}
}