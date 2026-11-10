package com.ecommerce.ecommerce.Service;

import com.ecommerce.ecommerce.DTO.LoginDTO;
import com.ecommerce.ecommerce.DTO.UserDTO;
import com.ecommerce.ecommerce.Entity.User;

public interface UserService {

  User register (UserDTO userDTO);
  User login (LoginDTO loginDTO);
  void deleteUser(Long id);
}
