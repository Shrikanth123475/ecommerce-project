package com.ecommerce.ecommerce.Service;

import com.ecommerce.ecommerce.Entity.User;

public interface UserService {

  User register (User user);
  User login (String email,String password);
  void deleteUser(Long id);
}
