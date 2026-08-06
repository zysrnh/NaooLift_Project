package config

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/go-sql-driver/mysql"
)

var DB *sql.DB

// InitDB initializes the MySQL database connection
func InitDB() (*sql.DB, error) {
	dbHost := getEnv("DB_HOST", "127.0.0.1")
	dbPort := getEnv("DB_PORT", "3306")
	dbUser := getEnv("DB_USER", "root")
	dbPass := getEnv("DB_PASS", "")
	dbName := getEnv("DB_NAME", "naoolift_db")

	// Data Source Name (DSN)
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		dbUser, dbPass, dbHost, dbPort, dbName)

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Printf("⚠️ MySQL connection error: %v\n", err)
		return nil, err
	}

	// Verify connection
	if err := db.Ping(); err != nil {
		log.Printf("⚠️ Could not ping MySQL database at %s:%s. Ensure MySQL service is running.\n", dbHost, dbPort)
		return nil, err
	}

	log.Printf("✅ Successfully connected to MySQL database: %s\n", dbName)
	DB = db
	createTablesIfNotExist(db)
	SeedExercises(db)
	SeedDefaultAdmin(db)

	return db, nil
}

// createTablesIfNotExist creates initial tables in MySQL
func createTablesIfNotExist(db *sql.DB) {
	schema := `
	CREATE TABLE IF NOT EXISTS users (
		id VARCHAR(64) PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		email VARCHAR(255) UNIQUE NOT NULL,
		phone VARCHAR(32),
		role VARCHAR(64) DEFAULT 'Member',
		rank_name VARCHAR(32) DEFAULT 'IRON',
		avatar_url LONGTEXT,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS exercises (
		id VARCHAR(64) PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		muscle_group VARCHAR(64) NOT NULL,
		equipment VARCHAR(64) NOT NULL,
		instructions TEXT
	);

	CREATE TABLE IF NOT EXISTS routines (
		id VARCHAR(64) PRIMARY KEY,
		title VARCHAR(255) NOT NULL,
		day_of_week VARCHAR(32),
		description TEXT,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS workout_logs (
		id VARCHAR(64) PRIMARY KEY,
		user_id VARCHAR(64),
		routine_id VARCHAR(64),
		title VARCHAR(255),
		total_volume_kg DOUBLE DEFAULT 0,
		duration_minutes INT DEFAULT 0,
		logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);
	`
	_, err := db.Exec(schema)
	if err != nil {
		log.Printf("⚠️ Error executing table schema: %v\n", err)
	} else {
		log.Println("✅ MySQL database tables verified.")
	}
}

// SeedDefaultAdmin ensures default admin usr-zaki exists in MySQL
func SeedDefaultAdmin(db *sql.DB) {
	_, err := db.Exec(`
		INSERT INTO users (id, name, email, phone, role, rank_name, avatar_url)
		VALUES ('usr-zaki', 'Zaki Naoo', 'naooolaf@gmail.com', '08123456789', 'Super Administrator & Lead Lifter', 'LEGEND', '')
		ON DUPLICATE KEY UPDATE name=VALUES(name);
	`)
	if err != nil {
		log.Printf("⚠️ Error seeding default admin: %v\n", err)
	} else {
		log.Println("👤 Default Admin Zaki Naoo verified in MySQL DB.")
	}
}

// SeedExercises seeds complete 40 sequential exercises into MySQL database
func SeedExercises(db *sql.DB) {
	var count int
	err := db.QueryRow("SELECT COUNT(*) FROM exercises").Scan(&count)
	if err != nil || count > 0 {
		return // Already seeded
	}

	stmt, err := db.Prepare("INSERT INTO exercises (id, name, muscle_group, equipment, instructions) VALUES (?, ?, ?, ?, ?)")
	if err != nil {
		log.Printf("Error preparing exercise seed statement: %v\n", err)
		return
	}
	defer stmt.Close()

	seedList := []struct {
		id, name, muscle, equipment, instructions string
	}{
		{"ex-1", "Barbell Bench Press", "Chest", "Barbell", "Flat bench press focusing on chest development."},
		{"ex-2", "Incline Dumbbell Press", "Chest", "Dumbbell", "Incline bench press for upper chest."},
		{"ex-3", "Chest Fly (Cable)", "Chest", "Cable", "Continuous tension chest flyes."},
		{"ex-4", "Dips (Chest Focus)", "Chest", "Bodyweight", "Leaning forward dips targeting lower chest."},
		{"ex-5", "Push-Ups", "Chest", "Bodyweight", "Classic chest bodyweight movement."},
		{"ex-6", "Incline Barbell Bench Press", "Chest", "Barbell", "Upper chest barbell press."},
		{"ex-7", "Decline Chest Press Machine", "Chest", "Machine", "Lower chest isolation press."},
		{"ex-8", "Pec Deck Fly Machine", "Chest", "Machine", "Machine chest fly isolation."},
		{"ex-9", "Lat Pulldown", "Back", "Cable", "Lat width vertical pull."},
		{"ex-10", "Barbell Bent-Over Row", "Back", "Barbell", "Heavy back thickness row."},
		{"ex-11", "Seated Cable Row", "Back", "Cable", "Mid-back cable row."},
		{"ex-12", "Conventional Deadlift", "Back", "Barbell", "Full posterior chain strength builder."},
		{"ex-13", "Pull-Ups (Overhand)", "Back", "Bodyweight", "Strict overhand pull-ups."},
		{"ex-14", "Single-Arm Dumbbell Row", "Back", "Dumbbell", "Unilateral lat rowing."},
		{"ex-15", "T-Bar Row", "Back", "Barbell", "Corner bar row for back thickness."},
		{"ex-16", "Hyperextension", "Back", "Bodyweight", "Lower back & glute extension."},
		{"ex-17", "Barbell Back Squat", "Legs", "Barbell", "King of leg compound strength."},
		{"ex-18", "Leg Press", "Legs", "Machine", "Machine quad & glute press."},
		{"ex-19", "Romanian Deadlift (RDL)", "Legs", "Barbell", "Hamstring & glute hinge."},
		{"ex-20", "Bulgarian Split Squat", "Legs", "Dumbbell", "Unilateral quad & glute squat."},
		{"ex-21", "Lying Leg Curl", "Legs", "Machine", "Hamstring isolation curl."},
		{"ex-22", "Leg Extension", "Legs", "Machine", "Quadriceps isolation extension."},
		{"ex-23", "Standing Calf Raise", "Legs", "Machine", "Gastrocnemius calf raise."},
		{"ex-24", "Goblet Squat", "Legs", "Dumbbell", "Front weighted dumbbell squat."},
		{"ex-25", "Overhead Barbell Press (OHP)", "Shoulders", "Barbell", "Strict vertical shoulder press."},
		{"ex-26", "Dumbbell Lateral Raise", "Shoulders", "Dumbbell", "Side deltoid isolation."},
		{"ex-27", "Seated Dumbbell Shoulder Press", "Shoulders", "Dumbbell", "Seated shoulder press."},
		{"ex-28", "Face Pull (Cable)", "Shoulders", "Cable", "Rear deltoid & rotator cuff pull."},
		{"ex-29", "Reverse Pec Deck Fly", "Shoulders", "Machine", "Machine rear deltoid flyes."},
		{"ex-30", "Barbell Bicep Curl", "Arms", "Barbell", "Standing barbell bicep curl."},
		{"ex-31", "Dumbbell Hammer Curl", "Arms", "Dumbbell", "Brachialis dumbbell hammer curl."},
		{"ex-32", "Preacher Curl", "Arms", "Barbell", "Strict isolated bicep curl."},
		{"ex-33", "Triceps Rope Pushdown", "Arms", "Cable", "Tricep lateral head pushdown."},
		{"ex-34", "Skull Crusher", "Arms", "Barbell", "Lying triceps extension."},
		{"ex-35", "Overhead Cable Triceps Extension", "Arms", "Cable", "Long head tricep extension."},
		{"ex-36", "Hanging Leg Raise", "Core", "Bodyweight", "Abdominal & hip flexor raise."},
		{"ex-37", "Cable Woodchopper", "Core", "Cable", "Rotational oblique strength."},
		{"ex-38", "Ab Wheel Rollout", "Core", "Bodyweight", "Full core anti-extension rollout."},
		{"ex-39", "Treadmill Running", "Legs", "Cardio", "Cardiovascular endurance running."},
		{"ex-40", "Stationary Exercise Bike", "Legs", "Cardio", "Low-impact cardio cycling."},
	}

	for _, item := range seedList {
		_, _ = stmt.Exec(item.id, item.name, item.muscle, item.equipment, item.instructions)
	}
	log.Println("🌱 MySQL Database Seeded with 40 Exercises successfully.")
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}
