package com.gov.script_site.model;

import java.time.Instant;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ScriptDTO {
    private Long id;
    private UserDTO author;
    private List<TagDTO> tags;
    private String title;
    private String content;
    private Instant createDate;
    private Instant modifyDate;
    private Boolean approved;
}
