package com.gov.script_site.mapper;

import org.mapstruct.Mapper;

import com.gov.script_site.entity.Script;
import com.gov.script_site.model.ScriptDTO;

import lombok.AllArgsConstructor;

@Mapper(componentModel = "spring", uses = { UserMapper.class, TagMapper.class })
@AllArgsConstructor
public abstract class ScriptMapper {

    public abstract ScriptDTO scriptToDto(Script script);

    public abstract Script dtoToScript(ScriptDTO dto);

}
