package com.gov.script_site.service;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.gov.script_site.entity.Tag;
import com.gov.script_site.model.TagDTO;
import com.gov.script_site.repository.TagRepository;
import com.gov.script_site.util.mapper.TagMapper;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class TagService {

    private TagRepository tagRepository;
    private TagMapper tagMapper;

    public ResponseEntity<List<TagDTO>> getTagsWithName(String filter) {
        List<Tag> tags = tagRepository.findByTagStartingWithIgnoreCase(filter);
        if (tags.size() == 0) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(tags.stream().map(t -> tagMapper.toDto(t)).toList());
    }

}
