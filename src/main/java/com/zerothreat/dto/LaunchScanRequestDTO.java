package com.zerothreat.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LaunchScanRequestDTO {

    @NotBlank(message = "Target IP/URL is required")
    private String target;
}
