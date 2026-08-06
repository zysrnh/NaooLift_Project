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
		avatar_url TEXT,
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

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}
