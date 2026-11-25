package com.ecommerce.ecommerce.ServiceImpl;

import org.springframework.transaction.annotation.Transactional;
import com.ecommerce.ecommerce.Entity.Cart;
import com.ecommerce.ecommerce.Entity.CartItem;
import com.ecommerce.ecommerce.Repository.CartItemRepository;
import com.ecommerce.ecommerce.Repository.CartRepository;
import com.ecommerce.ecommerce.Repository.ProductRepository;
import com.ecommerce.ecommerce.Service.CartItemService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CartItemServiceImpl implements CartItemService {
    private final CartItemRepository cartItemRepository;
    private final CartRepository cartRepository;
//    private final ProductRepository productRepository;

    public CartItemServiceImpl(
            CartItemRepository cartItemRepository,
            CartRepository cartRepository){

        this.cartItemRepository=cartItemRepository;
        this.cartRepository=cartRepository;
    }
    private ResponseStatusException outOfStock(int available) {
        String message = available <= 0
                ? "Sorry, this product is out of stock"
                : "Only " + available + " item(s) available in stock";
        return new ResponseStatusException(HttpStatus.CONFLICT, message);
    }

    @Override
    public CartItem addCartItem(CartItem cartItem){
        return cartItemRepository.save(cartItem);
    }

    @Override
    public List<CartItem> getCartItemsByCartId(Long cartId) {

        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart  not found"));

        return cartItemRepository.findByCart(cart);
    }
    @Transactional
    @Override
    public void removeCartItem(Long cartItemId,String email) {

        CartItem cartItem =
                cartItemRepository.findById(cartItemId)
                        .orElseThrow(() ->
                                new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart Item not found"));

        String ownerEmail=cartItem
                .getCart()
                        .getUser()
                                .getEmail();

        if(!ownerEmail.equals(email)){
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "you cannot delete another users cart item"
            );
        }

        cartItemRepository.delete(cartItem);
    }

    @Transactional
    @Override
    public CartItem updateQuantity(
            Long cartItemId,
            Integer quantity) {

        CartItem cartItem =
                cartItemRepository.findById(cartItemId)
                        .orElseThrow(() ->
                                new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart Item not found"));

        int productStock =
                cartItem.getProduct().getQuantity();

        if (quantity > productStock) {
            throw outOfStock(productStock);
        }

        cartItem.setQuantity(quantity);

        return cartItemRepository.save(cartItem);
    }


    @Transactional
    @Override
    public CartItem incrementQuantity(
            Long cartItemId,
            String email) {

        CartItem cartItem =
                cartItemRepository.findById(cartItemId)
                        .orElseThrow(() ->
                                new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart Item not found"));

        String ownerEmail =
                cartItem.getCart()
                        .getUser()
                        .getEmail();

        if (!ownerEmail.equals(email)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You cannot modify another user's cart item"
            );
        }

        int availableStock =
                cartItem.getProduct().getQuantity();

        // Stock is per product: count every size of this product in the same cart.
        int totalInCart = cartItem.getCart().getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(cartItem.getProduct().getId()))
                .mapToInt(CartItem::getQuantity)
                .sum();
        if (totalInCart >= availableStock) {
            throw outOfStock(availableStock);
        }

        return updateQuantity(
                cartItemId,
                cartItem.getQuantity() + 1
        );
    }
    @Transactional
    @Override
    public CartItem decrementQuantity(
            Long cartItemId,
            String email) {

        CartItem cartItem =
                cartItemRepository.findById(cartItemId)
                        .orElseThrow(() ->
                                new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart Item not found"));

        String ownerEmail =
                cartItem.getCart()
                        .getUser()
                        .getEmail();

        if (!ownerEmail.equals(email)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You cannot modify another user's cart item"
            );
        }

        if (cartItem.getQuantity() == 1) {
            cartItemRepository.delete(cartItem);
            return null;
        }

        return updateQuantity(
                cartItemId,
                cartItem.getQuantity() - 1
        );
    }

}


