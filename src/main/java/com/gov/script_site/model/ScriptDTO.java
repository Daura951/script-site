package com.gov.script_site.model;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

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
    private String status;
    private UUID assetId;
    private List<ScriptImageDTO> images;
}
