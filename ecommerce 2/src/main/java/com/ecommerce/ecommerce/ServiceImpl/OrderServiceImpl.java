package com.ecommerce.ecommerce.ServiceImpl;

import com.ecommerce.ecommerce.DTO.OrderItemResponseDTO;
import com.ecommerce.ecommerce.DTO.OrderResponseDTO;
import com.ecommerce.ecommerce.Entity.*;
import com.ecommerce.ecommerce.Repository.CartItemRepository;
import com.ecommerce.ecommerce.Repository.CartRepository;
import com.ecommerce.ecommerce.Repository.OrderRepository;
import com.ecommerce.ecommerce.Repository.UserRepository;
import com.ecommerce.ecommerce.Service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.ecommerce.ecommerce.Repository.ProductRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    @Override
    public OrderResponseDTO placeOrder(String email) {
        System.out.println("Email = " + email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(" User not found"));

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
        order.setOrderDate(LocalDateTime.now());

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (CartItem cartItem : cart.getCartItems()) {
            Product product = cartItem.getProduct();

            if (cartItem.getQuantity() > product.getQuantity()) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        product.getQuantity() <= 0
                                ? product.getName() + " is out of stock"
                                : "Only " + product.getQuantity() + " of "
                                + product.getName() + " left in stock"
                );
            }

            product.setQuantity(
                    product.getQuantity()
                            - cartItem.getQuantity()
            );
            productRepository.save(product);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());

            BigDecimal price = product.getPrice();
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
        cart.getCartItems().clear();
        cartRepository.save(cart);

        return toResponse(savedOrder, email);
    }

    @Override
    public OrderResponseDTO getOrderById(Long orderId, String email) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new RuntimeException("Order not found"));

        if (!order.getUser().getEmail().equals(email)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You cannot access another user's order"
            );
        }

        return toResponse(order, order.getUser().getEmail());
    }

    @Override
    public List<OrderResponseDTO> getOrdersByUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return orderRepository.findByUserOrderByIdDesc(user)
                .stream()
                .map(order -> toResponse(order, email))
                .toList();
    }

    @Override
    public OrderResponseDTO cancelOrder(
            Long orderId,
            String email
    ) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new RuntimeException("Order not found"));

        if (!order.getUser().getEmail().equals(email)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You cannot cancel another user's order"
            );
        }

        if ("CANCELLED".equals(order.getStatus())) {
            throw new RuntimeException(
                    "Order already cancelled"
            );
        }

        for (OrderItem orderItem : order.getOrderItems()) {
            Product product = orderItem.getProduct();
            product.setQuantity(
                    product.getQuantity()
                            + orderItem.getQuantity()
            );
            productRepository.save(product);
        }

        order.setStatus("CANCELLED");
        Order savedOrder = orderRepository.save(order);

        return toResponse(savedOrder, savedOrder.getUser().getEmail());
    }

    private OrderResponseDTO toResponse(Order order, String email) {
        List<OrderItemResponseDTO> items = order.getOrderItems()
                .stream()
                .map(item -> new OrderItemResponseDTO(
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getProduct().getDescription(),
                        item.getPrice(),
                        item.getQuantity(),
                        item.getProduct().getImageUrl()
                ))
                .toList();

        long orderNumber = orderRepository
                .countByUserAndIdLessThanEqual(order.getUser(), order.getId());

        return new OrderResponseDTO(
                order.getId(),
                orderNumber,
                email,
                order.getTotalAmount(),
                order.getStatus(),
                items,
                order.getOrderDate()
        );
    }
}
