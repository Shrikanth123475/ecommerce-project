package com.ecommerce.ecommerce.Controller;

import com.ecommerce.ecommerce.DTO.ProductDTO;
import com.ecommerce.ecommerce.Service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    public ProductDTO createProduct(
            @RequestBody ProductDTO productDTO) {

        return productService.createProduct(productDTO);
    }

    @GetMapping
    public List<ProductDTO> getAllProducts() {

        return productService.getAllProducts();
    }

    @GetMapping("/categories")
    public List<String> getCategories() {

        return productService.getAllCategories();
    }

    @GetMapping("/brands")
    public List<String> getBrands() {

        return productService.getAllBrands();
    }

    @GetMapping("/filter")
    public List<ProductDTO> filterProducts(

            @RequestParam(required = false)
            String category,

            @RequestParam(required = false)
            String brand,

            @RequestParam(required = false)
            BigDecimal maxPrice,

            @RequestParam(required = false)
            String sort,

            @RequestParam(required = false)
            String search
    ) {

        return productService.filterProducts(
                category,
                brand,
                maxPrice,
                sort,
                search
        );
    }
    @GetMapping("/{id}")
    public ProductDTO getProductById(
            @PathVariable Long id) {

        return productService.getProductById(id);
    }

    @PutMapping("/{id}")
    public ProductDTO updateProduct(
            @PathVariable Long id,
            @RequestBody ProductDTO productDTO) {

        return productService.updateProduct(
                id,
                productDTO
        );
    }

    @DeleteMapping("/{id}")
    public String deleteProduct(
            @PathVariable Long id) {

        productService.deleteProduct(id);

        return "Product deleted successfully";
    }
}