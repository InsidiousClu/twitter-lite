package models


type User struct {
	Base
	Email string `gorm:"type:varchar(100);unique" json:"email"`
	Avatar string `gorm:"type:varchar;'" json:"avatar"`
	Password string `json:"-"`
	UserName string `json:"user_name"`
	FirstName string `json:"first_name"`
	LastName string `json:"last_name"`
	Followers float32 `json:"followers"`
	Followed float32 `json:"followed"`
	Tweets []Tweet `json:"tweets,omitempty"`
}