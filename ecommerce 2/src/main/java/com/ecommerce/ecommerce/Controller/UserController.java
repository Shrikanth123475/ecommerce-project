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


    // Creates a merchant account. Allowed only for a logged-in merchant (SecurityConfig).
    @PostMapping("/register-merchant")
    public UserResponseDTO registerMerchant(@RequestBody UserDTO userDTO) {
        return userService.registerMerchant(userDTO);
    }

    @PostMapping("/login")
    public AuthResponseDTO login(@RequestBody LoginDTO loginDTO) {
        return userService.login(loginDTO);
    }
    @GetMapping("/profile")
    public UserResponseDTO getProfile(
            Authentication authentication
    ) {

        String email = authentication.getName();

        return userService.getProfile(email);
    }
    @PutMapping("/profile")
    public UserResponseDTO updateProfile(
            Authentication authentication,
            @RequestBody UserDTO userDTO) {

        String email = authentication.getName();

        return userService.updateProfile(email, userDTO);
    }


  @DeleteMapping("/delete")
    public String deleteUser(Authentication authentication){
      String email = authentication.getName();
      userService.deleteUserByEmail(email);
      return "User deleted successfully";
  }



}
