package com.gov.script_site.service;

import java.awt.image.BufferedImage;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import javax.imageio.ImageIO;

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
import com.gov.script_site.model.ScriptFileUploadDto;
import com.gov.script_site.model.ScriptImageDTO;
import com.gov.script_site.model.ScriptPatchDTO;
import com.gov.script_site.model.ScriptSearchDTO;
import com.gov.script_site.model.TagDTO;
import com.gov.script_site.model.UserDTO;
import com.gov.script_site.repository.ScriptRepository;
import com.gov.script_site.repository.TagRepository;
import com.gov.script_site.repository.UserRepository;
import com.gov.script_site.util.ImageUtil;
import com.gov.script_site.util.files.FileScriptParser;
import com.gov.script_site.util.mapper.ScriptMapper;

import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ScriptService {

    private final ImageUtil imageUtil;
    private final ScriptRepository scriptRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;
    private final ScriptMapper scriptMapper;
    private Map<String, FileScriptParser> parserMap;

    public ScriptService(ScriptRepository scriptRepository, UserRepository userRepository, TagRepository tagRepository,
            ScriptMapper scriptMapper, List<FileScriptParser> parsers, ImageUtil imageUtil) {
        this.userRepository = userRepository;
        this.scriptRepository = scriptRepository;
        this.tagRepository = tagRepository;
        this.scriptMapper = scriptMapper;
        this.parserMap = new HashMap<>();

        for (FileScriptParser p : parsers) {
            parserMap.put(p.getFileType(), p);
        }
        this.imageUtil = imageUtil;

    }

    public Page<ScriptDTO> findScripts(int page, int size, ScriptSearchDTO search) {

        PageRequest req = PageRequest.of(page, size);
        if (search == null || search.isEmpty()) {
            List<ScriptDTO> scripts = scriptRepository.findAll().stream().map(s -> scriptMapper.toDto(s)).toList();
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
        Optional<Script> scriptOpt = scriptRepository.findById(id);

        if (scriptOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(scriptMapper.toDto(scriptOpt.get()));
    }

    @Transactional
    public ResponseEntity<String> uploadScript(User user, ScriptFileUploadDto fileUpload) {

        MultipartFile scriptFile = fileUpload.getScript();
        Script script = new Script();
        User userEntity = userRepository.findById(user.getId()).orElseThrow(
                () -> new EntityNotFoundException("Unable to find user with ID: " + user.getId().toString()));

        if (scriptFile == null || scriptFile.isEmpty()) {
            return ResponseEntity.badRequest().body("No file was submitted for script upload");
        }

        try {
            FileScriptParser parser = parserMap.get(scriptFile.getContentType());
            if (parser == null) {
                return ResponseEntity.badRequest().body(
                        "File type of " + scriptFile.getContentType().replace("application/", "") + "is unsupported");
            }
            script = parser.parseFile(fileUpload);
            script.setStatus(ScriptStatus.DRAFT);
            script.setTitle(fileUpload.getTitle());
            script.setAuthor(userEntity);
            if (fileUpload.getTags() != null) {
                List<Tag> tags = tagRepository.findAllById(fileUpload.getTags());
                script.addTags(tags);
            }

            System.out.println(script.getTitle());
            script = scriptRepository.save(script);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to upload file: " + e.getMessage());
        }
        return new ResponseEntity<>("" + script.getId(), HttpStatus.CREATED);
    }

    public ResponseEntity<ScriptImageDTO> uploadImage(Long id, MultipartFile upload) {
        Optional<Script> scriptOpt = scriptRepository.findById(id);
        if (scriptOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        try {
            Script script = scriptOpt.get();
            BufferedImage image = ImageIO.read(upload.getInputStream());

            log.info("Submitting new Image");
            long order = script.getImages().size() + 1;
            String imageName = "script_img_" + order + ".png";
            imageUtil.saveImageToDirectory(image, imageName, script.getAssetId());
            return new ResponseEntity<ScriptImageDTO>(
                    imageUtil.toDto(imageUtil
                            .persistScriptImage(
                                    new ScriptImage(order, script, imageName))),
                    HttpStatus.CREATED);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    public ResponseEntity<Void> deleteImage(Long imageId) {
        imageUtil.removeScriptImage(imageId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    public ResponseEntity<ScriptDTO> patchScript(Long id, ScriptPatchDTO patchDTO) {
        Optional<Script> scriptOpt = scriptRepository.findById(id);

        if (scriptOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Script script = scriptOpt.get();
        script.setTitle(patchDTO.getTitle());
        script.setContent(patchDTO.getContent());

        List<Tag> newIds = tagRepository
                .findAllById(script.getTags().stream().filter(t -> !patchDTO.getTags().contains(t.getId()))
                        .map(Tag::getId).toList());
        script.addTags(newIds);

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

        script.setStatus(ScriptStatus.AWAITING_REVIEW);
        script = scriptRepository.save(script);
        return ResponseEntity.ok(scriptMapper.toDto(script));
    }

}
