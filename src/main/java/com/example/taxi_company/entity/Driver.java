package com.example.taxi_company.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Driver")
@Data
public class Driver {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "driverID")
    private Integer driverID;
    
    @Column(name = "firstName")
    private String firstName;
    
    @Column(name = "lastName")
    private String lastName;
    
    @Column(name = "licenseNumber")
    private String licenseNumber;
    
    @Column(name = "phone")
    private String phone;
    
    @Column(name = "hireDate")
    private java.sql.Date hireDate;
    
    @Column(name = "status")
    private String status;
}

