package com.gov.script_site.config;

import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.core.AuthorizationGrantType;

import lombok.Data;

@Configuration
@ConfigurationProperties(prefix = "oauth2.discord")
@Data
public class OAuthConfig {
    private String clientName;
    private String authorizationUri;
    private String tokenUri;
    private String jwkSetUri;
    private String userInfoUri;
    private String clientId;
    private String clientSecret;
    private List<String> scope;
    private String redirectUri;
    private String usernameAttribute;

}
