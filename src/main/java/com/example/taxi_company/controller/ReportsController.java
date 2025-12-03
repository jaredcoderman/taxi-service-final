package com.example.taxi_company.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reports")
public class ReportsController {
    
    @Autowired
    private EntityManager entityManager;
    
    /**
     * Query 1: Total revenue by driver
     * Demonstrates: JOIN, GROUP BY, SUM aggregation
     */
    @GetMapping("/revenue-by-driver")
    public ResponseEntity<?> getRevenueByDriver() {
        String sql = """
            SELECT 
                d.driverID,
                d.firstName,
                d.lastName,
                COALESCE(SUM(t.fareAmount), 0) as totalRevenue,
                COUNT(t.tripID) as totalTrips
            FROM Driver d
            LEFT JOIN Trip t ON d.driverID = t.driverID
            GROUP BY d.driverID, d.firstName, d.lastName
            ORDER BY totalRevenue DESC
            """;
        
        Query query = entityManager.createNativeQuery(sql);
        List<Object[]> results = query.getResultList();
        
        List<Map<String, Object>> formatted = results.stream()
            .map(row -> {
                Map<String, Object> map = new HashMap<>();
                map.put("driverID", row[0]);
                map.put("firstName", row[1]);
                map.put("lastName", row[2]);
                map.put("totalRevenue", row[3]);
                map.put("totalTrips", row[4]);
                return map;
            })
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(formatted);
    }
    
    /**
     * Query 2: Most popular pickup locations
     * Demonstrates: GROUP BY, COUNT, ORDER BY
     */
    @GetMapping("/popular-pickup-locations")
    public ResponseEntity<?> getPopularPickupLocations() {
        String sql = """
            SELECT 
                pickupLocation,
                COUNT(*) as tripCount,
                AVG(fareAmount) as averageFare
            FROM Trip
            WHERE pickupLocation IS NOT NULL
            GROUP BY pickupLocation
            ORDER BY tripCount DESC
            LIMIT 10
            """;
        
        Query query = entityManager.createNativeQuery(sql);
        List<Object[]> results = query.getResultList();
        
        List<Map<String, Object>> formatted = results.stream()
            .map(row -> {
                Map<String, Object> map = new HashMap<>();
                map.put("pickupLocation", row[0]);
                map.put("tripCount", row[1]);
                map.put("averageFare", row[2]);
                return map;
            })
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(formatted);
    }
    
    /**
     * Query 3: Active drivers with their current car assignments
     * Demonstrates: JOIN, WHERE conditions, multiple table relationships
     */
    @GetMapping("/active-drivers-with-cars")
    public ResponseEntity<?> getActiveDriversWithCars() {
        String sql = """
            SELECT DISTINCT
                d.driverID,
                d.firstName,
                d.lastName,
                d.status as driverStatus,
                c.carID,
                c.plateNumber,
                c.make,
                c.model,
                c.status as carStatus
            FROM Driver d
            INNER JOIN Shift s ON d.driverID = s.driverID
            INNER JOIN Car c ON s.carID = c.carID
            WHERE d.status = 'Active'
                AND s.endTime IS NULL
                OR s.endTime > NOW()
            ORDER BY d.lastName, d.firstName
            """;
        
        Query query = entityManager.createNativeQuery(sql);
        List<Object[]> results = query.getResultList();
        
        List<Map<String, Object>> formatted = results.stream()
            .map(row -> {
                Map<String, Object> map = new HashMap<>();
                map.put("driverID", row[0]);
                map.put("firstName", row[1]);
                map.put("lastName", row[2]);
                map.put("driverStatus", row[3]);
                map.put("carID", row[4]);
                map.put("plateNumber", row[5]);
                map.put("make", row[6]);
                map.put("model", row[7]);
                map.put("carStatus", row[8]);
                return map;
            })
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(formatted);
    }
    
    /**
     * Query 4: Customer trip history with payment status
     * Demonstrates: JOIN, WHERE, ORDER BY with multiple tables
     */
    @GetMapping("/customer-trip-history")
    public ResponseEntity<?> getCustomerTripHistory() {
        String sql = """
            SELECT 
                c.customerID,
                c.name as customerName,
                c.defaultPaymentMethod,
                t.tripID,
                t.pickupLocation,
                t.dropoffLocation,
                t.fareAmount,
                t.paymentStatus,
                t.requestTime,
                d.firstName as driverFirstName,
                d.lastName as driverLastName
            FROM Customer c
            INNER JOIN Trip t ON c.customerID = t.customerID
            LEFT JOIN Driver d ON t.driverID = d.driverID
            ORDER BY c.customerID, t.requestTime DESC
            """;
        
        Query query = entityManager.createNativeQuery(sql);
        List<Object[]> results = query.getResultList();
        
        List<Map<String, Object>> formatted = results.stream()
            .map(row -> {
                Map<String, Object> map = new HashMap<>();
                map.put("customerID", row[0]);
                map.put("customerName", row[1]);
                map.put("defaultPaymentMethod", row[2]);
                map.put("tripID", row[3]);
                map.put("pickupLocation", row[4]);
                map.put("dropoffLocation", row[5]);
                map.put("fareAmount", row[6]);
                map.put("paymentStatus", row[7]);
                map.put("requestTime", row[8]);
                map.put("driverFirstName", row[9]);
                map.put("driverLastName", row[10]);
                return map;
            })
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(formatted);
    }
    
    /**
     * Query 5: Cars utilization statistics
     * Demonstrates: JOIN, COUNT, AVG, GROUP BY with date functions
     */
    @GetMapping("/car-utilization")
    public ResponseEntity<?> getCarUtilization() {
        String sql = """
            SELECT 
                c.carID,
                c.plateNumber,
                c.make,
                c.model,
                c.status,
                COUNT(DISTINCT t.tripID) as totalTrips,
                COUNT(DISTINCT s.shiftID) as totalShifts,
                COALESCE(SUM(t.fareAmount), 0) as totalRevenue,
                AVG(t.fareAmount) as averageFare
            FROM Car c
            LEFT JOIN Trip t ON c.carID = t.carID
            LEFT JOIN Shift s ON c.carID = s.carID
            GROUP BY c.carID, c.plateNumber, c.make, c.model, c.status
            ORDER BY totalTrips DESC, totalShifts DESC
            """;
        
        Query query = entityManager.createNativeQuery(sql);
        List<Object[]> results = query.getResultList();
        
        List<Map<String, Object>> formatted = results.stream()
            .map(row -> {
                Map<String, Object> map = new HashMap<>();
                map.put("carID", row[0]);
                map.put("plateNumber", row[1]);
                map.put("make", row[2]);
                map.put("model", row[3]);
                map.put("status", row[4]);
                map.put("totalTrips", row[5]);
                map.put("totalShifts", row[6]);
                map.put("totalRevenue", row[7]);
                map.put("averageFare", row[8]);
                return map;
            })
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(formatted);
    }
    
    /**
     * Query 6: Pending payments summary
     * Demonstrates: WHERE with conditions, SUM aggregation
     */
    @GetMapping("/pending-payments")
    public ResponseEntity<?> getPendingPayments() {
        String sql = """
            SELECT 
                paymentStatus,
                COUNT(*) as count,
                SUM(fareAmount) as totalAmount,
                AVG(fareAmount) as averageAmount
            FROM Trip
            WHERE paymentStatus IS NOT NULL
            GROUP BY paymentStatus
            ORDER BY totalAmount DESC
            """;
        
        Query query = entityManager.createNativeQuery(sql);
        List<Object[]> results = query.getResultList();
        
        List<Map<String, Object>> formatted = results.stream()
            .map(row -> {
                Map<String, Object> map = new HashMap<>();
                map.put("paymentStatus", row[0]);
                map.put("count", row[1]);
                map.put("totalAmount", row[2]);
                map.put("averageAmount", row[3]);
                return map;
            })
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(formatted);
    }
    
    /**
     * Query 7: Daily revenue report
     * Demonstrates: DATE functions, GROUP BY date, SUM
     */
    @GetMapping("/daily-revenue")
    public ResponseEntity<?> getDailyRevenue() {
        String sql = """
            SELECT 
                DATE(requestTime) as date,
                COUNT(*) as tripCount,
                SUM(fareAmount) as dailyRevenue,
                AVG(fareAmount) as averageFare
            FROM Trip
            WHERE requestTime IS NOT NULL
            GROUP BY DATE(requestTime)
            ORDER BY date DESC
            LIMIT 30
            """;
        
        Query query = entityManager.createNativeQuery(sql);
        List<Object[]> results = query.getResultList();
        
        List<Map<String, Object>> formatted = results.stream()
            .map(row -> {
                Map<String, Object> map = new HashMap<>();
                map.put("date", row[0]);
                map.put("tripCount", row[1]);
                map.put("dailyRevenue", row[2]);
                map.put("averageFare", row[3]);
                return map;
            })
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(formatted);
    }
    
    /**
     * Query 8: Top customers by spending
     * Demonstrates: JOIN, GROUP BY, SUM, ORDER BY with LIMIT
     */
    @GetMapping("/top-customers")
    public ResponseEntity<?> getTopCustomers() {
        String sql = """
            SELECT 
                c.customerID,
                c.name,
                c.email,
                COUNT(t.tripID) as totalTrips,
                SUM(t.fareAmount) as totalSpent,
                AVG(t.fareAmount) as averageTripCost,
                MAX(t.requestTime) as lastTripDate
            FROM Customer c
            LEFT JOIN Trip t ON c.customerID = t.customerID
            GROUP BY c.customerID, c.name, c.email
            HAVING COUNT(t.tripID) > 0
            ORDER BY totalSpent DESC
            LIMIT 10
            """;
        
        Query query = entityManager.createNativeQuery(sql);
        List<Object[]> results = query.getResultList();
        
        List<Map<String, Object>> formatted = results.stream()
            .map(row -> {
                Map<String, Object> map = new HashMap<>();
                map.put("customerID", row[0]);
                map.put("name", row[1]);
                map.put("email", row[2]);
                map.put("totalTrips", row[3]);
                map.put("totalSpent", row[4]);
                map.put("averageTripCost", row[5]);
                map.put("lastTripDate", row[6]);
                return map;
            })
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(formatted);
    }
}

