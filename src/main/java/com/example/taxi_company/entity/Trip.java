package com.example.taxi_company.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.sql.Timestamp;

@Entity
@Table(name = "Trip")
@Data
public class Trip {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tripID")
    private Integer tripID;
    
    @Column(name = "customerID")
    private Integer customerID;
    
    @Column(name = "driverID")
    private Integer driverID;
    
    @Column(name = "carID")
    private Integer carID;
    
    @Column(name = "pickupLocation")
    private String pickupLocation;
    
    @Column(name = "dropoffLocation")
    private String dropoffLocation;
    
    @Column(name = "requestTime")
    private Timestamp requestTime;
    
    @Column(name = "pickupTime")
    private Timestamp pickupTime;
    
    @Column(name = "dropoffTime")
    private Timestamp dropoffTime;
    
    @Column(name = "fareAmount")
    private BigDecimal fareAmount;
    
    @Column(name = "paymentStatus")
    private String paymentStatus;
}

