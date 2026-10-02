package com.gov.script_site.model;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ScriptImageFileUploadDTO {
    private Long imageId;
    private MultipartFile imageFile;
}
