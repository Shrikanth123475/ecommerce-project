package com.ecommerce.ecommerce.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name="products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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

    // Original price before discount (shown struck through). Null = no discount.
    private BigDecimal mrp;

    // Gallery images, "|" separated. imageUrl stays as the single/hero image for old clients.
    @Column(length = 4000)
    private String imageUrls;

    // Clothing: "S,M,L,XL" and a JSON size chart {"columns":[...],"rows":[[...]]}
    @Column(length = 500)
    private String sizes;

    @Column(length = 4000)
    private String sizeChart;

    // Campaign tags, "," separated: sale50, clearance, festive
    @Column(length = 200)
    private String offers;
}
