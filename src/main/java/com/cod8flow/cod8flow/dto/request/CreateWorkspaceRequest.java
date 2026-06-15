package com.cod8flow.cod8flow.dto.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter@NoArgsConstructor@AllArgsConstructor@Builder
public class CreateWorkspaceRequest {

    @NotBlank
    @Size(min =2,max=100)
    private String name;

    private String description;
}
