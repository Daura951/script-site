package com.gov.script_site.util.mapper;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.gov.script_site.entity.ScriptImage;
import com.gov.script_site.model.ScriptImageDTO;

@Mapper(componentModel = "spring")
public abstract class ScriptImageMapper {

    @Mapping(target = "scriptId", ignore = true)
    public abstract ScriptImageDTO toDto(ScriptImage scriptImage);

    @Mapping(target = "script", ignore = true)
    public abstract ScriptImage toEntity(ScriptImageDTO dto);

    @AfterMapping
    protected void afterMapping(ScriptImage scriptImage, @MappingTarget ScriptImageDTO dto) {
        dto.setScriptId(scriptImage.getScript().getId());
    }

}
