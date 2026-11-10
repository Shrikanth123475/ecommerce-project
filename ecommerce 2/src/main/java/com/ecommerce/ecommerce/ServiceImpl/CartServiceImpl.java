package com.ecommerce.ecommerce.ServiceImpl;

import com.ecommerce.ecommerce.Entity.Cart;
import com.ecommerce.ecommerce.Entity.CartItem;
import com.ecommerce.ecommerce.Entity.Product;
import com.ecommerce.ecommerce.Entity.User;
import com.ecommerce.ecommerce.Repository.CartItemRepository;
import com.ecommerce.ecommerce.Repository.CartRepository;
import com.ecommerce.ecommerce.Repository.ProductRepository;
import com.ecommerce.ecommerce.Repository.UserRepository;
import com.ecommerce.ecommerce.Service.CartService;
import org.springframework.stereotype.Service;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public CartServiceImpl(CartRepository cartRepository,
                           CartItemRepository cartItemRepository,
                           UserRepository userRepository,
                           ProductRepository productRepository){

        this.cartRepository = cartRepository;
        this.userRepository=userRepository;
        this.cartItemRepository=cartItemRepository;
        this.productRepository=productRepository;


    }

    @Override
    public Cart getCartByUserId(Long userId){
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return cartRepository.findByUser(user)
                .orElseThrow(()->
                        new RuntimeException("Cart not found "));

    }

    @Override
    public void addToCart(Long userId,
                          Long productId,
                          Integer quantity){

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Cart cart=cartRepository.findByUser(user)
                .orElseThrow(()->
                        new RuntimeException("Cart not found"));
        Product product =productRepository.findById(productId)
                .orElseThrow(()->
                        new RuntimeException("product not found"));

        CartItem cartItem = new CartItem();

        cartItem.setCart(cart);
        cartItem.setProduct(product);
        cartItem.setQuantity(quantity);

        cartItemRepository.save(cartItem);
    }


    @Override
    public void removeFromCart(Long cartItemId){
        CartItem cartItem=cartItemRepository.findById(cartItemId)
                .orElseThrow(()->
                        new RuntimeException("CartItem not found "));

        cartItemRepository.delete(cartItem);
    }



}
