package com.brothersphotography.controller;

import com.brothersphotography.dto.ApiResponse;
import com.brothersphotography.service.CloudinaryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/media")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Tag(name = "Media Storage (Cloudinary)", description = "Endpoints for uploading, replacing, and deleting media files via Cloudinary SDK")
public class MediaController {

    private final CloudinaryService cloudinaryService;

    @GetMapping
    @Operation(summary = "List all media files from Cloudinary")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> listMedia() {
        List<Map<String, Object>> result = cloudinaryService.listResources();
        return ResponseEntity.ok(ApiResponse.success(result, "Media files retrieved successfully"));
    }

    @PostMapping("/upload")
    @Operation(summary = "Upload image file directly to Cloudinary folder")
    public ResponseEntity<ApiResponse<Map<String, Object>>> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", required = false, defaultValue = "general") String folder) throws IOException {
        Map<String, Object> result = cloudinaryService.uploadImage(file, folder);
        return ResponseEntity.ok(ApiResponse.success(result, "Image uploaded to Cloudinary successfully"));
    }

    @DeleteMapping("/delete")
    @Operation(summary = "Delete image from Cloudinary by public ID")
    public ResponseEntity<ApiResponse<Boolean>> deleteImage(@RequestParam("publicId") String publicId) {
        boolean deleted = cloudinaryService.deleteImage(publicId);
        return ResponseEntity.ok(ApiResponse.success(deleted, deleted ? "Image deleted" : "Failed to delete image"));
    }

    @PostMapping("/replace")
    @Operation(summary = "Atomic replace image on Cloudinary (deletes old public ID, uploads new file)")
    public ResponseEntity<ApiResponse<Map<String, Object>>> replaceImage(
            @RequestParam(value = "oldPublicId", required = false) String oldPublicId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", required = false, defaultValue = "general") String folder) throws IOException {
        Map<String, Object> result = cloudinaryService.replaceImage(oldPublicId, file, folder);
        return ResponseEntity.ok(ApiResponse.success(result, "Image replaced on Cloudinary successfully"));
    }
}
