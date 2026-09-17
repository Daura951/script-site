package com.gov.script_site.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SignupDTO {
    private String username;
    private String email;
    private String password;
}
