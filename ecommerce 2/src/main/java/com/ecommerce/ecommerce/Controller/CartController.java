package com.ecommerce.ecommerce.Controller;

import com.ecommerce.ecommerce.DTO.CartDTO;
import com.ecommerce.ecommerce.Entity.Cart;
import com.ecommerce.ecommerce.Service.CartService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/add")
    public String addToCart(@RequestBody CartDTO cartDTO) {

        cartService.addToCart(
                cartDTO.getUserId(),
                cartDTO.getProductId(),
                cartDTO.getQuantity()
        );

        return "Product added to cart successfully";
    }

    @GetMapping("/{userId}")
    public Cart getCart(@PathVariable Long userId) {

        return cartService.getCartByUserId(userId);
    }

    @DeleteMapping("/{cartItemId}")
    public String removeFromCart(
            @PathVariable Long cartItemId) {

        cartService.removeFromCart(cartItemId);

        return "Item removed successfully";
    }
}
