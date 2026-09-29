package com.gov.script_site.model;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ScriptFileUploadDto {
    private String title;
    private MultipartFile script;
    private List<Long> tags;
}
