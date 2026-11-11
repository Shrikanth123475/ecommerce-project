package com.ecommerce.ecommerce.Controller;

import com.ecommerce.ecommerce.DTO.OrderDTO;
import com.ecommerce.ecommerce.DTO.OrderResponseDTO;
import com.ecommerce.ecommerce.Service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;


    @RestController
    @RequestMapping("/api/orders")
    @RequiredArgsConstructor
    public class OrderController {

        private final OrderService orderService;

        @PostMapping("/place")
        public OrderResponseDTO placeOrder(
                @RequestBody OrderDTO orderDTO) {

            return orderService.placeOrder(
                    orderDTO.getUserId()
            );
        }

        @GetMapping("/{orderId}")
        public OrderResponseDTO getOrderById(
                @PathVariable Long orderId) {
            return orderService.getOrderById(orderId);
        }
        @GetMapping("/user/{userId}")
        public List<OrderResponseDTO> getOrdersByUser(
                @PathVariable Long userId) {

            return orderService.getOrdersByUser(userId);
        }
        @PutMapping("/{orderId}/cancel")
        public String cancelOrder(
                @PathVariable Long orderId) {

            orderService.cancelOrder(orderId);

            return "Order cancelled successfully";
        }

    }

