package com.ecommerce.ecommerce.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    private String name;
    private String email;
    private String password;
    private String address;
    private String phone;
    private String gender;
    private String dateOfBirth;
    private String city;
    private String pincode;
}

