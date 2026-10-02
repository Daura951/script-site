package com.gov.script_site.util;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import javax.imageio.ImageIO;

import org.jspecify.annotations.Nullable;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.gov.script_site.entity.ScriptImage;
import com.gov.script_site.model.ScriptImageDTO;
import com.gov.script_site.repository.ScriptImageRepository;
import com.gov.script_site.util.mapper.ScriptImageMapper;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ImageUtil {

    @Value("${scripts.images.directory}")
    private String imageDirectory;

    private final ScriptImageRepository scriptImageRepository;
    private final ScriptImageMapper scriptImageMapper;

    public void saveImageToDirectory(BufferedImage image, String imageName, UUID assetId) throws IOException {
        Path imageDir = Paths.get(imageDirectory + assetId);

        if (!Files.exists(imageDir)) {
            Files.createDirectories(imageDir);
        }

        File outFile = imageDir.resolve(imageName).toFile();
        ImageIO.write(image, "png", outFile);
    }

    public ScriptImage persistScriptImage(ScriptImage scriptImage) {
        return scriptImageRepository.save(scriptImage);

    }

    public ScriptImage getScriptImage(Long id) {
        return scriptImageRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Unable to find ScriptImage with ID: " + id));
    }

    public @Nullable ScriptImageDTO toDto(ScriptImage persistScriptImage) {
        return scriptImageMapper.toDto(persistScriptImage);
    }
}
