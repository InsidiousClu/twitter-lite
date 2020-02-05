package config

import (
	"fmt"
	"github.com/InsidiousClu/twitter-clone/pkg/models"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"os"
)


type Config struct {
	Conn *gorm.DB
	AppAddr string
}

func GetEnv(envVar, fallback string) string {
	env := os.Getenv(envVar)
	if env == "" {
		return fallback
	}
	return env
}

func NewConfig() (*Config, error) {
	user := GetEnv("POSTGRES_USER", "twitter_clone")
	pass := GetEnv("POSTGRES_PASSWORD", "twitter_clone")
	dbName := GetEnv("POSTGRES_DB", "twitter_clone")
	dbHost := GetEnv("DB_HOST", "0.0.0.0")
	credentials := fmt.Sprintf("host=%s port=5432 user=%s dbname=%s password=%s  sslmode=disable", dbHost, user, dbName, pass)

	db, err := gorm.Open("postgres", credentials)
	if err != nil {
		return nil, err
	}
	db.LogMode(true)
	db.AutoMigrate(&models.User{})
	c := Config{
		Conn: db,
		AppAddr: fmt.Sprintf(":%s", GetEnv("PORT", "8082")),
	}
	return &c, nil
}