package com.ecommerce.ecommerce.Controller;

import com.ecommerce.ecommerce.Entity.CartItem;
import com.ecommerce.ecommerce.Service.CartItemService;
import org.springframework.web.bind.annotation.*;

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
            @PathVariable Long cartItemId) {

        cartItemService.removeCartItem(cartItemId);

        return "Cart Item Removed Successfully";
    }
    @PutMapping("/{cartItemId}/increment")
    public CartItem incrementQuantity(
            @PathVariable Long cartItemId){

        return cartItemService.incrementQuantity(cartItemId);
    }
    @PutMapping("/{cartItemId}/decrement")
    public CartItem decrementQuantity(
            @PathVariable Long cartItemId){

        return cartItemService.decrementQuantity(cartItemId);
    }
}