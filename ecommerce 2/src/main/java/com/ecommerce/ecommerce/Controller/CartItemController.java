package com.ecommerce.ecommerce.Controller;

import com.ecommerce.ecommerce.Entity.CartItem;
import com.ecommerce.ecommerce.Service.CartItemService;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;


import java.security.Principal;

@RestController
@RequestMapping("/api/cart-items")
public class CartItemController {

    private final CartItemService cartItemService;

    public CartItemController(
            CartItemService cartItemService) {

        this.cartItemService = cartItemService;
    }

    @DeleteMapping("/{cartItemId}")
    public String removeCartItem(
            @PathVariable Long cartItemId, Principal principal) {
        String email = principal.getName();

        cartItemService.removeCartItem(cartItemId,email);

        return "Cart Item Removed Successfully";
    }
    @PutMapping("/{cartItemId}/increment")
    public CartItem incrementQuantity(
            @PathVariable Long cartItemId,
            Principal principal){

        return cartItemService.incrementQuantity(cartItemId,principal.getName());
    }
    @PutMapping("/{cartItemId}/decrement")
    public CartItem decrementQuantity(
            @PathVariable Long cartItemId,
            Principal principal){

        return cartItemService.decrementQuantity(cartItemId,principal.getName());
    }
}