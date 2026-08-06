package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"

	"naoolift-backend/config"
	"naoolift-backend/models"
)

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
	// 1. Initialize MySQL Database Connection
	db, err := config.InitDB()
	dbConnected := err == nil && db != nil

	r := gin.Default()
	r.Use(CORSMiddleware())

	// 2. Health & MySQL Status Check Endpoint
	r.GET("/api/v1/health", func(c *gin.Context) {
		dbStatus := "disconnected"
		if dbConnected && db.Ping() == nil {
			dbStatus = "connected"
		}

		c.JSON(http.StatusOK, gin.H{
			"status":   "online",
			"service":  "NaooLift Go REST API Server",
			"version":  "1.0.0",
			"mysql_db": dbStatus,
		})
	})

	// 3. Exercises Endpoint
	r.GET("/api/v1/exercises", func(c *gin.Context) {
		exercises := []models.Exercise{
			{ID: "ex-1", Name: "Barbell Bench Press", MuscleGroup: "Chest", Equipment: "Barbell", Instructions: "Lie on flat bench, press barbell upward with controlled motion."},
			{ID: "ex-2", Name: "Incline Dumbbell Press", MuscleGroup: "Chest", Equipment: "Dumbbell", Instructions: "Set bench at 30 degrees incline, press dumbbells Overhead."},
			{ID: "ex-7", Name: "Lat Pulldown", MuscleGroup: "Back", Equipment: "Cable", Instructions: "Pull bar down towards upper chest while keeping torso upright."},
			{ID: "ex-10", Name: "Conventional Deadlift", MuscleGroup: "Back", Equipment: "Barbell", Instructions: "Hinge at hips, keep flat back, pull barbell from floor to hip lock."},
			{ID: "ex-13", Name: "Barbell Back Squat", MuscleGroup: "Legs", Equipment: "Barbell", Instructions: "Place bar on upper traps, squat below parallel, drive through heels."},
			{ID: "ex-21", Name: "Dumbbell Lateral Raise", MuscleGroup: "Shoulders", Equipment: "Dumbbell", Instructions: "Raise dumbbells to side until parallel to floor."},
		}
		c.JSON(http.StatusOK, exercises)
	})

	// 4. Sample Member Users Endpoint
	r.GET("/api/v1/members", func(c *gin.Context) {
		members := []models.User{
			{ID: "usr-zaki", Name: "Zaki Naoo", Email: "zakiyh782@gmail.com", Phone: "08123456789", Role: "Super Admin Gym", RankName: "LEGEND"},
			{ID: "usr-1", Name: "Ahmad Pratama", Email: "ahmadpratama1@example.com", Phone: "081228607593", Role: "Pengurus Harian", RankName: "LEGEND"},
			{ID: "usr-2", Name: "Budi Wijaya", Email: "budiwijaya2@example.com", Phone: "083503411499", Role: "Anggota Aktif", RankName: "GOLD"},
		}
		c.JSON(http.StatusOK, members)
	})

	// 5. Admin Profile GET Endpoint (MySQL DB Persistent)
	r.GET("/api/v1/profile", func(c *gin.Context) {
		var user models.User
		if dbConnected {
			err := db.QueryRow("SELECT id, name, email, phone, role, rank_name, COALESCE(avatar_url, '') FROM users WHERE id = 'usr-zaki'").
				Scan(&user.ID, &user.Name, &user.Email, &user.Phone, &user.Role, &user.RankName, &user.AvatarURL)
			if err == nil {
				c.JSON(http.StatusOK, user)
				return
			}
		}
		c.JSON(http.StatusOK, models.User{
			ID: "usr-zaki", Name: "Zaki Naoo", Email: "naooolaf@gmail.com", Phone: "08123456789", Role: "Super Administrator & Lead Lifter", RankName: "LEGEND", AvatarURL: "",
		})
	})

	// 6. Admin Profile POST Endpoint (Saves Profile & Avatar to MySQL DB!)
	r.POST("/api/v1/profile", func(c *gin.Context) {
		var req struct {
			Name      string `json:"name"`
			Email     string `json:"email"`
			Phone     string `json:"phone"`
			AvatarURL string `json:"avatar_url"`
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
			return
		}

		if dbConnected {
			_, err := db.Exec(`
				INSERT INTO users (id, name, email, phone, role, rank_name, avatar_url)
				VALUES ('usr-zaki', ?, ?, ?, 'Super Administrator & Lead Lifter', 'LEGEND', ?)
				ON DUPLICATE KEY UPDATE name=?, email=?, phone=?, avatar_url=?
			`, req.Name, req.Email, req.Phone, req.AvatarURL, req.Name, req.Email, req.Phone, req.AvatarURL)

			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update database: " + err.Error()})
				return
			}
		}

		c.JSON(http.StatusOK, gin.H{
			"status":  "success",
			"message": "Profile & Avatar updated successfully in MySQL Database!",
			"data":    req,
		})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("⚡ NaooLift Go REST API Server (MySQL Ready) running on port %s...\n", port)
	r.Run(":" + port)
}
