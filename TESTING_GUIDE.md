# Taxi Company Management System - Testing Guide

## Prerequisites

1. **Database Setup**: Ensure your MariaDB database `taxi_company` is running and accessible
2. **Database Tables**: Make sure all tables (Driver, Car, Customer, Trip, Shift) exist in your database
3. **Sample Data**: It's recommended to have at least 10 records in each table for testing

## Step 1: Start the Spring Boot Application

1. Open a terminal/command prompt
2. Navigate to the project directory:
   ```bash
   cd taxi-company
   ```
3. Start the application:
   ```bash
   mvn spring-boot:run
   ```
   Or if using an IDE, run `TaxiCompanyApplication.java`

4. Wait for the application to start. You should see:
   ```
   Started TaxiCompanyApplication in X.XXX seconds
   ```

## Step 2: Access the Web Application

1. Open your web browser
2. Navigate to: `http://localhost:8080`
3. You should see the Taxi Company Management System homepage

## Step 3: Testing Each Module

### Testing Drivers Module

1. **View Drivers**: Click on "Drivers" in the navigation bar
   - Should display a table with all drivers (or empty state if no data)

2. **Create Driver**:
   - Click "Add New Driver"
   - Fill in the form:
     - First Name: John
     - Last Name: Doe
     - License Number: DL12345
     - Phone: 555-0100
     - Hire Date: 2024-01-15
     - Status: Active
   - Click "Create"
   - Verify the driver appears in the table

3. **Edit Driver**:
   - Click "Edit" on any driver row
   - Modify fields (e.g., change status to "Inactive")
   - Click "Update"
   - Verify changes are reflected

4. **Delete Driver**:
   - Click "Delete" on any driver row
   - Confirm deletion
   - Verify driver is removed from table

### Testing Cars Module

1. Click "Cars" in navigation
2. **Create Car**:
   - Click "Add New Car"
   - Fill in:
     - Plate Number: ABC-1234
     - Make: Toyota
     - Model: Camry
     - Year: 2020
     - Status: Available
   - Click "Create"

3. Test Edit and Delete operations similar to Drivers

### Testing Customers Module

1. Click "Customers" in navigation
2. **Create Customer**:
   - Click "Add New Customer"
   - Fill in:
     - Name: Jane Smith
     - Phone: 555-0200
     - Email: jane@example.com
     - Default Payment Method: Credit Card
   - Click "Create"

3. Test Edit and Delete operations

### Testing Trips Module

1. Click "Trips" in navigation
2. **Create Trip**:
   - Click "Add New Trip"
   - Fill in:
     - Customer ID: 1 (use existing customer ID)
     - Driver ID: 1 (use existing driver ID)
     - Car ID: 1 (use existing car ID)
     - Pickup Location: 123 Main St
     - Dropoff Location: 456 Oak Ave
     - Request Time: Select date/time
     - Pickup Time: Select date/time (after request time)
     - Dropoff Time: Select date/time (after pickup time)
     - Fare Amount: 25.50
     - Payment Status: Paid
   - Click "Create"

3. Test Edit and Delete operations

### Testing Shifts Module

1. Click "Shifts" in navigation
2. **Create Shift**:
   - Click "Add New Shift"
   - Fill in:
     - Driver ID: 1
     - Car ID: 1
     - Start Time: Select date/time
     - End Time: Select date/time (after start time)
   - Click "Create"

3. Test Edit and Delete operations

## Step 4: Testing API Endpoints Directly (Optional)

You can also test the REST APIs directly using tools like Postman or curl:

### Get All Drivers
```bash
curl http://localhost:8080/api/drivers
```

### Get Driver by ID
```bash
curl http://localhost:8080/api/drivers/1
```

### Create Driver
```bash
curl -X POST http://localhost:8080/api/drivers \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "Driver",
    "licenseNumber": "TEST123",
    "phone": "555-9999",
    "hireDate": "2024-01-01",
    "status": "Active"
  }'
```

### Update Driver
```bash
curl -X PUT http://localhost:8080/api/drivers/1 \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Updated",
    "lastName": "Name",
    "licenseNumber": "UPD123",
    "phone": "555-8888",
    "hireDate": "2024-01-01",
    "status": "Active"
  }'
```

### Delete Driver
```bash
curl -X DELETE http://localhost:8080/api/drivers/1
```

Similar patterns apply for `/api/cars`, `/api/customers`, `/api/trips`, and `/api/shifts`

## Step 5: Common Issues and Solutions

### Issue: "Failed to fetch" or CORS errors
**Solution**: Ensure the backend is running and CORS configuration is correct. The application should be accessed at `http://localhost:8080`

### Issue: Empty tables showing "No records found"
**Solution**: 
- Check database connection in `application.properties`
- Verify tables exist in the database
- Add sample data using SQL INSERT statements or through the UI

### Issue: 404 errors when accessing pages
**Solution**: 
- Ensure Spring Boot application is running
- Check that static files are in `src/main/resources/static/`
- Try accessing `http://localhost:8080/index.html` directly

### Issue: Date/Time fields not saving correctly
**Solution**: 
- Ensure datetime-local inputs are filled correctly
- Check database column types match (datetime for Trip/Shift times, date for Driver hireDate)

### Issue: Foreign key constraint errors
**Solution**: 
- When creating Trips or Shifts, ensure the referenced Driver IDs, Car IDs, and Customer IDs exist in the database
- Create Drivers, Cars, and Customers first before creating Trips/Shifts

## Step 6: Database Verification

To verify data is being saved correctly:

1. Connect to your MariaDB database:
   ```bash
   mysql -u root -p taxi_company
   ```

2. Check records:
   ```sql
   SELECT * FROM Driver;
   SELECT * FROM Car;
   SELECT * FROM Customer;
   SELECT * FROM Trip;
   SELECT * FROM Shift;
   ```

## Testing Checklist

- [ ] Application starts without errors
- [ ] Homepage loads correctly
- [ ] Navigation between sections works
- [ ] Can create records in all 5 modules
- [ ] Can view/list all records
- [ ] Can edit records
- [ ] Can delete records
- [ ] Data persists after page refresh
- [ ] Error messages display appropriately
- [ ] Success messages display after operations
- [ ] Forms validate required fields
- [ ] Foreign key relationships work (Trips/Shifts reference valid IDs)

## Next Steps

After testing, you can:
1. Add more sample data through the UI
2. Test edge cases (empty fields, invalid IDs, etc.)
3. Verify database constraints are working
4. Test with different browsers
5. Prepare your project report documenting the APIs and operations

