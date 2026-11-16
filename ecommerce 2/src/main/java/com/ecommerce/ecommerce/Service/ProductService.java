package com.ecommerce.ecommerce.Service;

import com.ecommerce.ecommerce.DTO.ProductDTO;
import java.util.List;

public interface ProductService {

    ProductDTO createProduct(ProductDTO productDTO);

    List<ProductDTO> getAllProducts();
    List<String> getAllCategories();

    List<String> getAllBrands();
    ProductDTO getProductById(Long id);

    ProductDTO updateProduct(Long id, ProductDTO productDTO);

    void deleteProduct(Long id);


}