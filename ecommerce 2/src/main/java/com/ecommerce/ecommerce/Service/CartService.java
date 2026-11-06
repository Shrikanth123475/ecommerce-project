package com.ecommerce.ecommerce.Service;

import com.ecommerce.ecommerce.Entity.Cart;

public interface CartService {
    Cart getCartByUserId(Long userId);
    void addToCart(Long userId,Long productId,Integer quantity);
    void removeFromCart(Long cartItem);
}
