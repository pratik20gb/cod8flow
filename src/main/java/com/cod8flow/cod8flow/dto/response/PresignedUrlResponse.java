package com.cod8flow.cod8flow.dto.response;

import lombok.*;

import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PresignedUrlResponse {

    private String uploadUrl;
    private String s3Key;
    private UUID attachmentId;
}