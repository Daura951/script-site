package com.gov.script_site.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import jakarta.servlet.http.HttpServletRequest;

@Controller
public class FrontendForwardingController {

    @GetMapping("/**/{path:[^\\.]*}")
    public String forwardToFrontend(HttpServletRequest request) {
        String uri = request.getRequestURI();

        if (uri.startsWith("/api") || uri.startsWith("/index.html") || uri.startsWith("/h2-console")
                || uri.startsWith("/login")) {
            return null;
        }

        return "forward:/index.html";
    }

}
