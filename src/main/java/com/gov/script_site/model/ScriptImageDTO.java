package com.gov.script_site.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ScriptImageDTO {
    private Long id;
    private Long scriptOrder;
    private Long scriptId;
    private String name;
    private Integer cropX, cropY, cropPositionX, cropPositionY, cropWidth, cropHeight, zoom;
}
