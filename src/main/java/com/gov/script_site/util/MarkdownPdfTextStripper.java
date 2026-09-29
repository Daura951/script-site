package com.gov.script_site.util;

import java.io.IOException;
import java.util.List;

import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.pdfbox.text.TextPosition;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class MarkdownPdfTextStripper extends PDFTextStripper {
    @Override
    protected void writeString(String text, List<TextPosition> textPositions) throws IOException {
        if (textPositions == null || textPositions.isEmpty()) {
            super.writeString(text);
            return;
        }

        StringBuilder markdownBuilder = new StringBuilder();
        boolean isBoldActive = false;
        boolean isItalicActive = false;

        for (TextPosition tp : textPositions) {
            String font = tp.getFont().getName().toLowerCase();
            boolean isBold = font.contains("bold");
            boolean isItalic = font.contains("italic") || font.contains("oblique");

            if (isBold && !isBoldActive) {
                markdownBuilder.append("**");
                isBoldActive = true;
            } else if (!isBold && isBoldActive) {
                markdownBuilder.append("**");
                isBoldActive = false;
            }

            if (isItalic && !isItalicActive) {
                markdownBuilder.append("*");
                isItalicActive = true;
            } else if (!isItalic && isItalicActive) {
                markdownBuilder.append("*");
                isItalicActive = false;
            }
            markdownBuilder.append(tp.getUnicode());
        }

        if (isBoldActive) {
            markdownBuilder.append("**");
        }

        if (isItalicActive) {
            markdownBuilder.append("*");
        }

        super.writeString(markdownBuilder.toString() + "\n");
    }

}
