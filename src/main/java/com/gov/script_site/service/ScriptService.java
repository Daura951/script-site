package com.gov.script_site.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.gov.script_site.mapper.ScriptMapper;
import com.gov.script_site.model.ScriptDTO;
import com.gov.script_site.repository.ScriptRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ScriptService {
    private ScriptRepository scriptRepository;
    private ScriptMapper scriptMapper;

    public Page<ScriptDTO> getAllScripts(Pageable pageable) {
        List<ScriptDTO> scripts = scriptRepository.findAll(pageable).getContent().stream()
                .map(s -> scriptMapper.toDto(s)).toList();

        return new PageImpl<>(scripts, pageable, scriptRepository.count());
    }
}
