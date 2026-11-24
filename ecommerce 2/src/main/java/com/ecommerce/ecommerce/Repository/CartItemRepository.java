package com.ecommerce.ecommerce.Repository;


import com.ecommerce.ecommerce.Entity.Cart;
import com.ecommerce.ecommerce.Entity.CartItem;
import com.ecommerce.ecommerce.Entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem,Long> {
    List<CartItem> findByCart(Cart cart);

    // size may be null (products without sizes) - Spring Data turns that into "size IS NULL"
    Optional<CartItem> findByCartAndProductAndSize(
            Cart cart,
            Product product,
            String size
    );

    Optional<CartItem>findByCartAndProduct(
            Cart cart,
            Product product
    );
}
