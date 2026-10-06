package com.gov.script_site.util.mapper;

import java.util.List;

import org.mapstruct.AfterMapping;
import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;

import com.gov.script_site.entity.Script;
import com.gov.script_site.entity.User;
import com.gov.script_site.model.UserDTO;
import com.gov.script_site.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;

@Mapper(componentModel = "spring", injectionStrategy = InjectionStrategy.CONSTRUCTOR)

public abstract class UserMapper {

    @Autowired
    private UserRepository userRepository;

    @Mapping(target = "discordEnabled", ignore = true)
    @Mapping(target = "permissions", ignore = true)
    @Mapping(target = "likedScripts", ignore = true)
    public abstract UserDTO toDto(User user);

    @Mapping(target = "password", ignore = true)
    @Mapping(target = "authorities", ignore = true)
    @Mapping(target = "discordId", ignore = true)
    @Mapping(target = "scripts", ignore = true)
    @Mapping(target = "likedScripts", ignore = true)
    public abstract User toEntity(UserDTO dto);

    @AfterMapping
    protected void afterMapping(User user, @MappingTarget UserDTO userDTO) {
        userDTO.setDiscordEnabled(user.getDiscordId() != null && !user.getDiscordId().isEmpty());
        userDTO.setPermissions(user.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList());

        User userEntity = userRepository.findById(user.getId()).orElseThrow(
                () -> new EntityNotFoundException("Unable to find user with ID: " + user.getId().toString()));

        List<Long> likedScripts = userEntity.getLikedScripts().stream().map(Script::getId).toList();
        userDTO.setLikedScripts(likedScripts);
    }

}
