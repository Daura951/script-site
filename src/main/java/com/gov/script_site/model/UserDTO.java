package com.gov.script_site.model;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserDTO {
    private String id;
    private String username;
    private String email;
    private Boolean discordEnabled;

}
