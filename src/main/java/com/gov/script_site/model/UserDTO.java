package com.gov.script_site.model;

import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserDTO {
    private String id;
    private String username;
    private String email;
    private Boolean discordEnabled;
    private List<String> permissions;

}
