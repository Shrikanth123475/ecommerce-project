package com.ecommerce.ecommerce.Controller;

import com.ecommerce.ecommerce.DTO.UserDTO;
import com.ecommerce.ecommerce.DTO.LoginDTO;
import com.ecommerce.ecommerce.Entity.User;
import com.ecommerce.ecommerce.Service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
  private final UserService userService;

  public UserController(UserService userService){
      this.userService=userService;
  }

  @PostMapping("/register")
    public User register(@RequestBody UserDTO userDTO){
      return userService.register(userDTO);
  }
  @PostMapping("/login")
    public User login(@RequestBody LoginDTO loginDTO){
      return userService.login( loginDTO);

  }
  @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id){
      userService.deleteUser(id);
      return "User deleted successfully";
  }

}
