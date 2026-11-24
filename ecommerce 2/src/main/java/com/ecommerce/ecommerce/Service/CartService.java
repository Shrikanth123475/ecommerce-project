package com.ecommerce.ecommerce.Service;

import com.ecommerce.ecommerce.DTO.CartResponseDTO;
import com.ecommerce.ecommerce.Entity.Cart;

public interface CartService {
    CartResponseDTO getCartByEmail(String email);
    void addToCart(String email,Long productId,Integer quantity,String size);
    void removeFromCart(Long cartItem);
}
