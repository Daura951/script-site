package com.gov.script_site.service;

import javax.imageio.ImageIO;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.gov.script_site.entity.Script;
import com.gov.script_site.entity.ScriptImage;
import com.gov.script_site.model.ScriptImageDTO;
import com.gov.script_site.repository.ScriptImageRepository;
import com.gov.script_site.util.ImageUtil;
import com.gov.script_site.util.mapper.ScriptImageMapper;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import java.awt.image.BufferedImage;

@AllArgsConstructor
@Service
@Slf4j
public class ScriptImageService {

    private ScriptImageRepository scriptImageRepository;
    private ImageUtil imageUtil;
    private final ScriptImageMapper scriptImageMapper;

    public ResponseEntity<ScriptImageDTO> uploadImage(Script script, MultipartFile upload) {
        try {

            BufferedImage image = ImageIO.read(upload.getInputStream());

            log.info("Submitting new Image");
            long order = script.getImages().size() + 1;
            String imageName = "script_img_" + order + ".png";
            imageUtil.saveImageToDirectory(image, imageName, script.getAssetId());
            ScriptImage imageEntity = scriptImageRepository.save(new ScriptImage(order, script, imageName));
            return new ResponseEntity<ScriptImageDTO>(
                    scriptImageMapper.toDto(imageEntity),
                    HttpStatus.CREATED);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    public ResponseEntity<Void> deleteImage(Long imageId) {
        ScriptImage image = scriptImageRepository.findById(imageId)
                .orElseThrow(() -> new EntityNotFoundException("Unable to find Script Image with ID: " + imageId));
        imageUtil.removeScriptImage(image.getScript().getAssetId() + "/" + image.getName());
        scriptImageRepository.deleteById(imageId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
