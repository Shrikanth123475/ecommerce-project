package com.ecommerce.ecommerce.ServiceImpl;

import com.ecommerce.ecommerce.DTO.OrderDTO;
import com.ecommerce.ecommerce.DTO.OrderItemResponseDTO;
import com.ecommerce.ecommerce.DTO.OrderResponseDTO;
import com.ecommerce.ecommerce.Entity.*;
import com.ecommerce.ecommerce.Repository.CartItemRepository;
import com.ecommerce.ecommerce.Repository.CartRepository;
import com.ecommerce.ecommerce.Repository.OrderRepository;
import com.ecommerce.ecommerce.Repository.UserRepository;
import com.ecommerce.ecommerce.Service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    @Override
    public OrderResponseDTO placeOrder(Long userId) {
        System.out.println("UserId = " + userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException(" User not found"));

        Order order = Order.builder()
                .totalAmount(orderDTO.getTotalAmount())
                .status(orderDTO.getStatus())
                .build();


        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() ->
                        new RuntimeException("Cart not found"));
        if (cart.getCartItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }
        System.out.println("Proceeding to create order");


        Order order = new Order();

        order.setUser(user);
        order.setStatus("PLACED");

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (CartItem cartItem : cart.getCartItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            BigDecimal price =
                    cartItem.getProduct()
                            .getPrice();

            orderItem.setPrice(price);

            totalAmount = totalAmount.add(
                    price.multiply(
                            BigDecimal.valueOf(
                                    cartItem.getQuantity()
                            )
                    )
            );

            orderItems.add(orderItem);
        }
        order.setOrderItems(orderItems);
        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);

        cartItemRepository.deleteAll(cart.getCartItems());

        List<OrderItemResponseDTO> items =
                savedOrder.getOrderItems()
                        .stream()
                        .map(item -> new OrderItemResponseDTO(
                                item.getProduct().getId(),
                                item.getProduct().getName(),
                                item.getProduct().getDescription(),
                                item.getPrice(),
                                item.getQuantity()
                        ))
                        .toList();
        return new OrderResponseDTO(
                savedOrder.getId(),
                userId,
                totalAmount,
                savedOrder.getStatus(),
                items
        );


    }
    @Override
    public OrderResponseDTO getOrderById(Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new RuntimeException("Order not found"));

        List<OrderItemResponseDTO> items = order.getOrderItems()
                .stream()
                .map(item -> new OrderItemResponseDTO(
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getProduct().getDescription(),
                        item.getPrice(),
                        item.getQuantity()
                ))
                .toList();

        return new OrderResponseDTO(
                order.getId(),
                order.getUser().getId(),
                order.getTotalAmount(),
                order.getStatus(),
                items
        );
    }

    @Override
    public List<OrderResponseDTO> getOrdersByUser(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        List<Order> orders = orderRepository.findByUser(user);

        return orders.stream()
                .map(order -> {

                    List<OrderItemResponseDTO> items =
                            order.getOrderItems()
                                    .stream()
                                    .map(item -> new OrderItemResponseDTO(
                                            item.getProduct().getId(),
                                            item.getProduct().getName(),
                                            item.getProduct().getDescription(),
                                            item.getPrice(),
                                            item.getQuantity()
                                    ))
                                    .toList();

                    return new OrderResponseDTO(
                            order.getId(),
                            userId,
                            order.getTotalAmount(),
                            order.getStatus(),
                            items
                    );

                }).toList();
    }

    @Override
    public void cancelOrder(Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new RuntimeException("Order not found"));

        return OrderDTO.builder()
                .id(order.getId())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .build();
    }


}