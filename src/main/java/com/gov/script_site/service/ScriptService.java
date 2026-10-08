package com.gov.script_site.service;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.gov.script_site.entity.Script;
import com.gov.script_site.entity.Script.ScriptStatus;
import com.gov.script_site.entity.ScriptImage;
import com.gov.script_site.entity.Tag;
import com.gov.script_site.entity.User;
import com.gov.script_site.model.ScriptDTO;
import com.gov.script_site.model.ScriptCreateDTO;
import com.gov.script_site.model.ScriptImageDTO;
import com.gov.script_site.model.ScriptPatchDTO;
import com.gov.script_site.model.ScriptSearchDTO;
import com.gov.script_site.model.TagDTO;
import com.gov.script_site.model.UserDTO;
import com.gov.script_site.repository.ScriptRepository;
import com.gov.script_site.repository.TagRepository;
import com.gov.script_site.repository.UserRepository;
import com.gov.script_site.util.files.FileScriptParser;
import com.gov.script_site.util.mapper.ScriptMapper;

import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ScriptService {

    private final ScriptRepository scriptRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;
    private final ScriptMapper scriptMapper;
    private Map<String, FileScriptParser> parserMap;

    public ScriptService(ScriptRepository scriptRepository, UserRepository userRepository, TagRepository tagRepository,
            ScriptMapper scriptMapper, List<FileScriptParser> parsers) {
        this.userRepository = userRepository;
        this.scriptRepository = scriptRepository;
        this.tagRepository = tagRepository;
        this.scriptMapper = scriptMapper;
        this.parserMap = new HashMap<>();

        for (FileScriptParser p : parsers) {
            parserMap.put(p.getFileType(), p);
        }

    }

    public Page<ScriptDTO> findScripts(int page, int size, ScriptSearchDTO search) {

        PageRequest req = PageRequest.of(page, size);
        if (search == null || search.isEmpty()) {
            List<ScriptDTO> scripts = scriptRepository.findAll().stream()
                    .filter(s -> s.getStatus() == ScriptStatus.APPROVED)
                    .map(s -> scriptMapper.toDto(s)).toList();
            return new PageImpl<>(scripts, req, scripts.size());
        }
        String title = search.getScriptTitle();
        List<UUID> userIds = search.getAuthors().stream().map(UserDTO::getId).toList();
        List<Long> tagIds = search.getTags().stream().map(TagDTO::getId).toList();

        userIds = userIds.size() == 0 ? null : userIds;
        tagIds = tagIds.size() == 0 ? null : tagIds;

        Instant createDate = search.getCreateDate() == null ? null : search.getCreateDate().getDate();
        String createSort = search.getCreateDate() == null ? null : search.getCreateDate().getSort();

        Instant modDate = search.getCreateDate() == null ? null : search.getCreateDate().getDate();
        String modSort = search.getCreateDate() == null ? null : search.getCreateDate().getSort();

        log.debug("Searching with following params: {}" + search.toString());

        List<ScriptDTO> scripts = scriptRepository
                .searchScripts(title, userIds, tagIds, createDate, createSort, modDate, modSort)
                .stream()
                .map(s -> scriptMapper.toDto(s))
                .toList();
        log.info("Found {} scripts", scripts.size());
        return new PageImpl<>(scripts, req, scripts.size());
    }

    public ResponseEntity<ScriptDTO> findScriptById(Long id) {
        Script script = getScript(id);
        return ResponseEntity.ok(scriptMapper.toDto(script));
    }

    @Transactional
    public ResponseEntity<String> createScript(User user, ScriptCreateDTO createDTO) {
        User userEntity = userRepository.findById(user.getId()).orElseThrow(
                () -> new EntityNotFoundException("Unable to find user with ID: " + user.getId().toString()));

        Script script = new Script();
        script.setStatus(ScriptStatus.DRAFT);
        script.setAuthor(userEntity);
        script.setAssetId(UUID.randomUUID());
        script.setTitle(createDTO.getTitle());

        if (createDTO.getTags() != null) {
            List<Tag> tags = tagRepository.findAllById(createDTO.getTags());
            script.addTags(tags);
        }

        MultipartFile scriptFile = createDTO.getScript();
        if (scriptFile != null && !scriptFile.isEmpty()) {

            try {
                FileScriptParser parser = parserMap.get(scriptFile.getContentType());
                if (parser == null) {
                    return ResponseEntity.badRequest().body(
                            "File type of " + scriptFile.getContentType().replace("application/", "")
                                    + "is unsupported");
                }
                parser.parseFile(createDTO, script);

            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.internalServerError().body("Failed to upload file: " + e.getMessage());
            }
        }
        script = scriptRepository.save(script);
        return new ResponseEntity<>("" + script.getId(), HttpStatus.CREATED);
    }

    public ResponseEntity<ScriptDTO> patchScript(Long id, ScriptPatchDTO patchDTO) {

        Script script = getScript(id);
        script.setTitle(patchDTO.getTitle());
        script.setContent(patchDTO.getContent());

        List<Long> scriptTags = script.getTags().stream().map(Tag::getId).toList();
        List<Tag> newTags = tagRepository
                .findAllById(patchDTO.getTags().stream().filter(t -> !scriptTags.contains(t))
                        .toList());
        script.addTags(newTags);

        for (ScriptImageDTO dto : patchDTO.getScriptImages()) {
            ScriptImage img = script.getImages().stream().filter(i -> i.getId() == dto.getId()).findFirst()
                    .orElse(null);

            if (img != null) {
                img.setCropPositionX(dto.getCropPositionX());
                img.setCropPositionY(dto.getCropPositionY());
                img.setCropWidth(dto.getCropWidth());
                img.setCropHeight(dto.getCropHeight());
                img.setZoom(dto.getZoom());
                img.setCropX(dto.getCropX());
                img.setCropY(dto.getCropY());
            }
        }

        script.setStatus(ScriptStatus.PENDING_APPROVAL);
        script = scriptRepository.save(script);
        return ResponseEntity.ok(scriptMapper.toDto(script));
    }

    public ResponseEntity<Void> likeScript(Long id, User user) {

        User userEntity = userRepository.findById(user.getId()).orElseThrow(
                () -> new EntityNotFoundException("Unable to find user with ID: " + user.getId().toString()));

        Script script = getScript(id);

        if (userEntity.getLikedScripts().contains(script)) {
            log.info("User {} unliked script {}", user.getUsername(), id);
            userEntity.getLikedScripts().remove(script);
        } else {
            log.info("User {} liked script {}", user.getUsername(), id);
            userEntity.getLikedScripts().add(script);
        }
        userRepository.save(userEntity);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    public Script getScript(Long scriptId) throws EntityNotFoundException {
        return scriptRepository.findById(scriptId)
                .orElseThrow(() -> new EntityNotFoundException("Unable to find script with ID: " + scriptId));
    }

}
