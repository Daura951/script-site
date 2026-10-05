package com.gov.script_site.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ScriptPatchDTO {
    private String title;
    private String content;
    private List<Long> tags;
    private List<ScriptImageDTO> scriptImages;
}
