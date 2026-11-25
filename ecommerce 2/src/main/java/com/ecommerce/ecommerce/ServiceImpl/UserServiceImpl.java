package com.ecommerce.ecommerce.ServiceImpl;

import com.ecommerce.ecommerce.DTO.AuthResponseDTO;
import com.ecommerce.ecommerce.DTO.LoginDTO;
import com.ecommerce.ecommerce.DTO.UserDTO;
import com.ecommerce.ecommerce.DTO.UserResponseDTO;
import com.ecommerce.ecommerce.Entity.Cart;
import com.ecommerce.ecommerce.Entity.User;
import com.ecommerce.ecommerce.Repository.CartRepository;
import com.ecommerce.ecommerce.Repository.UserRepository;
import com.ecommerce.ecommerce.Service.JwtService;
import com.ecommerce.ecommerce.Service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserServiceImpl implements UserService {
private final UserRepository userRepository;
private final CartRepository cartRepository;
private final JwtService jwtService;
private final PasswordEncoder passwordEncoder;

public UserServiceImpl (
        UserRepository userRepository,
        CartRepository cartRepository,
        JwtService jwtService,
        PasswordEncoder passwordEncoder
){
    this.userRepository=userRepository;
    this.cartRepository=cartRepository;
    this.jwtService=jwtService;
    this.passwordEncoder=passwordEncoder;

}

@Override
    public UserResponseDTO register(UserDTO userDTO){
    if(userRepository.existsByEmail(userDTO.getEmail())){
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Email already exists"
        );
    }
    String password = userDTO.getPassword();
    if (password == null || password.isBlank()) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is required");
    }
    // BCrypt only uses the first 72 bytes, so refuse longer ones instead of silently cutting them.
    if (password.getBytes(java.nio.charset.StandardCharsets.UTF_8).length > 72) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is too long (max 72 characters)");
    }
    User user = new User();

    user.setName(userDTO.getName());
    user.setEmail(userDTO.getEmail());
    user.setPassword(passwordEncoder.encode(password));
    user.setAddress(userDTO.getAddress());

    User savedUser = userRepository.save(user);

    Cart cart = new Cart();
    cart.setUser(savedUser);
    savedUser.setCart(cart);
    cartRepository.save(cart);
    return toResponse(savedUser);
}
@Override
    public AuthResponseDTO login (LoginDTO loginDTO){


    User user = userRepository.findByEmail(
            loginDTO.getEmail()
    ).orElseThrow(() ->
            new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid email or password"
            )
    );

    if (loginDTO.getPassword() == null
            || !passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {

        throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Invalid email or password"
        );
    }
    String token = jwtService.generateToken(
            user.getEmail()
    );


    return new AuthResponseDTO(token);



}
    @Override
    public UserResponseDTO updateProfile(
            String email,
            UserDTO userDTO) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        user.setName(userDTO.getName());
        user.setAddress(userDTO.getAddress());
        user.setPhone(userDTO.getPhone());
        user.setGender(userDTO.getGender());
        user.setDateOfBirth(userDTO.getDateOfBirth());
        user.setCity(userDTO.getCity());
        user.setPincode(userDTO.getPincode());

        user = userRepository.save(user);

        return toResponse(user);
    }

@Override
    public void deleteUserByEmail(String email){


User user = userRepository.findByEmail(email)
                .orElseThrow(() ->new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));



    userRepository.delete(user);
}

    @Override
    public UserResponseDTO getProfile(
            String email
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        return toResponse(user);
    }



    private UserResponseDTO toResponse(User user) {
        return UserResponseDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .address(user.getAddress())
                .phone(user.getPhone())
                .gender(user.getGender())
                .dateOfBirth(user.getDateOfBirth())
                .city(user.getCity())
                .pincode(user.getPincode())
                .role("MERCHANT".equals(user.getRole()) ? "MERCHANT" : "CUSTOMER")
                .build();
    }
}
