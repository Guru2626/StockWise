package com.backend.IMS.config;

import com.backend.IMS.dto.UserDTO;
import com.backend.IMS.entity.User;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendImsApplication {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper mapper = new ModelMapper();

        // Explicit mapping from User.role.roleName to UserDTO.roleName
        mapper.addMappings(new PropertyMap<User, UserDTO>() {
            @Override
            protected void configure() {
                map().setRoleName(source.getRole().getRoleName());
            }
        });

        return mapper;
    }
}
