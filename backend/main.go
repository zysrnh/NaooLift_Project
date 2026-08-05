package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

// Data Models
type Exercise struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	MuscleGroup string `json:"muscle_group"`
	Equipment   string `json:"equipment"`
}

type RoutineExercise struct {
	ExerciseID     string `json:"exercise_id"`
	TargetSets     int    `json:"target_sets"`
	TargetReps     string `json:"target_reps"`
	TargetWeightKg float64 `json:"target_weight_kg"`
	RestSeconds    int    `json:"rest_seconds"`
}

type Routine struct {
	ID          string            `json:"id"`
	Title       string            `json:"title"`
	DayOfWeek   string            `json:"day_of_week"`
	Description string            `json:"description"`
	Exercises   []RoutineExercise `json:"exercises"`
}

type WorkoutSet struct {
	ExerciseID string  `json:"exercise_id"`
	SetNumber  int     `json:"set_number"`
	WeightKg   float64 `json:"weight_kg"`
	Reps       int     `json:"reps"`
	RPE        float64 `json:"rpe"`
	IsPR       bool    `json:"is_pr"`
}

type WorkoutLog struct {
	ID              string       `json:"id"`
	RoutineID       string       `json:"routine_id"`
	Title           string       `json:"title"`
	Date            string       `json:"date"`
	DurationMinutes int          `json:"duration_minutes"`
	TotalVolumeKg   float64      `json:"total_volume_kg"`
	FeelingRating   int          `json:"feeling_rating"`
	Sets            []WorkoutSet `json:"sets"`
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}
}

func main() {
	r := gin.Default()
	r.Use(CORSMiddleware())

	// Health Check
	r.GET("/api/v1/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "online",
			"service": "NaooLift Go API Server",
			"version": "1.0.0",
		})
	})

	// Sample Exercises Endpoint
	r.GET("/api/v1/exercises", func(c *gin.Context) {
		c.JSON(http.StatusOK, []Exercise{
			{ID: "ex-1", Name: "Barbell Bench Press", MuscleGroup: "Chest", Equipment: "Barbell"},
			{ID: "ex-2", Name: "Incline Dumbbell Press", MuscleGroup: "Chest", Equipment: "Dumbbell"},
			{ID: "ex-7", Name: "Lat Pulldown", MuscleGroup: "Back", Equipment: "Cable"},
			{ID: "ex-10", Name: "Conventional Deadlift", MuscleGroup: "Back", Equipment: "Barbell"},
			{ID: "ex-13", Name: "Barbell Back Squat", MuscleGroup: "Legs", Equipment: "Barbell"},
			{ID: "ex-21", Name: "Dumbbell Lateral Raise", MuscleGroup: "Shoulders", Equipment: "Dumbbell"},
		})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("⚡ NaooLift Go REST API Server running on port %s...\n", port)
	r.Run(":" + port)
}
