package com.ecommerce.ecommerce.ServiceImpl;

import com.ecommerce.ecommerce.Entity.User;
import com.ecommerce.ecommerce.Repository.UserRepository;
import com.ecommerce.ecommerce.Service.UserService;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
private final UserRepository userRepository;

public UserServiceImpl (UserRepository userRepository){
    this.userRepository=userRepository;

}

@Override
    public User register(User user){
    if(userRepository.existsByEmail(user.getEmail())){
        throw new RuntimeException("Email already exists");
    }
    return userRepository.save(user);
}
@Override
    public User login (String email,String password){
    User user=userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    if(!user.getPassword(). equals(password)){
        throw new RuntimeException("Invalid Password");
    }

    return user;



}

@Override
    public void deleteUser(Long id){
    if(!userRepository.existsById(id)){
        throw new RuntimeException("User not found");
    }

    userRepository.deleteById(id);
}



}
