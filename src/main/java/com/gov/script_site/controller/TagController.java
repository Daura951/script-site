package com.gov.script_site.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gov.script_site.model.TagDTO;
import com.gov.script_site.service.TagService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/tags")
@AllArgsConstructor
public class TagController {

    private TagService tagService;

    @GetMapping
    public ResponseEntity<List<TagDTO>> getTagsWithName(@RequestParam String filter) {
        return tagService.getTagsWithName(filter);
    }

}
