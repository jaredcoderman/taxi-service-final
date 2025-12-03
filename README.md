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
- **Docker** (recommended for easiest setup) OR **MariaDB** installed locally

## Quick Start (Easiest Method - Using Docker)

### Step 1: Start the Database

Open a terminal in the project directory and run:

```bash
docker-compose up -d
```

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

**Windows:**
```bash
copy src\main\resources\application.properties.example src\main\resources\application.properties
```

**Linux/Mac:**
```bash
cp src/main/resources/application.properties.example src/main/resources/application.properties
```

The default configuration already works with Docker! No changes needed.

### Step 3: Run the Application

**Windows:**
```bash
mvnw.cmd spring-boot:run
```

**Linux/Mac:**
```bash
./mvnw spring-boot:run
```

Or using Maven (if installed):
```bash
mvn spring-boot:run
```

### Step 4: Access the Application

Open your browser and go to: `http://localhost:8080`

### Stopping the Database

When you're done, stop the database with:
```bash
docker-compose down
```

To also remove the data volume:
```bash
docker-compose down -v
```

---

## Alternative Setup (Without Docker)

If you prefer not to use Docker, you can install MariaDB locally:

### Step 1: Install MariaDB

- **Windows**: Download from [MariaDB Downloads](https://mariadb.org/download/)
- **Mac**: `brew install mariadb`
- **Linux**: `sudo apt-get install mariadb-server` (Ubuntu/Debian) or `sudo yum install mariadb-server` (CentOS/RHEL)

### Step 2: Start MariaDB

```bash
# Windows: Start from Services or use MariaDB command prompt
# Mac/Linux:
sudo systemctl start mariadb  # or: sudo service mariadb start
```

### Step 3: Create Database and Tables

Connect to MariaDB:
```bash
mysql -u root -p
```

Run the initialization script:
```bash
mysql -u root -p < src/main/resources/db/init.sql
```

Or manually:
```sql
CREATE DATABASE taxi_company;
USE taxi_company;
-- Then copy/paste the SQL from src/main/resources/db/init.sql
```

### Step 4: Configure Application

1. Copy `src/main/resources/application.properties.example` to `src/main/resources/application.properties`
2. Update the database credentials in `application.properties`:
   ```properties
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

### Step 5: Run the Application

Same as Step 3 in the Docker setup above.

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

## Troubleshooting

### Docker Issues

**Port 3306 already in use:**
- Stop any local MariaDB/MySQL services
- Or change the port in `docker-compose.yml`: `"3307:3306"` and update `application.properties`

**Container won't start:**
- Check Docker is running: `docker ps`
- Check logs: `docker-compose logs mariadb`

### Application Won't Start

- **Check Java version**: `java -version` (needs 17+)
- **Check database connection**: Ensure MariaDB is running (Docker or local)
- **Check port 8080**: Ensure it's not in use

### Database Connection Errors

- **Docker**: Ensure `docker-compose up` is running
- **Local**: Verify MariaDB service is running
- Check credentials in `application.properties`

## Development

### Building the Project

```bash
mvn clean package
```

### Running Tests

```bash
mvn test
```

## License

This project is for educational purposes.

