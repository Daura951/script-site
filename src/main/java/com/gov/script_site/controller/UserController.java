package com.gov.script_site.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gov.script_site.entity.User;
import com.gov.script_site.model.SignupDTO;
import com.gov.script_site.model.UserDTO;
import com.gov.script_site.service.UserService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserController {

    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<UserDTO> createUser(@RequestBody SignupDTO signup) {
        return userService.createUser(signup);
    }

    @GetMapping()
    public ResponseEntity<UserDTO> getAuthenticatedUser(@AuthenticationPrincipal User user) {
        return userService.getAuthenticatedUser(user);
    }

}
