package com.gov.script_site.model;

import java.time.Instant;

import com.gov.script_site.entity.Tag.TagType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class TagDTO {
    private Long id;
    private String tag;
    private Instant createDate;
    private TagType type;
}
