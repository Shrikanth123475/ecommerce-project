package com.ecommerce.ecommerce.ServiceImpl;

import com.ecommerce.ecommerce.DTO.LoginDTO;
import com.ecommerce.ecommerce.DTO.UserDTO;
import com.ecommerce.ecommerce.Entity.Cart;
import com.ecommerce.ecommerce.Entity.User;
import com.ecommerce.ecommerce.Repository.CartRepository;
import com.ecommerce.ecommerce.Repository.UserRepository;
import com.ecommerce.ecommerce.Service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserServiceImpl implements UserService {
private final UserRepository userRepository;
private final CartRepository cartRepository;

public UserServiceImpl (
        UserRepository userRepository,
        CartRepository cartRepository
){
    this.userRepository=userRepository;
    this.cartRepository=cartRepository;

}

@Override
    public User register(UserDTO userDTO){
    if(userRepository.existsByEmail(userDTO.getEmail())){
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Email already exists"
        );
    }
    User user = new User();

    user.setName(userDTO.getName());
    user.setEmail(userDTO.getEmail());
    user.setPassword(userDTO.getPassword());
    user.setAddress(userDTO.getAddress());

    User savedUser = userRepository.save(user);

    Cart cart = new Cart();
    cart.setUser(savedUser);
    savedUser.setCart(cart);
    cartRepository.save(cart);
    return savedUser;
}
@Override
    public User login (LoginDTO loginDTO){

    System.out.println("Login request received");
    System.out.println("Email: " + loginDTO.getEmail());

    User user=userRepository.findByEmail(loginDTO.getEmail())
            .orElseThrow(() -> {

                return new ResponseStatusException(HttpStatus.UNAUTHORIZED,"User not found");
            });


    if(!user.getPassword(). equals(loginDTO.getPassword())){
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Invalid Password");
    }


    return user;



}

@Override
    public void deleteUser(Long id){

    System.out.println("Deleting user: " + id);

    if(!userRepository.existsById(id)){
        throw new RuntimeException("User not found");
    }
    System.out.println("User exists");


    userRepository.deleteById(id);
}



}
