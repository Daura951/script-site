package com.gov.script_site.service;

import java.awt.image.BufferedImage;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import javax.imageio.ImageIO;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.cos.COSName;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.gov.script_site.entity.Script;
import com.gov.script_site.entity.Tag;
import com.gov.script_site.entity.User;
import com.gov.script_site.mapper.ScriptMapper;
import com.gov.script_site.model.ScriptDTO;
import com.gov.script_site.model.ScriptFileUploadDto;
import com.gov.script_site.model.ScriptSearchDTO;
import com.gov.script_site.model.TagDTO;
import com.gov.script_site.model.UserDTO;
import com.gov.script_site.repository.ScriptRepository;
import com.gov.script_site.repository.TagRepository;
import com.gov.script_site.repository.UserRepository;
import com.gov.script_site.util.MarkdownPdfTextStripper;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ScriptService {
    private ScriptRepository scriptRepository;
    private TagRepository tagRepository;
    private ScriptMapper scriptMapper;
    private UserRepository userRepository;

    private final String IMAGE_UPLOAD_DIR = "src/main/resources/static/images/";

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

    public ResponseEntity<String> uploadScript(ScriptFileUploadDto fileUpload) {

        MultipartFile scriptFile = fileUpload.getScript();

        if (scriptFile.isEmpty()) {
            return ResponseEntity.badRequest().body("The uploaded file is empty.");
        }

        try {
            String fileName = scriptFile.getOriginalFilename();
            StringBuilder contentBuilder = new StringBuilder();

            if (fileName != null && fileName.endsWith(".pdf")) {
                PDDocument document = Loader.loadPDF(scriptFile.getBytes());
                PDFTextStripper stripper = new MarkdownPdfTextStripper();

                Path imagePath = Paths.get(IMAGE_UPLOAD_DIR);

                if (!Files.exists(imagePath)) {
                    Files.createDirectories(imagePath);
                }

                for (int i = 0; i < document.getNumberOfPages(); i++) {
                    int pageNum = i + 1;
                    PDPage page = document.getPage(i);
                    for (COSName name : page.getResources().getXObjectNames()) {
                        if (page.getResources().getXObject(name) instanceof PDImageXObject pdfImage) {
                            BufferedImage image = pdfImage.getImage();
                            String imageName = "script_img" + UUID.randomUUID() + ".png";
                            File outFile = imagePath.resolve(imageName).toFile();
                            ImageIO.write(image, "png", outFile);
                            contentBuilder.append("![Page ").append(pageNum).append(" Image](/images/")
                                    .append(imageName).append(")\n\n");
                        }
                    }
                    stripper.setStartPage(pageNum);
                    stripper.setEndPage(pageNum);
                    contentBuilder.append(stripper.getText(document));
                }

                User testUser = userRepository.findByUsername("user").orElse(null);
                List<Tag> tags = tagRepository.findAllById(fileUpload.getTags());
                Script script = new Script(testUser, fileUpload.getTitle(), contentBuilder.toString());
                script.addTags(tags);
                scriptRepository.save(script);

            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to upload file: " + e.getMessage());
        }
        return new ResponseEntity<>("Success", HttpStatus.CREATED);
    }
}
