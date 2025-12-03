package com.example.taxi_company.config;

import org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JpaConfig {
    
    // This ensures Hibernate uses exact table and column names as specified in @Table and @Column annotations
    // No automatic case conversion or naming transformation
}

