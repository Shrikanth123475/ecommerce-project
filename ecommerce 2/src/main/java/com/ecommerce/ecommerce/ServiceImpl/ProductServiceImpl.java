package com.ecommerce.ecommerce.ServiceImpl;

import com.ecommerce.ecommerce.DTO.ProductDTO;
import com.ecommerce.ecommerce.Entity.Product;
import com.ecommerce.ecommerce.Repository.ProductRepository;
import com.ecommerce.ecommerce.Service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Override
    public ProductDTO createProduct(ProductDTO productDTO) {

        Product product = Product.builder()
                .id(productDTO.getId())
                .name(productDTO.getName())
                .description(productDTO.getDescription())
                .price(productDTO.getPrice())
                .quantity(productDTO.getQuantity())
                .imageUrl(productDTO.getImageUrl())
                .category(productDTO.getCategory())
                .brand(productDTO.getBrand())

                .seller(productDTO.getSeller())
                .distributor(productDTO.getDistributor())
                .warranty(productDTO.getWarranty())
                .specifications(
                        productDTO.getSpecifications()
                )

                .build();

        product = productRepository.save(product);

        return mapToDTO(product);
    }

    @Override
    public List<ProductDTO> getAllProducts() {

        return productRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ProductDTO getProductById(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));

        return mapToDTO(product);
    }

    @Override
    public ProductDTO updateProduct(
            Long id,
            ProductDTO productDTO
    ) {

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));

        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setPrice(productDTO.getPrice());
        product.setQuantity(productDTO.getQuantity());
        product.setImageUrl(productDTO.getImageUrl());
        product.setCategory(productDTO.getCategory());
        product.setBrand(productDTO.getBrand());
        product.setSeller(
                productDTO.getSeller()
        );

        product.setDistributor(
                productDTO.getDistributor()
        );

        product.setWarranty(
                productDTO.getWarranty()
        );

        product.setSpecifications(
                productDTO.getSpecifications()
        );
        product = productRepository.save(product);

        return mapToDTO(product);
    }

    @Override
    public void deleteProduct(Long id) {

        productRepository.deleteById(id);
    }

    @Override
    public List<String> getAllCategories() {

        return productRepository.findAllCategories();
    }

    @Override
    public List<String> getAllBrands() {

        return productRepository.findAllBrands();
    }

    @Override
    public List<ProductDTO> filterProducts(
            String category,
            String brand,
            BigDecimal maxPrice,
            String sort,
            String search
    ) {

        List<Product> products =
                productRepository.findAll();

        List<Product> filteredProducts =
                products.stream()

                        .filter(product ->
                                category == null ||
                                        category.isBlank() ||
                                        (
                                                product.getCategory() != null &&
                                                        product.getCategory()
                                                                .equalsIgnoreCase(category)
                                        )
                        )

                        .filter(product ->
                                brand == null ||
                                        brand.isBlank() ||
                                        (
                                                product.getBrand() != null &&
                                                        product.getBrand()
                                                                .equalsIgnoreCase(brand)
                                        )
                        )

                        .filter(product ->
                                maxPrice == null ||
                                        (
                                                product.getPrice() != null &&
                                                        product.getPrice()
                                                                .compareTo(maxPrice) <= 0
                                        )
                        )

                        .filter(product ->
                                search == null ||
                                        search.isBlank() ||
                                        (
                                                product.getName() != null &&
                                                        product.getName()
                                                                .toLowerCase()
                                                                .contains(
                                                                        search.toLowerCase()
                                                                )
                                        )
                        )

                        .collect(Collectors.toList());

        if (sort != null) {

            switch (sort) {

                case "priceLow":

                    filteredProducts.sort(
                            Comparator.comparing(
                                    Product::getPrice,
                                    Comparator.nullsLast(
                                            Comparator.naturalOrder()
                                    )
                            )
                    );
                    break;

                case "priceHigh":

                    filteredProducts.sort(
                            Comparator.comparing(
                                    Product::getPrice,
                                    Comparator.nullsLast(
                                            Comparator.reverseOrder()
                                    )
                            )
                    );
                    break;

                case "newest":

                    filteredProducts.sort(
                            Comparator.comparing(
                                    Product::getId
                            ).reversed()
                    );
                    break;

                case "stock":

                    filteredProducts.sort(
                            Comparator.comparing(
                                    Product::getQuantity,
                                    Comparator.nullsLast(
                                            Comparator.reverseOrder()
                                    )
                            )
                    );
                    break;

                case "featured":
                default:
                    break;
            }
        }

        return filteredProducts.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private ProductDTO mapToDTO(Product product) {

        return ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(
                        product.getDescription()
                )
                .price(product.getPrice())
                .quantity(
                        product.getQuantity()
                )
                .imageUrl(
                        product.getImageUrl()
                )
                .category(
                        product.getCategory()
                )
                .brand(
                        product.getBrand()
                )

                .seller(
                        product.getSeller()
                )

                .distributor(
                        product.getDistributor()
                )

                .warranty(
                        product.getWarranty()
                )

                .specifications(
                        product.getSpecifications()
                )

                .build();
    }

}