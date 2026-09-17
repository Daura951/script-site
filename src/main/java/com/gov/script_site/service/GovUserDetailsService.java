package com.gov.script_site.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.gov.script_site.repository.UserRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class GovUserDetailsService implements UserDetailsService {
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> UsernameNotFoundException.fromUsername(username));
    }
}
