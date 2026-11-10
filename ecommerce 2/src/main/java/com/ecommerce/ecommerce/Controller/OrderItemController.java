package com.ecommerce.ecommerce.Controller;

import com.ecommerce.ecommerce.DTO.OrderItemDTO;
import com.ecommerce.ecommerce.Service.OrderItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/orderitems")
@RequiredArgsConstructor
public class OrderItemController {

    private final OrderItemService orderItemService;

    @PostMapping
    public OrderItemDTO createOrderItem(
            @RequestBody OrderItemDTO orderItemDTO) {

        return orderItemService.createOrderItem(orderItemDTO);
    }

    @GetMapping
    public List<OrderItemDTO> getAllOrderItems() {

        return orderItemService.getAllOrderItems();
    }

    @GetMapping("/{id}")
    public OrderItemDTO getOrderItemById(
            @PathVariable Long id) {

        return orderItemService.getOrderItemById(id);
    }

    @PutMapping("/{id}")
    public OrderItemDTO updateOrderItem(
            @PathVariable Long id,
            @RequestBody OrderItemDTO orderItemDTO) {

        return orderItemService.updateOrderItem(id, orderItemDTO);
    }

    @DeleteMapping("/{id}")
    public String deleteOrderItem(
            @PathVariable Long id) {

        orderItemService.deleteOrderItem(id);
        return "Order Item Deleted Successfully";
    }
}
