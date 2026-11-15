package com.ecommerce.ecommerce.Controller;

import com.ecommerce.ecommerce.DTO.AuthResponseDTO;
import com.ecommerce.ecommerce.DTO.LoginDTO;
import com.ecommerce.ecommerce.DTO.UserDTO;
import com.ecommerce.ecommerce.DTO.UserResponseDTO;
import com.ecommerce.ecommerce.Service.UserService;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public UserResponseDTO register(@RequestBody UserDTO userDTO) {
        return userService.register(userDTO);
    }


    @PostMapping("/login")
    public AuthResponseDTO login(@RequestBody LoginDTO loginDTO) {
        return userService.login(loginDTO);
    }



  @DeleteMapping("/delete")
    public String deleteUser(Authentication authentication){
      String email = authentication.getName();
      userService.deleteUserByEmail(email);
      return "User deleted successfully";
  }



}
