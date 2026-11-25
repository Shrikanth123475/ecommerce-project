package com.ecommerce.ecommerce.ServiceImpl;

import org.springframework.transaction.annotation.Transactional;
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
import com.ecommerce.ecommerce.util.ImageUrls;
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
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(()->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart not found"));

        List<CartItemResponseDTO> items=cart.getCartItems()
                .stream()
                .map(cartItem -> new CartItemResponseDTO(
                        cartItem.getId(),
                        cartItem.getProduct().getId(),
                        cartItem.getProduct().getName(),
                        cartItem.getProduct().getDescription(),
                        cartItem.getProduct().getPrice(),
                        cartItem.getQuantity(),
                        ImageUrls.hero(cartItem.getProduct().getImageUrl(), cartItem.getProduct().getImageUrls()),
                        cartItem.getProduct().getQuantity(),
                        cartItem.getSize()
                ))
                .toList();
        return new CartResponseDTO(
                cart.getId(),
                email,
                items
        );

    }

    @Transactional
    @Override
    public void addToCart(String email,
                          Long productId,
                          Integer quantity,
                          String size){


        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Cart cart=cartRepository.findByUser(user)
                .orElseThrow(()->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart not found"));


        Product product =productRepository.findById(productId)
                .orElseThrow(()->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "product not found"));

        // Clothing needs a valid size; other products never have one.
        String chosenSize = size == null || size.isBlank() ? null : size.trim();
        if (product.getSizes() != null && !product.getSizes().isBlank()) {
            if (chosenSize == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Please select a size");
            }
            if (!List.of(product.getSizes().split(",")).contains(chosenSize)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Size " + chosenSize + " is not available");
            }
        } else {
            chosenSize = null;
        }

        // Stock is per product, so count every size of this product already in the cart.
        int alreadyInCart = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()))
                .mapToInt(CartItem::getQuantity)
                .sum();
        if (alreadyInCart + quantity > product.getQuantity()) {
            throw outOfStock(product.getQuantity());
        }

        CartItem existingCartItem =
                cartItemRepository
                        .findByCartAndProductAndSize(cart, product, chosenSize)
                        .orElse(null);

        if (existingCartItem != null) {

            int newQuantity =
                    existingCartItem.getQuantity() + quantity;

            existingCartItem.setQuantity(newQuantity);

            cartItemRepository.save(existingCartItem);
            return;
        }


        CartItem cartItem = new CartItem();

        cartItem.setCart(cart);
        cartItem.setProduct(product);
        cartItem.setQuantity(quantity);
        cartItem.setSize(chosenSize);

        cartItemRepository.save(cartItem);
    }


    @Transactional
    @Override
    public void removeFromCart(Long cartItemId, String email) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "CartItem not found"));

        if (!cartItem.getCart().getUser().getEmail().equals(email)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You cannot delete another user's cart item"
            );
        }

        cartItemRepository.delete(cartItem);
    }



}
