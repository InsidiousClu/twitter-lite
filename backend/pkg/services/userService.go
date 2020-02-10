package services

import (
	"encoding/json"
	"fmt"
	customErrors "github.com/InsidiousClu/twitter-clone/pkg/errors"
	"github.com/InsidiousClu/twitter-clone/pkg/models"
	"github.com/jinzhu/gorm"
	"log"
)

type UserServiceInterface interface {
	CreateUser(email, password string) ([]byte, error)
	GetUserByPassword(email, password string) ([]byte, error)
	GetUserByUsername(username string) ([]byte, error)
}
type UserService struct {
	conn *gorm.DB
	entityName string
}

type Suggestions struct {
	Users []models.User `json:"users"`
}

func (us *UserService) CreateUser(email, password string) ([]byte, error) {
	pass, err := CreateHashPass(password)
	if err != nil {
		log.Println(err)
	}
	var usr models.User
	us.conn.Where("email = ?", email).Select("id, first_name, email").First(&usr)
	if usr.Email == "" {
		usr.Password = string(pass)
		usr.Email = email
		us.conn.Save(&usr)
		serialized, err := SerializeUser(usr)
		if err != nil {
			log.Println(err)
			return nil, err
		}
		return serialized, nil
	}
	return nil, customErrors.NewEntityNotFoundError("user already exists", us.entityName)
}

func (us *UserService) GetUserByUsername(username string)  ([]byte, error) {
	var usr []models.User
	if err := us.conn.Where("to_tsvector(user_name) @@ to_tsquery(?)", fmt.Sprintf("%s:*", username)).Find(&usr).Error; err != nil {
		return nil, err
	}
	serialized, err := json.Marshal(Suggestions{ Users:usr })
	if err != nil {
		return nil, err
	}
	return serialized, nil
}

func (us *UserService) GetUserByPassword(email, password string) ([]byte, error) {
	var usr models.User
	us.conn.Where("email = ?", email).First(&usr)
	if IsPasswordValid(usr.Password, password) {
		serialized, err := SerializeUser(usr)
		if err != nil {
			log.Println(err)
			return nil, err
		}
		return serialized, nil
	}
	return nil, customErrors.NewEntityNotFoundError("password is not valid", us.entityName)
}

func NewUserService(conn *gorm.DB) UserServiceInterface {
	as := UserService{ conn: conn, entityName: "User" }
	return &as
}