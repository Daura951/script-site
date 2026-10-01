package com.gov.script_site.controller;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.gov.script_site.entity.User;
import com.gov.script_site.model.ScriptDTO;
import com.gov.script_site.model.ScriptFileUploadDto;
import com.gov.script_site.model.ScriptImageDTO;
import com.gov.script_site.model.ScriptSearchDTO;
import com.gov.script_site.service.ScriptService;

@RestController
@RequestMapping("/api/scripts")
public class ScriptController {

    private final ScriptService scriptService;

    ScriptController(ScriptService scriptService) {
        this.scriptService = scriptService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ScriptDTO> findScriptById(@PathVariable Long id) {
        return scriptService.findScriptById(id);
    }

    @PostMapping("/{id}/images")
    public ResponseEntity<ScriptImageDTO> uploadImage(@PathVariable Long id, @RequestBody MultipartFile image) {
        return scriptService.uploadImage(id, image);
    }

    @PostMapping
    public Page<ScriptDTO> findScripts(@RequestBody(required = false) ScriptSearchDTO search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return scriptService.findScripts(page, size, search);
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadScript(@AuthenticationPrincipal User user,
            @ModelAttribute ScriptFileUploadDto fileUpload) {
        return scriptService.uploadScript(user, fileUpload);
    }

}
