package com.gov.script_site.service;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.gov.script_site.mapper.ScriptMapper;
import com.gov.script_site.model.ScriptDTO;
import com.gov.script_site.model.ScriptSearchDTO;
import com.gov.script_site.model.TagDTO;
import com.gov.script_site.model.UserDTO;
import com.gov.script_site.repository.ScriptRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ScriptService {
    private ScriptRepository scriptRepository;
    private ScriptMapper scriptMapper;

    public Page<ScriptDTO> getAllScripts(int page, int size, ScriptSearchDTO search) {

        PageRequest req = PageRequest.of(page, size);
        if(search == null || search.isEmpty()) {
            List<ScriptDTO> scripts = scriptRepository.findAll().stream().map(s -> scriptMapper.toDto(s)).toList();
            return  new PageImpl<>(scripts, req, scripts.size());
        }

        System.out.println(search);
        String title = search.getScriptTitle();
        List<UUID> userIds = search.getAuthors().stream().map(UserDTO::getId).toList();
        List<Long> tagIds = search.getTags().stream().map(TagDTO::getId).toList();
        List<ScriptDTO> scripts = scriptRepository.searchScripts(title, userIds, tagIds).stream().map(s -> scriptMapper.toDto(s)).toList();
        return new PageImpl<>(scripts, req, scripts.size());
    }
}
