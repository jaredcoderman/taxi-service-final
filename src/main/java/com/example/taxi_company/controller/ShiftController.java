package com.example.taxi_company.controller;

import com.example.taxi_company.entity.Shift;
import com.example.taxi_company.repository.ShiftRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/shifts")
public class ShiftController {
    
    @Autowired
    private ShiftRepository shiftRepository;
    
    @GetMapping
    public List<Shift> getAllShifts() {
        return shiftRepository.findAll();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Shift> getShiftById(@PathVariable Integer id) {
        Optional<Shift> shift = shiftRepository.findById(id);
        return shift.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<?> createShift(@RequestBody Shift shift) {
        try {
            // Validate required fields
            if (shift.getDriverID() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Driver ID is required"));
            }
            if (shift.getCarID() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Car ID is required"));
            }
            if (shift.getStartTime() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Start time is required"));
            }
            
            Shift savedShift = shiftRepository.save(shift);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedShift);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to create shift");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Shift> updateShift(@PathVariable Integer id, @RequestBody Shift shiftDetails) {
        Optional<Shift> optionalShift = shiftRepository.findById(id);
        if (optionalShift.isPresent()) {
            Shift shift = optionalShift.get();
            shift.setDriverID(shiftDetails.getDriverID());
            shift.setCarID(shiftDetails.getCarID());
            shift.setStartTime(shiftDetails.getStartTime());
            shift.setEndTime(shiftDetails.getEndTime());
            Shift updatedShift = shiftRepository.save(shift);
            return ResponseEntity.ok(updatedShift);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShift(@PathVariable Integer id) {
        if (shiftRepository.existsById(id)) {
            shiftRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}

