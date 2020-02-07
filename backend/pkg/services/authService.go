package services

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/InsidiousClu/twitter-clone/pkg/models"
	"golang.org/x/crypto/bcrypt"
	"github.com/dgrijalva/jwt-go"
	"log"
	"time"
)

type AuthClaims struct {
	*jwt.StandardClaims
	UserId uint `json:"user_id"`
}
type SerializedUser struct {
	models.User
	AuthToken *string `json:"auth_token"`
}

func CreateHashPass(password string) ([]byte, error) {
	var pass []byte
	pass, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return pass, err
	}
	return pass, nil
}

func IsPasswordValid(hashedPassword, password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	if err != nil {
		return false
	}
	return true
}

func SerializeUser(user models.User) ([]byte, error) {
	token, err := GenerateJWTToken(&user)
	if err != nil {
		log.Println(errors.New(fmt.Sprintf("Cannot sign token for user, %v", err)))
	}
	currentUser := SerializedUser{
		User: user,
		AuthToken: token,
	}
	serialized, err := json.Marshal(currentUser)

	if err != nil {
		log.Println(errors.New(fmt.Sprintf("Cannot serialize user, %v", err)))
		return nil, err
	}
	return serialized, nil
}

func GenerateJWTToken(currentUser *models.User) (*string, error) {
	mySigningKey := []byte("twitterLite")
	claims := AuthClaims{
		&jwt.StandardClaims{ ExpiresAt: time.Now().UTC().Add(60 * time.Second).Unix(), Issuer: "TwitterLite" },
		currentUser.ID,
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	authToken, err := token.SignedString(mySigningKey)
	if err != nil {
		return nil, err
	}
	return &authToken, nil
}

func ValidateJWTToken(tokenString string) (uint, error)  {
	token, err := jwt.ParseWithClaims(tokenString, &AuthClaims{}, func(token *jwt.Token) (i interface{}, e error) {
		return []byte("twitterLite"), nil
	})
	if err != nil {
		return 0, err
	}
	if claims, ok := token.Claims.(*AuthClaims); ok && token.Valid {
		fmt.Printf("%d, %s", claims.UserId)
		return claims.UserId, nil
	}
	return 0, err
}