package com.ecommerce.ecommerce.ServiceImpl;

import com.ecommerce.ecommerce.DTO.CartItemResponseDTO;
import com.ecommerce.ecommerce.DTO.CartResponseDTO;
import com.ecommerce.ecommerce.Entity.Cart;
import com.ecommerce.ecommerce.Entity.CartItem;
import com.ecommerce.ecommerce.Entity.Product;
import com.ecommerce.ecommerce.Entity.User;
import com.ecommerce.ecommerce.Repository.CartItemRepository;
import com.ecommerce.ecommerce.Repository.CartRepository;
import com.ecommerce.ecommerce.Repository.ProductRepository;
import com.ecommerce.ecommerce.Repository.UserRepository;
import com.ecommerce.ecommerce.Service.CartService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

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

    private ResponseStatusException outOfStock(int available) {
        String message = available <= 0
                ? "Sorry, this product is out of stock"
                : "Only " + available + " item(s) available in stock";
        return new ResponseStatusException(HttpStatus.CONFLICT, message);
    }

    @Override
    public CartResponseDTO getCartByEmail(String email){
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(()->
                        new RuntimeException("Cart not found "));

        List<CartItemResponseDTO> items=cart.getCartItems()
                .stream()
                .map(cartItem -> new CartItemResponseDTO(
                        cartItem.getId(),
                        cartItem.getProduct().getId(),
                        cartItem.getProduct().getName(),
                        cartItem.getProduct().getDescription(),
                        cartItem.getProduct().getPrice(),
                        cartItem.getQuantity(),
                        cartItem.getProduct().getImageUrl(),
                        cartItem.getProduct().getQuantity()
                ))
                .toList();
        return new CartResponseDTO(
                cart.getId(),
                email,
                items
        );

    }

    @Override
    public void addToCart(String email,
                          Long productId,
                          Integer quantity){

        System.out.println("Email: " + email);
        System.out.println("ProductId: " + productId);
        System.out.println("Quantity: " + quantity);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
        System.out.println("User found");

        Cart cart=cartRepository.findByUser(user)
                .orElseThrow(()->
                        new RuntimeException("Cart not found"));

        System.out.println("Cart found");

        Product product =productRepository.findById(productId)
                .orElseThrow(()->
                        new RuntimeException("product not found"));
        System.out.println("Product found");

        CartItem existingCartItem =
                cartItemRepository
                        .findByCartAndProduct(cart, product)
                        .orElse(null);

        if (existingCartItem != null) {

            int newQuantity =
                    existingCartItem.getQuantity() + quantity;

            if (newQuantity > product.getQuantity()) {
                throw outOfStock(product.getQuantity());
            }

            existingCartItem.setQuantity(newQuantity);

            cartItemRepository.save(existingCartItem);
            return;
        }


        if (quantity > product.getQuantity()) {
            throw outOfStock(product.getQuantity());
        }

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
