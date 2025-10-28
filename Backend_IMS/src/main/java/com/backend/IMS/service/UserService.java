package com.backend.IMS.service;

import com.backend.IMS.dto.UserDTO;
import com.backend.IMS.entity.User;
import com.backend.IMS.exception.UserNotFoundException;
import com.backend.IMS.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    // ✅ Get all users
    public List<UserDTO> getAllUsers() {
        logger.info("Fetching all users from the database");
        List<UserDTO> users = userRepository.findAll()
                .stream()
                .map(user -> modelMapper.map(user, UserDTO.class))
                .collect(Collectors.toList());
        logger.info("Total users fetched: {}", users.size());
        return users;
    }

    // ✅ Get user by ID
    public UserDTO getUserById(Long id) {
        logger.info("Fetching user with ID: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("User not found with ID: {}", id);
                    return new UserNotFoundException("User not found with ID: " + id);
                });
        logger.info("User fetched successfully: {}", user.getUserName());
        return modelMapper.map(user, UserDTO.class);
    }

    // ✅ Delete user
    public void deleteUser(Long id) {
        logger.info("Deleting user with ID: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("User not found with ID: {}", id);
                    return new UserNotFoundException("User not found with ID: " + id);
                });
        userRepository.delete(user);
        logger.info("User deleted successfully: {}", user.getUserName());
    }
}
