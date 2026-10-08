package com.gov.script_site.util;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import javax.imageio.ImageIO;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ImageUtil {

    @Value("${scripts.images.directory}")
    private String imageDirectory;

    public void saveImageToDirectory(BufferedImage image, String imageName, UUID assetId) throws IOException {
        Path imageDir = Paths.get(imageDirectory + assetId);

        if (!Files.exists(imageDir)) {
            Files.createDirectories(imageDir);
        }

        File outFile = imageDir.resolve(imageName).toFile();
        ImageIO.write(image, "png", outFile);
    }

    public void removeScriptImage(String imageFile) {

        File file = new File(imageDirectory + imageFile);
        file.delete();
    }
}
