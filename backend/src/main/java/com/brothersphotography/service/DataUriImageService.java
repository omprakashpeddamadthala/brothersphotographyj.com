package com.brothersphotography.service;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.Base64;

/**
 * Converts legacy image data URLs stored in the database into normal HTTP image
 * responses. List APIs can then return compact URLs rather than embedding the
 * complete image binary in JSON.
 */
@Service
public class DataUriImageService {

    private static final int DEFAULT_MAX_WIDTH = 1600;
    private static final int MAX_ALLOWED_WIDTH = 2400;

    public boolean isImageDataUrl(String value) {
        return value != null && value.startsWith("data:image/") && value.contains(";base64,");
    }

    public ProcessedImage forWeb(String dataUrl, Integer requestedWidth) {
        if (!isImageDataUrl(dataUrl)) {
            throw new IllegalArgumentException("Image is not a supported data URL");
        }

        int separator = dataUrl.indexOf(',');
        String header = dataUrl.substring(0, separator);
        String mimeType = header.substring("data:".length(), header.indexOf(';'));
        byte[] original = Base64.getMimeDecoder().decode(dataUrl.substring(separator + 1));
        int maxWidth = clampWidth(requestedWidth);

        try {
            BufferedImage input = ImageIO.read(new ByteArrayInputStream(original));
            if (input == null || input.getWidth() <= maxWidth) {
                return new ProcessedImage(original, safeMediaType(mimeType));
            }

            int targetHeight = Math.max(1, Math.round((float) input.getHeight() * maxWidth / input.getWidth()));
            boolean keepPng = mimeType.equalsIgnoreCase("image/png") && input.getColorModel().hasAlpha();
            BufferedImage output = new BufferedImage(
                    maxWidth,
                    targetHeight,
                    keepPng ? BufferedImage.TYPE_INT_ARGB : BufferedImage.TYPE_INT_RGB
            );

            Graphics2D graphics = output.createGraphics();
            graphics.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BICUBIC);
            graphics.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
            graphics.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            graphics.drawImage(input, 0, 0, maxWidth, targetHeight, null);
            graphics.dispose();

            String format = keepPng ? "png" : "jpeg";
            ByteArrayOutputStream resized = new ByteArrayOutputStream();
            if (!ImageIO.write(output, format, resized)) {
                return new ProcessedImage(original, safeMediaType(mimeType));
            }

            return new ProcessedImage(
                    resized.toByteArray(),
                    keepPng ? MediaType.IMAGE_PNG : MediaType.IMAGE_JPEG
            );
        } catch (Exception ignored) {
            // Preserve the source image when a legacy image format cannot be resized.
            return new ProcessedImage(original, safeMediaType(mimeType));
        }
    }

    private int clampWidth(Integer requestedWidth) {
        if (requestedWidth == null || requestedWidth <= 0) {
            return DEFAULT_MAX_WIDTH;
        }
        return Math.min(requestedWidth, MAX_ALLOWED_WIDTH);
    }

    private MediaType safeMediaType(String value) {
        try {
            return MediaType.parseMediaType(value);
        } catch (IllegalArgumentException ignored) {
            return MediaType.APPLICATION_OCTET_STREAM;
        }
    }

    public record ProcessedImage(byte[] body, MediaType mediaType) {
    }
}
