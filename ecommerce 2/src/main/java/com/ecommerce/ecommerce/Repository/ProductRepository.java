package com.ecommerce.ecommerce.Repository;

import com.ecommerce.ecommerce.Entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query("""
       SELECT DISTINCT p.category
       FROM Product p
       WHERE p.category IS NOT NULL
       """)
    List<String> findAllCategories();

    @Query("""
       SELECT DISTINCT p.brand
       FROM Product p
       WHERE p.brand IS NOT NULL
       """)
    List<String> findAllBrands();
    List<Product> findByPriceLessThanEqual(
            BigDecimal price
    );

    List<Product> findByCategoryAndBrand(
            String category,
            String brand
    );

    List<Product> findByCategory(
            String category
    );

    List<Product> findByBrand(
            String brand
    );
}
