package com.gov.script_site.controller;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.gov.script_site.entity.User;
import com.gov.script_site.model.ScriptDTO;
import com.gov.script_site.model.ScriptCreateDTO;
import com.gov.script_site.model.ScriptImageDTO;
import com.gov.script_site.model.ScriptPatchDTO;
import com.gov.script_site.model.ScriptSearchDTO;
import com.gov.script_site.service.ScriptImageService;
import com.gov.script_site.service.ScriptService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/scripts")
@AllArgsConstructor
public class ScriptController {

    private ScriptService scriptService;
    private ScriptImageService scriptImageService;

    @GetMapping("/{id}")
    public ResponseEntity<ScriptDTO> findScriptById(@PathVariable Long id) {
        return scriptService.findScriptById(id);
    }

    @PostMapping("/{id}/images")
    public ResponseEntity<ScriptImageDTO> uploadImage(@PathVariable Long id,
            @RequestParam("imageFile") MultipartFile upload) {
        return scriptImageService.uploadImage(scriptService.getScript(id), upload);
    }

    @PostMapping
    public Page<ScriptDTO> findScripts(@RequestBody(required = false) ScriptSearchDTO search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return scriptService.findScripts(page, size, search);
    }

    @PostMapping("/new")
    public ResponseEntity<String> createScript(@AuthenticationPrincipal User user,
            @ModelAttribute ScriptCreateDTO fileUpload) {
        return scriptService.createScript(user, fileUpload);
    }

    @GetMapping("/{id}/favorite")
    public ResponseEntity<Void> likeScript(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return scriptService.likeScript(id, user);
    }

    @DeleteMapping("/images/{imageId}")
    public ResponseEntity<Void> deleteImage(@PathVariable Long imageId) {
        return scriptImageService.deleteImage(imageId);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ScriptDTO> updateScript(@PathVariable Long id, @RequestBody ScriptPatchDTO patchDTO) {
        return scriptService.patchScript(id, patchDTO);
    }

}
