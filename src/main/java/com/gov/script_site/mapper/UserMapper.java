package com.gov.script_site.mapper;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.security.core.GrantedAuthority;

import com.gov.script_site.entity.User;
import com.gov.script_site.model.UserDTO;

@Mapper(componentModel = "spring")
public abstract class UserMapper {

    @Mapping(target = "discordEnabled", ignore = true)
    @Mapping(target = "permissions", ignore = true)
    public abstract UserDTO toDto(User user);

    @Mapping(target = "password", ignore = true)
    @Mapping(target = "authorities", ignore = true)
    @Mapping(target = "discordId", ignore = true)
    @Mapping(target = "scripts", ignore = true)
    public abstract User toEntity(UserDTO dto);

    @AfterMapping
    protected void applyDiscordEnabled(User user, @MappingTarget UserDTO userDTO) {
        userDTO.setDiscordEnabled(user.getDiscordId() != null && !user.getDiscordId().isEmpty());
        userDTO.setPermissions(user.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList());
    }

}
