package com.ecommerce.ecommerce.DTO;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {

    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer quantity;
    private String imageUrl;
    private String category;
    private String brand;
    private String seller;
    private String distributor;
    private String warranty;
    private String specifications;

    private BigDecimal mrp;
    private List<String> images;
    private List<String> sizes;
    private String sizeChart;
    private List<String> offers;
}