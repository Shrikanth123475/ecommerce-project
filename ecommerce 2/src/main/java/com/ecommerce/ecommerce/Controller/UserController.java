package com.ecommerce.ecommerce.Controller;

import com.ecommerce.ecommerce.DTO.UserDTO;
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

        User user = User.builder()
                .name(userDTO.getName())
                .email(userDTO.getEmail())
                .password(userDTO.getPassword())
                .build();

        return userService.register(user);
    }
  @PostMapping("/login")
    public User login(@RequestBody LoginDTO loginDTO){
      return userService.login(
              loginDTO.getEmail(),
              loginDTO.getPassword()
      );

  }
  @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id){
      userService.deleteUser(id);
      return "User deleted successfully";
  }

}
