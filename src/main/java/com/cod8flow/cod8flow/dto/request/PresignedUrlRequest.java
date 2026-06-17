package com.cod8flow.cod8flow.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PresignedUrlRequest {

    @NotBlank
    private String fileName;

    @NotBlank
    private String contentType;
}