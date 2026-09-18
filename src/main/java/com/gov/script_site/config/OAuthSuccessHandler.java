package com.gov.script_site.config;

import java.io.IOException;
import java.util.Optional;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.gov.script_site.entity.User;
import com.gov.script_site.repository.UserRepository;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;

@Component
@AllArgsConstructor
public class OAuthSuccessHandler implements AuthenticationSuccessHandler {

    private UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {
        OAuth2User user = (OAuth2User) authentication.getPrincipal();
        String username = user.getAttribute("username");
        String id = user.getAttribute("id");
        String email = user.getAttribute("email");

        HttpSession session = request.getSession(false);
        String origin = (session != null) ? (String) session.getAttribute("oauth_origin") : "signup";

        if ("login".equalsIgnoreCase(origin)) {
            handleLogin(id, authentication);
            response.sendRedirect("/");
        } else {
            response.sendRedirect(String.format("/signup?username=%s&email=%s&id=%s", username, email, id));
        }

    }

    private void handleLogin(String id, Authentication authentication) {
        Optional<User> userOpt = userRepository.findByDiscordId(id);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            Authentication newAuth = new UsernamePasswordAuthenticationToken(user,
                    authentication.getCredentials(), user.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(newAuth);
        } else
            throw new UsernameNotFoundException("Discord ID does not exist");
    }

}
