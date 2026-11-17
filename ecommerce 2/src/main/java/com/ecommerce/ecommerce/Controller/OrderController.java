package com.ecommerce.ecommerce.Controller;

import com.ecommerce.ecommerce.DTO.OrderDTO;
import com.ecommerce.ecommerce.DTO.OrderResponseDTO;
import com.ecommerce.ecommerce.Service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.security.Principal;
import java.util.List;


    @RestController
    @RequestMapping("/api/orders")
    @RequiredArgsConstructor
    public class OrderController {

        private final OrderService orderService;

        @PostMapping("/place")
        public OrderResponseDTO placeOrder(
                Principal principal) {

            return orderService.placeOrder(
                    principal.getName()
            );
        }

        @GetMapping("/{orderId}")
        public OrderResponseDTO getOrderById(
                @PathVariable Long orderId,Principal principal) {
            return orderService.getOrderById(orderId,principal.getName());
        }
        @GetMapping()
        public List<OrderResponseDTO> getMyOrders(
                Principal principal) {

            return orderService.getOrdersByUser(principal.getName());
        }
        @PutMapping("/{orderId}/cancel")
        public OrderResponseDTO cancelOrder(
                @PathVariable Long orderId,
                Authentication authentication
        ) {

            return orderService.cancelOrder(
                    orderId,
                    authentication.getName()
            );
        }

    }

