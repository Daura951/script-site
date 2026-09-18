package com.gov.script_site.mapper;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.gov.script_site.entity.User;
import com.gov.script_site.model.UserDTO;

@Mapper(componentModel = "spring")
public abstract class UserMapper {

    @Mapping(target = "discordEnabled", ignore = true)
    public abstract UserDTO UserToUserDto(User user);

    @Mapping(target = "password", ignore = true)
    @Mapping(target = "authorities", ignore = true)
    @Mapping(target = "discordId", ignore = true)
    public abstract User UserDtoToUser(UserDTO dto);

    @AfterMapping
    protected void applyDiscordEnabled(User user, @MappingTarget UserDTO userDTO) {
        userDTO.setDiscordEnabled(user.getDiscordId() != null && !user.getDiscordId().isEmpty());
    }

}
