package services

import "github.com/jinzhu/gorm"

type AuthService struct {
	conn *gorm.DB
}

func (as *AuthService) ValidateJWTToken(token string) {
	panic("Not implemented")
}

func NewAuthService(conn *gorm.DB) *AuthService {
	as := AuthService{ conn: conn }
	return &as
}