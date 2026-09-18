package com.gov.script_site.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.InMemoryOAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.registration.InMemoryClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizedClientRepository;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.web.cors.CorsConfiguration;

import com.gov.script_site.service.GovUserDetailsService;

import lombok.AllArgsConstructor;

@Configuration
@EnableWebSecurity
@AllArgsConstructor
public class SecurityConfig {

    private GovUserDetailsService userDetailsService;
    private OAuthConfig oauthConfig;
    private OAuthSuccessHandler oAuthSuccessHandler;

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http, OAuth2AuthorizedClientService authorizedClientService,
            ClientRegistrationRepository clientRegistrationRepository) throws Exception {
        http.authorizeHttpRequests(a -> a.anyRequest().permitAll());
        http.csrf(csrf -> csrf.disable());
        http.cors(cors -> cors.configurationSource(request -> {
            CorsConfiguration config = new CorsConfiguration();
            config.setAllowedOriginPatterns(List.of("*"));
            config.setAllowedMethods(List.of("*"));
            config.setAllowCredentials(true);
            return config;
        }));
        http.headers(headers -> headers.frameOptions(frame -> frame.disable()));
        http.formLogin(l -> l.successHandler(new SavedRequestAwareAuthenticationSuccessHandler()));
        http.logout(l -> l.logoutSuccessUrl("/").invalidateHttpSession(true).deleteCookies("JSESSIONID").permitAll());
        http.oauth2Login(oauth -> oauth.loginPage("/login").authorizedClientService(authorizedClientService)
                .authorizationEndpoint(auth -> auth
                        .authorizationRequestResolver(new Oauth2AuthorizationResolver(clientRegistrationRepository)))
                .clientRegistrationRepository(clientRegistrationRepository).successHandler(oAuthSuccessHandler));
        return http.build();
    }

    @Bean
    AuthenticationManager authenticationManager(PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider daoProvider = new DaoAuthenticationProvider(userDetailsService);
        daoProvider.setPasswordEncoder(passwordEncoder);
        return new ProviderManager(daoProvider);
    }

    @Bean
    BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    OAuth2AuthorizedClientService auth2AuthorizedClientService(
            ClientRegistrationRepository clientRegistrationRepository) {
        return new InMemoryOAuth2AuthorizedClientService(clientRegistrationRepository);
    }

    @Bean
    ClientRegistrationRepository clientRegistrationRepository() {
        ClientRegistration registration = ClientRegistration.withRegistrationId(oauthConfig.getClientName())
                .clientId(oauthConfig.getClientId()).clientSecret(oauthConfig.getClientSecret())
                .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                .authorizationUri(oauthConfig.getAuthorizationUri()).tokenUri(oauthConfig.getTokenUri())
                .userInfoUri(oauthConfig.getUserInfoUri()).redirectUri(oauthConfig.getRedirectUri())
                .scope(oauthConfig.getScope()).userNameAttributeName(oauthConfig.getUsernameAttribute()).build();
        return new InMemoryClientRegistrationRepository(registration);
    }

}
