
package com.gov.script_site.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.gov.script_site.entity.Script;
import com.gov.script_site.entity.User;
import com.gov.script_site.model.ScriptDTO;
import com.gov.script_site.model.SignupDTO;
import com.gov.script_site.model.UserDTO;
import com.gov.script_site.repository.UserRepository;
import com.gov.script_site.util.mapper.ScriptMapper;
import com.gov.script_site.util.mapper.UserMapper;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UserService {

    private UserRepository userRepository;
    private UserMapper userMapper;
    private PasswordEncoder passwordEncoder;
    private ScriptMapper scriptMapper;

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

    public ResponseEntity<Page<ScriptDTO>> getLikedScripts(UUID id, int page, int size) {
        Optional<User> userOpt = userRepository.findById(id);

        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        User user = userOpt.get();

        PageRequest pageRequest = PageRequest.of(page, size);
        int start = (int) pageRequest.getOffset();
        int end = Math.min((start + pageRequest.getPageSize()), user.getLikedScripts().size());
        List<Script> sublist = new ArrayList<>(user.getLikedScripts());

        return ResponseEntity
                .ok(new PageImpl<>(sublist.subList(start, end).stream().map(s -> scriptMapper.toDto(s)).toList(),
                        PageRequest.of(page, size),
                        user.getLikedScripts().size()));

    }

}
