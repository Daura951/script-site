package com.gov.script_site.util.files;

import java.awt.image.BufferedImage;
import java.util.UUID;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.cos.COSName;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.gov.script_site.entity.Script;
import com.gov.script_site.entity.ScriptImage;
import com.gov.script_site.model.ScriptFileUploadDto;
import com.gov.script_site.util.ImageUtil;
import com.gov.script_site.util.MarkdownPdfTextStripper;

@Component
public class PdfFileScriptParser extends FileScriptParser {

    private final ImageUtil imageUtil;

    public PdfFileScriptParser(ImageUtil imageUtil) {
        super("application/pdf");
        this.imageUtil = imageUtil;
    }

    @Override
    public Script parseFile(ScriptFileUploadDto fileUpload) throws Exception {

        Script script = new Script();
        MultipartFile file = fileUpload.getScript();

        StringBuilder contentBuilder = new StringBuilder();
        PDDocument document = Loader.loadPDF(file.getBytes());
        MarkdownPdfTextStripper markdownPdfTextStripper = new MarkdownPdfTextStripper();

        for (int i = 0; i < document.getNumberOfPages(); i++) {
            PDPage page = document.getPage(i);
            int pageNum = i + 1;

            UUID assetId = UUID.randomUUID();

            Long imageTracker = 1L;
            for (COSName resourceName : page.getResources().getXObjectNames()) {
                if (page.getResources().getXObject(resourceName) instanceof PDImageXObject pdfImage) {
                    BufferedImage image = pdfImage.getImage();

                    String imageName = "script_img_" + imageTracker + ".png";
                    imageUtil.saveImageToDirectory(image, imageName, assetId);

                    contentBuilder.append("{img_")
                            .append(imageTracker)
                            .append("}\n\n");
                    script.addImage(new ScriptImage(imageTracker, script, imageName));
                    imageTracker++;
                }
            }

            markdownPdfTextStripper.setStartPage(pageNum);
            markdownPdfTextStripper.setEndPage(pageNum);
            contentBuilder.append(markdownPdfTextStripper.getText(document));
            script.setContent(contentBuilder.toString());
            script.setAssetId(assetId);
        }
        return script;
    }

}
