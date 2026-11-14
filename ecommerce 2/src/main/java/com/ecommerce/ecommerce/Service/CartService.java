package com.ecommerce.ecommerce.Service;

import com.ecommerce.ecommerce.DTO.CartResponseDTO;
import com.ecommerce.ecommerce.Entity.Cart;

public interface CartService {
    CartResponseDTO getCartByUserId(String email);
    void addToCart(Long userId,Long productId,Integer quantity);
    void removeFromCart(Long cartItem);
}
