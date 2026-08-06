package models

import "time"

type User struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Phone     string    `json:"phone"`
	Role      string    `json:"role"`
	RankName  string    `json:"rank_name"`
	AvatarURL string    `json:"avatar_url"`
	CreatedAt time.Time `json:"created_at"`
}

type Exercise struct {
	ID           string `json:"id"`
	Name         string `json:"name"`
	MuscleGroup  string `json:"muscle_group"`
	Equipment    string `json:"equipment"`
	Instructions string `json:"instructions"`
}

type Routine struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	DayOfWeek   string `json:"day_of_week"`
	Description string `json:"description"`
}

type WorkoutLog struct {
	ID              string    `json:"id"`
	UserID          string    `json:"user_id"`
	RoutineID       string    `json:"routine_id"`
	Title           string    `json:"title"`
	TotalVolumeKg   float64   `json:"total_volume_kg"`
	DurationMinutes int       `json:"duration_minutes"`
	LoggedAt        time.Time `json:"logged_at"`
}
