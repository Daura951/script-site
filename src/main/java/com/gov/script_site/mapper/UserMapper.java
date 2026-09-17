package com.gov.script_site.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.gov.script_site.entity.User;
import com.gov.script_site.model.UserDTO;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDTO UserToUserDto(User user);

    @Mapping(target = "password", ignore = true)
    User UserDtoToUser(UserDTO dto);

}
