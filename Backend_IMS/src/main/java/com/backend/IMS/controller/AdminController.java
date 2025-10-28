package com.backend.IMS.controller;

import java.util.Map;

import com.backend.IMS.entity.Role;
import com.backend.IMS.entity.User;
import com.backend.IMS.exception.RoleNotFoundException;
import com.backend.IMS.exception.UserNotFoundException;
import com.backend.IMS.repository.RoleRepository;
import com.backend.IMS.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired private UserRepository userRepository;
    @Autowired private RoleRepository roleRepository;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/promote/{userId}")
    public ResponseEntity<?> promoteToManager(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));
        Role manager = roleRepository.findByRoleName("Manager")
                .orElseThrow(() -> new RoleNotFoundException("Role 'Manager' not found"));
        user.setRole(manager);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User promoted to Manager", "userId", user.getUserId()));
    }
}
