package com.gov.script_site.service;

import com.gov.script_site.repository.ScriptImageRepository;
import java.awt.image.BufferedImage;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import javax.imageio.ImageIO;

import org.springframework.beans.factory.annotation.Value;
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
import com.gov.script_site.model.ScriptSearchDTO;
import com.gov.script_site.model.TagDTO;
import com.gov.script_site.model.UserDTO;
import com.gov.script_site.repository.ScriptRepository;
import com.gov.script_site.repository.TagRepository;
import com.gov.script_site.repository.UserRepository;
import com.gov.script_site.util.files.FileScriptParser;
import com.gov.script_site.util.mapper.ScriptImageMapper;
import com.gov.script_site.util.mapper.ScriptMapper;

import jakarta.persistence.EntityNotFoundException;

@Service

public class ScriptService {

    @Value("${scripts.images.directory}")
    private String imagePath;

    private final ScriptRepository scriptRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;
    private final ScriptMapper scriptMapper;
    private final ScriptImageMapper scriptImageMapper;
    private final ScriptImageRepository scriptImageRepository;
    private Map<String, FileScriptParser> parserMap;

    public ScriptService(ScriptRepository scriptRepository, UserRepository userRepository, TagRepository tagRepository,
            ScriptMapper scriptMapper, List<FileScriptParser> parsers, ScriptImageRepository scriptImageRepository,
            ScriptImageMapper scriptImageMapper) {
        this.userRepository = userRepository;
        this.scriptRepository = scriptRepository;
        this.tagRepository = tagRepository;
        this.scriptMapper = scriptMapper;
        this.scriptImageRepository = scriptImageRepository;
        this.scriptImageMapper = scriptImageMapper;
        this.parserMap = new HashMap<>();

        for (FileScriptParser p : parsers) {
            parserMap.put(p.getFileType(), p);
        }

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

        List<ScriptDTO> scripts = scriptRepository
                .searchScripts(title, userIds, tagIds, createDate, createSort, modDate, modSort)
                .stream()
                .map(s -> scriptMapper.toDto(s))
                .toList();
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

    public ResponseEntity<ScriptImageDTO> uploadImage(Long id, MultipartFile imageFile) {
        Optional<Script> scriptOpt = scriptRepository.findById(id);

        if (scriptOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        try {
            Script script = scriptOpt.get();
            BufferedImage image = ImageIO.read(imageFile.getInputStream());

            Path imageDir = Paths.get(imagePath + script.getAssetId());

            if (!Files.exists(imageDir)) {
                Files.createDirectories(imageDir);
            }
            long order = script.getImages().size() + 1;

            String imageName = "script_img_" + order + ".png";
            File outFile = imageDir.resolve(imageName).toFile();

            ImageIO.write(image, "png", outFile);
            ScriptImage newImage = new ScriptImage(order, script, imageName);

            newImage = scriptImageRepository.save(newImage);
            return new ResponseEntity<ScriptImageDTO>(scriptImageMapper.toDto(newImage), HttpStatus.CREATED);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

}
