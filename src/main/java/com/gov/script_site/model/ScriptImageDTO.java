package com.gov.script_site.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ScriptImageDTO {
    private Long id;
    private Long scriptId;
    private String path;
}
