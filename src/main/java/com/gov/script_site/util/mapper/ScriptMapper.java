package com.gov.script_site.util.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.gov.script_site.entity.Script;
import com.gov.script_site.model.ScriptDTO;

import lombok.AllArgsConstructor;

@Mapper(componentModel = "spring", uses = { UserMapper.class, TagMapper.class, ScriptImageMapper.class })
@AllArgsConstructor
public abstract class ScriptMapper {

    public abstract ScriptDTO toDto(Script script);

    @Mapping(target = "images", ignore = true)
    public abstract Script toEntity(ScriptDTO dto);

}
