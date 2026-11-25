package com.ecommerce.ecommerce.Service;

import com.ecommerce.ecommerce.DTO.AuthResponseDTO;
import com.ecommerce.ecommerce.DTO.LoginDTO;
import com.ecommerce.ecommerce.DTO.UserDTO;
import com.ecommerce.ecommerce.DTO.UserResponseDTO;
import com.ecommerce.ecommerce.Entity.User;

public interface UserService {

  UserResponseDTO register (UserDTO userDTO);
  UserResponseDTO registerMerchant (UserDTO userDTO);
  AuthResponseDTO login (LoginDTO loginDTO);
  void deleteUserByEmail(String email);
    UserResponseDTO getProfile(String email);
    UserResponseDTO updateProfile(
            String email,
            UserDTO userDTO
    );
}
