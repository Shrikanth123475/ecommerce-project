package com.ecommerce.ecommerce.Service;

import com.ecommerce.ecommerce.DTO.LoginDTO;
import com.ecommerce.ecommerce.DTO.UserDTO;
import com.ecommerce.ecommerce.DTO.UserResponseDTO;
import com.ecommerce.ecommerce.Entity.User;

public interface UserService {

  UserResponseDTO register (UserDTO userDTO);
  UserResponseDTO login (LoginDTO loginDTO);
  void deleteUser(Long id);
}
