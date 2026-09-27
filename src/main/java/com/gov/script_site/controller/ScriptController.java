package com.gov.script_site.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gov.script_site.model.ScriptDTO;
import com.gov.script_site.model.ScriptSearchDTO;
import com.gov.script_site.service.ScriptService;

@RestController
@RequestMapping("/api/scripts")
public class ScriptController {

    private final ScriptService scriptService;

    ScriptController(ScriptService scriptService) {
        this.scriptService = scriptService;
    }

    @PostMapping  
    public Page<ScriptDTO> getAllScripts(@RequestBody(required = false) ScriptSearchDTO search, @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
                return scriptService.getAllScripts(page, size, search);
    }
}
