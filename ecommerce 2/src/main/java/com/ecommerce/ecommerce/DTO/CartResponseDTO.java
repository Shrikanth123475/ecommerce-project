package com.ecommerce.ecommerce.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartResponseDTO {

    private Long cartId;
    private String email;
    private List<CartItemResponseDTO> items;
}