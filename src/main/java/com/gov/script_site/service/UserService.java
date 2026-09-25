
package com.gov.script_site.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.gov.script_site.entity.User;
import com.gov.script_site.mapper.UserMapper;
import com.gov.script_site.model.SignupDTO;
import com.gov.script_site.model.UserDTO;
import com.gov.script_site.repository.UserRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UserService {

    private UserRepository userRepository;
    private UserMapper userMapper;
    private PasswordEncoder passwordEncoder;

    public ResponseEntity<UserDTO> createUser(SignupDTO signupDto) {
        User user = new User(signupDto.getUsername(), signupDto.getEmail(),
                passwordEncoder.encode(signupDto.getPassword()));

        if (signupDto.getDiscordId() != null && !signupDto.getDiscordId().isEmpty()) {
            user.setDiscordId(signupDto.getDiscordId());
        }

        user = userRepository.save(user);
        return new ResponseEntity<UserDTO>(userMapper.toDto(user), HttpStatus.CREATED);
    }

    public ResponseEntity<UserDTO> getAuthenticatedUser(User user) {
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(userMapper.toDto(user));
    }

    public ResponseEntity<List<UserDTO>> getUsersWithName(String filter) {
        List<User> foundUsers = userRepository.findByUsernameStartingWithIgnoreCase(filter);

        if (foundUsers.size() == 0) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(foundUsers.stream().map(u -> userMapper.toDto(u)).toList());
    }

}
