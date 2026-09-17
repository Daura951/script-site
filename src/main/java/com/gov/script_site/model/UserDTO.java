package com.gov.script_site.model;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserDTO {
    private String userId;
    private String username;
    private String email;

}
