package com.ecommerce.ecommerce.ServiceImpl;

import com.ecommerce.ecommerce.Entity.Cart;
import com.ecommerce.ecommerce.Entity.CartItem;
import com.ecommerce.ecommerce.Repository.CartItemRepository;
import com.ecommerce.ecommerce.Repository.CartRepository;
import com.ecommerce.ecommerce.Repository.ProductRepository;
import com.ecommerce.ecommerce.Service.CartItemService;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

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
    @Override
    public CartItem addCartItem(CartItem cartItem){
        return cartItemRepository.save(cartItem);
    }

    @Override
    public List<CartItem> getCartItemsByCartId(Long cartId) {

        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() ->
                        new RuntimeException("Cart  not found"));

        return cartItemRepository.findByCart(cart);
    }
    @Override
    public void removeCartItem(Long cartItemId) {

        CartItem cartItem =
                cartItemRepository.findById(cartItemId)
                        .orElseThrow(() ->
                                new RuntimeException("Cart Item not found"));

        cartItemRepository.delete(cartItem);
    }

    @Override
    public CartItem updateQuantity(
            Long cartItemId,
            Integer quantity) {

        CartItem cartItem =
                cartItemRepository.findById(cartItemId)
                        .orElseThrow(() ->
                                new RuntimeException("Cart Item not found"));

//        cartItem.setQuantity(quantity);
//        cartItem.getProduct().setQuantity(cartItem.getProduct().getQuantity() - quantity);

        return cartItemRepository.save(cartItem);
    }
    @Override
    public CartItem incrementQuantity(Long cartItemId){

        CartItem cartItem =
                cartItemRepository.findById(cartItemId)
                        .orElseThrow(() ->
                                new RuntimeException("Cart Item not found"));

        return updateQuantity(
                cartItemId,
                cartItem.getQuantity() + 1
        );
    }

    @Override
    public CartItem decrementQuantity(Long cartItemId){

        CartItem cartItem =
                cartItemRepository.findById(cartItemId)
                        .orElseThrow(() ->
                                new RuntimeException("Cart Item not found"));

        if(cartItem.getQuantity() == 1){
            cartItemRepository.delete(cartItem);
            return null;
        }

        return updateQuantity(
                cartItemId,
                cartItem.getQuantity() - 1
        );
    }

}


