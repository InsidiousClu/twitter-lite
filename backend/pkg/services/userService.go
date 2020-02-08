package services

import (
	customErrors "github.com/InsidiousClu/twitter-clone/pkg/errors"
	"github.com/InsidiousClu/twitter-clone/pkg/models"
	"github.com/jinzhu/gorm"
	"log"
)

type UserServiceInterface interface {
	CreateUser(email, password string) ([]byte, error)
	GetUserByPassword(email, password string) ([]byte, error)
}
type UserService struct {
	conn *gorm.DB
	entityName string
}

func (us *UserService) CreateUser(email, password string) ([]byte, error) {
	pass, err := CreateHashPass(password)
	if err != nil {
		log.Println(err)
	}
	var usr models.User
	local := us.conn.Where("email = ?", email).Select("id, first_name, email").First(&usr).Value
	if local == nil {
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