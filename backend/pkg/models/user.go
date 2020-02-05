package models


type User struct {
	Base
	Email     string `gorm:"type:varchar(100);unique" json:"email"`
	Password  string `json:"-"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
}