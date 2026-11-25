package com.ecommerce.ecommerce.DTO;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class UserResponseDTO {
    private Long id;
    private String name;
    private String email;
    private String address;
    private String phone;
    private String gender;
    private String dateOfBirth;
    private String city;
    private String pincode;

}
