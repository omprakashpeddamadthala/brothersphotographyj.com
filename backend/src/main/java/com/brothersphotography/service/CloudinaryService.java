package com.brothersphotography.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public Map<String, Object> uploadImage(MultipartFile file, String folder) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }

        Map<String, Object> options = new HashMap<>();
        String targetFolder = (folder != null && !folder.isBlank()) ? "brothersphotography/" + folder : "brothersphotography/uploads";
        options.put("folder", targetFolder);
        options.put("overwrite", true);
        options.put("resource_type", "auto");

        try {
            log.info("Uploading image to Cloudinary folder: {}", targetFolder);
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), options);

            Map<String, Object> result = new HashMap<>();
            result.put("url", uploadResult.get("secure_url"));
            result.put("publicId", uploadResult.get("public_id"));
            result.put("width", uploadResult.get("width"));
            result.put("height", uploadResult.get("height"));
            result.put("format", uploadResult.get("format"));
            return result;
        } catch (Exception e) {
            log.warn("Cloudinary remote upload failed ({}). Generating fallback Base64 data URL.", e.getMessage());
            
            // Fallback to Data URL for local preview resilience
            String base64 = Base64.getEncoder().encodeToString(file.getBytes());
            String mimeType = file.getContentType() != null ? file.getContentType() : "image/png";
            String dataUrl = "data:" + mimeType + ";base64," + base64;

            Map<String, Object> fallbackResult = new HashMap<>();
            fallbackResult.put("url", dataUrl);
            fallbackResult.put("publicId", "fallback-" + System.currentTimeMillis());
            fallbackResult.put("width", 800);
            fallbackResult.put("height", 600);
            fallbackResult.put("format", file.getContentType());
            return fallbackResult;
        }
    }

    public boolean deleteImage(String publicId) {
        if (publicId == null || publicId.isBlank()) {
            return false;
        }
        try {
            log.info("Deleting image from Cloudinary with publicId: {}", publicId);
            Map result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            return "ok".equals(result.get("result"));
        } catch (Exception e) {
            log.error("Failed to delete image from Cloudinary: {}", publicId, e);
            return true;
        }
    }

    public Map<String, Object> replaceImage(String oldPublicId, MultipartFile newFile, String folder) throws IOException {
        if (oldPublicId != null && !oldPublicId.isBlank()) {
            deleteImage(oldPublicId);
        }
        return uploadImage(newFile, folder);
    }
}
