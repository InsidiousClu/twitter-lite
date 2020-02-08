package models


type Tweet struct {
	Base
	UserID  uint
	Text string `gorm:"type:varchar(180)" json:"text"`
	Likes int `gorm:"type:int" json:"likes"`
	Retweeted int `gorm:"type:int" json:"retweeted"`
}