-- SQL script to verify table existence and structure
-- Run this in your MariaDB to check if tables exist

USE taxi_company;

-- Check if tables exist
SHOW TABLES;

-- Verify table structures
DESCRIBE Driver;
DESCRIBE Car;
DESCRIBE Customer;
DESCRIBE Trip;
DESCRIBE Shift;

-- If tables don't exist, create them with exact structure:
-- (Uncomment and run if needed)

/*
CREATE TABLE Driver (
    driverID INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    licenseNumber VARCHAR(255),
    phone VARCHAR(255),
    hireDate DATE,
    status VARCHAR(255)
);

CREATE TABLE Car (
    carID INT AUTO_INCREMENT PRIMARY KEY,
    plateNumber VARCHAR(255),
    make VARCHAR(255),
    model VARCHAR(255),
    year INT,
    status VARCHAR(255)
);

CREATE TABLE Customer (
    customerID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    phone VARCHAR(255),
    email VARCHAR(255),
    defaultPaymentMethod VARCHAR(255)
);

CREATE TABLE Trip (
    tripID INT AUTO_INCREMENT PRIMARY KEY,
    customerID INT,
    driverID INT,
    carID INT,
    pickupLocation VARCHAR(255),
    dropoffLocation VARCHAR(255),
    requestTime DATETIME,
    pickupTime DATETIME,
    dropoffTime DATETIME,
    fareAmount DECIMAL(10, 2),
    paymentStatus VARCHAR(255),
    FOREIGN KEY (customerID) REFERENCES Customer(customerID),
    FOREIGN KEY (driverID) REFERENCES Driver(driverID),
    FOREIGN KEY (carID) REFERENCES Car(carID)
);

CREATE TABLE Shift (
    shiftID INT AUTO_INCREMENT PRIMARY KEY,
    driverID INT,
    carID INT,
    startTime DATETIME,
    endTime DATETIME,
    FOREIGN KEY (driverID) REFERENCES Driver(driverID),
    FOREIGN KEY (carID) REFERENCES Car(carID)
);
*/

