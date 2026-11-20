package com.ecommerce.ecommerce.Controller;

import com.ecommerce.ecommerce.DTO.CartDTO;
import com.ecommerce.ecommerce.DTO.CartResponseDTO;
import com.ecommerce.ecommerce.Entity.Cart;
import com.ecommerce.ecommerce.Service.CartService;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {

        this.cartService = cartService;
    }

    @PostMapping("/add")
    public String addToCart(@RequestBody CartDTO cartDTO,Principal principal) {


        System.out.println("Controller ProductId = "
                + cartDTO.getProductId());

        System.out.println("Controller Quantity = "
                + cartDTO.getQuantity());

        cartService.addToCart(
                principal.getName(),
                cartDTO.getProductId(),
                cartDTO.getQuantity()
        );

        return "Product added to cart successfully";
    }

    @GetMapping()
    public CartResponseDTO getCart(Principal principal) {
         String email = principal.getName();
        System.out.println(" email in cart get mapping  is  " + email);

        return cartService.getCartByEmail(email);
    }

    @DeleteMapping("/{cartItemId}")
    public String removeFromCart(
            @PathVariable Long cartItemId) {

        cartService.removeFromCart(cartItemId);

        return "Item removed successfully";
    }
}
