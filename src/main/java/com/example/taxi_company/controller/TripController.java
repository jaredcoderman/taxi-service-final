package com.example.taxi_company.controller;

import com.example.taxi_company.entity.Trip;
import com.example.taxi_company.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/trips")
public class TripController {
    
    @Autowired
    private TripRepository tripRepository;
    
    @GetMapping
    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Trip> getTripById(@PathVariable Integer id) {
        Optional<Trip> trip = tripRepository.findById(id);
        return trip.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Trip> createTrip(@RequestBody Trip trip) {
        Trip savedTrip = tripRepository.save(trip);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedTrip);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Trip> updateTrip(@PathVariable Integer id, @RequestBody Trip tripDetails) {
        Optional<Trip> optionalTrip = tripRepository.findById(id);
        if (optionalTrip.isPresent()) {
            Trip trip = optionalTrip.get();
            trip.setCustomerID(tripDetails.getCustomerID());
            trip.setDriverID(tripDetails.getDriverID());
            trip.setCarID(tripDetails.getCarID());
            trip.setPickupLocation(tripDetails.getPickupLocation());
            trip.setDropoffLocation(tripDetails.getDropoffLocation());
            trip.setRequestTime(tripDetails.getRequestTime());
            trip.setPickupTime(tripDetails.getPickupTime());
            trip.setDropoffTime(tripDetails.getDropoffTime());
            trip.setFareAmount(tripDetails.getFareAmount());
            trip.setPaymentStatus(tripDetails.getPaymentStatus());
            Trip updatedTrip = tripRepository.save(trip);
            return ResponseEntity.ok(updatedTrip);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrip(@PathVariable Integer id) {
        if (tripRepository.existsById(id)) {
            tripRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}

