
package com.gov.script_site.service;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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
public class UserService implements UserDetailsService {

    private UserRepository userRepository;
    private UserMapper userMapper;
    private PasswordEncoder passwordEncoder;

    public ResponseEntity<UserDTO> createUser(SignupDTO signupDto) {
        User user = new User(signupDto.getUsername(), signupDto.getEmail(),
                passwordEncoder.encode(signupDto.getPassword()));
        user = userRepository.save(user);
        return new ResponseEntity<UserDTO>(userMapper.UserToUserDto(user), HttpStatus.CREATED);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> UsernameNotFoundException.fromUsername(username));
    }

}
