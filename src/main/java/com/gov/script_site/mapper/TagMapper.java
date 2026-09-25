package com.gov.script_site.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.gov.script_site.entity.Tag;
import com.gov.script_site.model.TagDTO;

@Mapper(componentModel = "spring")
public abstract class TagMapper {

    public abstract TagDTO toDto(Tag tag);

    @Mapping(target = "scripts", ignore = true)
    public abstract Tag toEntity(TagDTO dto);

}