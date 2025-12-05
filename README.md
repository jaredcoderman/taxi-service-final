# Taxi Company Management System

A full-stack web application for managing a taxi company's operations, built with Spring Boot and MariaDB.

## Features

- **Driver Management**: Add, edit, and manage driver information
- **Car Fleet Management**: Track vehicles, their status, and details
- **Customer Management**: Maintain customer database with contact information
- **Trip Management**: Record and track taxi trips with fare information
- **Shift Management**: Manage driver shifts and vehicle assignments
- **Reports**: View operational reports and statistics

## Tech Stack

- **Backend**: Spring Boot 4.0.0
- **Database**: MariaDB
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Build Tool**: Maven
- **Java Version**: 17

## Prerequisites

- **Java 17** or higher
- **Maven** (or use the included Maven wrapper)
- **Docker Desktop** (recommended for easiest setup) - **Make sure Docker Desktop is running!** OR **MariaDB** installed locally

## Quick Start (Easiest Method - Using Docker)

### Step 0: Ensure Docker Desktop is Running

**Important**: Before running docker commands, make sure Docker Desktop is installed and running on your system.

- **Windows/Mac**: Open Docker Desktop application and wait for it to fully start (whale icon in system tray should be steady)
- **Linux**: Ensure Docker daemon is running: `sudo systemctl status docker`

If you get an error like "The system cannot find the file specified" or "Cannot connect to Docker daemon", Docker Desktop is not running.

### Step 1: Start the Database

Open a terminal in the project directory and run:

```bash
docker compose up -d
```

**Note**: Use `docker compose` (with space) for newer Docker versions, or `docker-compose` (with hyphen) for older versions. Both work the same way.

This will:
- Download and start MariaDB automatically
- Create the `taxi_company` database
- Create all required tables
- Seed the database with sample data

The database will be available at `localhost:3306` with:
- Username: `root`
- Password: `rootpassword`
- Database: `taxi_company`

### Step 2: Configure Application

Copy the example properties file:

**Windows (Command Prompt):**
```bash
copy src\main\resources\application.properties.example src\main\resources\application.properties
```

**Windows (Git Bash/PowerShell/WSL) or Linux/Mac:**
```bash
cp src/main/resources/application.properties.example src/main/resources/application.properties
```

The default configuration already works with Docker! No changes needed.

### Step 3: Run the Application

**Windows (Git Bash/PowerShell/WSL):**
```bash
./mvnw spring-boot:run
```

**Windows (Command Prompt):**
```bash
mvnw.cmd spring-boot:run
```

**Linux/Mac:**
```bash
./mvnw spring-boot:run
```

Or using Maven (if installed globally):
```bash
mvn spring-boot:run
```

### Step 4: Access the Application

Open your browser and go to: `http://localhost:8080`

### Stopping the Database

When you're done, stop the database with:
```bash
docker compose down
```

Or with the hyphenated version:
```bash
docker-compose down
```

To also remove the data volume:
```bash
docker compose down -v
```

## Project Structure

```
taxi-company/
├── src/
│   ├── main/
│   │   ├── java/com/example/taxi_company/
│   │   │   ├── config/          # Configuration classes (CORS, JPA)
│   │   │   ├── controller/       # REST API controllers
│   │   │   ├── entity/           # JPA entities
│   │   │   ├── repository/       # JPA repositories
│   │   │   └── exception/       # Exception handlers
│   │   └── resources/
│   │       ├── static/           # Frontend files (HTML, JS, CSS)
│   │       ├── db/               # Database scripts
│   │       └── application.properties  # Application configuration
│   └── test/                     # Test files
├── docker-compose.yml            # Docker setup for database
├── pom.xml                       # Maven dependencies
└── README.md                     # This file
```

## API Endpoints

The application provides RESTful APIs for all entities:

- **Drivers**: `/api/drivers`
- **Cars**: `/api/cars`
- **Customers**: `/api/customers`
- **Trips**: `/api/trips`
- **Shifts**: `/api/shifts`

All endpoints support standard CRUD operations (GET, POST, PUT, DELETE).

For detailed API testing instructions, see [TESTING_GUIDE.md](TESTING_GUIDE.md).

## License

This project is for educational purposes.

