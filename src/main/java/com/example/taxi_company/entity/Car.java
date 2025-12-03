package com.example.taxi_company.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Car")
@Data
public class Car {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "carID")
    private Integer carID;
    
    @Column(name = "plateNumber")
    private String plateNumber;
    
    @Column(name = "make")
    private String make;
    
    @Column(name = "model")
    private String model;
    
    @Column(name = "year")
    private Integer year;
    
    @Column(name = "status")
    private String status;
}

