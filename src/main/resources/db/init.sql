-- This script runs automatically when the MariaDB container starts
-- It creates the database schema and seeds initial data

USE taxi_company;

-- Create Driver table
CREATE TABLE IF NOT EXISTS Driver (
    driverID INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    licenseNumber VARCHAR(255),
    phone VARCHAR(255),
    hireDate DATE,
    status VARCHAR(255)
);

-- Create Car table
CREATE TABLE IF NOT EXISTS Car (
    carID INT AUTO_INCREMENT PRIMARY KEY,
    plateNumber VARCHAR(255),
    make VARCHAR(255),
    model VARCHAR(255),
    year INT,
    status VARCHAR(255)
);

-- Create Customer table
CREATE TABLE IF NOT EXISTS Customer (
    customerID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    phone VARCHAR(255),
    email VARCHAR(255),
    defaultPaymentMethod VARCHAR(255)
);

-- Create Trip table
CREATE TABLE IF NOT EXISTS Trip (
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
    FOREIGN KEY (customerID) REFERENCES Customer(customerID) ON DELETE SET NULL,
    FOREIGN KEY (driverID) REFERENCES Driver(driverID) ON DELETE SET NULL,
    FOREIGN KEY (carID) REFERENCES Car(carID) ON DELETE SET NULL
);

-- Create Shift table
CREATE TABLE IF NOT EXISTS Shift (
    shiftID INT AUTO_INCREMENT PRIMARY KEY,
    driverID INT,
    carID INT,
    startTime DATETIME,
    endTime DATETIME,
    FOREIGN KEY (driverID) REFERENCES Driver(driverID) ON DELETE SET NULL,
    FOREIGN KEY (carID) REFERENCES Car(carID) ON DELETE SET NULL
);

-- Seed initial data
INSERT INTO Driver (firstName, lastName, licenseNumber, phone, hireDate, status) VALUES
('John', 'Smith', 'DL12345', '555-0101', '2023-01-15', 'Active'),
('Sarah', 'Johnson', 'DL12346', '555-0102', '2023-02-20', 'Active'),
('Michael', 'Williams', 'DL12347', '555-0103', '2023-03-10', 'Active'),
('Emily', 'Brown', 'DL12348', '555-0104', '2023-04-05', 'Active'),
('David', 'Jones', 'DL12349', '555-0105', '2023-05-12', 'Active'),
('Jessica', 'Garcia', 'DL12350', '555-0106', '2022-11-08', 'Active'),
('Robert', 'Miller', 'DL12351', '555-0107', '2022-09-22', 'Active'),
('Amanda', 'Davis', 'DL12352', '555-0108', '2023-06-18', 'Active'),
('James', 'Rodriguez', 'DL12353', '555-0109', '2023-07-25', 'Active'),
('Lisa', 'Martinez', 'DL12354', '555-0110', '2023-08-30', 'Active');

INSERT INTO Car (plateNumber, make, model, year, status) VALUES
('ABC-1234', 'Toyota', 'Camry', 2020, 'Available'),
('XYZ-5678', 'Honda', 'Accord', 2021, 'Available'),
('DEF-9012', 'Ford', 'Fusion', 2019, 'Available'),
('GHI-3456', 'Chevrolet', 'Malibu', 2022, 'Available'),
('JKL-7890', 'Nissan', 'Altima', 2020, 'Available'),
('MNO-2345', 'Toyota', 'Prius', 2021, 'Available'),
('PQR-6789', 'Hyundai', 'Sonata', 2019, 'Available'),
('STU-0123', 'Kia', 'Optima', 2022, 'Available'),
('VWX-4567', 'Mazda', 'Mazda6', 2020, 'Available'),
('YZA-8901', 'Subaru', 'Legacy', 2021, 'Available');

INSERT INTO Customer (name, phone, email, defaultPaymentMethod) VALUES
('Alice Thompson', '555-1001', 'alice.thompson@email.com', 'Credit Card'),
('Bob Wilson', '555-1002', 'bob.wilson@email.com', 'Cash'),
('Carol Anderson', '555-1003', 'carol.anderson@email.com', 'Credit Card'),
('Daniel Taylor', '555-1004', 'daniel.taylor@email.com', 'Debit Card'),
('Eva Thomas', '555-1005', 'eva.thomas@email.com', 'Credit Card'),
('Frank Jackson', '555-1006', 'frank.jackson@email.com', 'Cash'),
('Grace White', '555-1007', 'grace.white@email.com', 'Credit Card'),
('Henry Harris', '555-1008', 'henry.harris@email.com', 'Debit Card'),
('Ivy Martin', '555-1009', 'ivy.martin@email.com', 'Credit Card'),
('Jack Thompson', '555-1010', 'jack.thompson@email.com', 'Cash');

INSERT INTO Trip (customerID, driverID, carID, pickupLocation, dropoffLocation, requestTime, pickupTime, dropoffTime, fareAmount, paymentStatus) VALUES
(1, 1, 1, '123 Main St', '456 Oak Ave', '2024-01-15 08:00:00', '2024-01-15 08:15:00', '2024-01-15 08:45:00', 25.50, 'Paid'),
(2, 2, 2, '789 Pine Rd', '321 Elm St', '2024-01-15 09:00:00', '2024-01-15 09:10:00', '2024-01-15 09:35:00', 18.75, 'Paid'),
(3, 3, 3, '555 Maple Dr', '888 Cedar Ln', '2024-01-15 10:00:00', '2024-01-15 10:20:00', '2024-01-15 10:55:00', 32.00, 'Paid'),
(4, 4, 4, '222 Birch Way', '777 Spruce Ave', '2024-01-15 11:00:00', '2024-01-15 11:05:00', '2024-01-15 11:30:00', 15.25, 'Paid'),
(5, 5, 5, '333 Willow St', '999 Ash Blvd', '2024-01-15 12:00:00', '2024-01-15 12:15:00', '2024-01-15 12:50:00', 28.50, 'Paid');

INSERT INTO Shift (driverID, carID, startTime, endTime) VALUES
(1, 1, '2024-01-15 08:00:00', '2024-01-15 16:00:00'),
(2, 2, '2024-01-15 09:00:00', '2024-01-15 17:00:00'),
(3, 3, '2024-01-15 10:00:00', '2024-01-15 18:00:00'),
(4, 4, '2024-01-15 11:00:00', '2024-01-15 19:00:00'),
(5, 5, '2024-01-15 12:00:00', '2024-01-15 20:00:00');

