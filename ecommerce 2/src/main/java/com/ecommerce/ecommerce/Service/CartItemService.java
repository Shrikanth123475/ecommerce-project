package com.ecommerce.ecommerce.Service;

import com.ecommerce.ecommerce.Entity.CartItem;

import java.security.Principal;
import java.util.List;

public interface CartItemService {

    CartItem addCartItem(CartItem cartItem);

    List<CartItem> getCartItemsByCartId(Long cartId);

    CartItem updateQuantity(Long cartItemId, Integer quantity);

    void removeCartItem(Long cartItemId,String email);

    CartItem incrementQuantity(Long cartItemId, String email);

    CartItem decrementQuantity(Long cartItemId,String email);

}
