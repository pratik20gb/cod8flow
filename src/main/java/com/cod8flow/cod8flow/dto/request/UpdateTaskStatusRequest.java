package com.cod8flow.cod8flow.dto.request;


import com.cod8flow.cod8flow.domain.enums.TaskStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class UpdateTaskStatusRequest {


    @NotNull
    private TaskStatus status;

}
