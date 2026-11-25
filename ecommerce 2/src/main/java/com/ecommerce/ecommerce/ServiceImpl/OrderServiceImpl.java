package com.ecommerce.ecommerce.ServiceImpl;

import java.util.Comparator;
import jakarta.persistence.LockModeType;
import jakarta.persistence.EntityManager;
import org.springframework.transaction.annotation.Transactional;
import com.ecommerce.ecommerce.DTO.OrderItemResponseDTO;
import com.ecommerce.ecommerce.DTO.OrderResponseDTO;
import com.ecommerce.ecommerce.Entity.*;
import com.ecommerce.ecommerce.Repository.CartItemRepository;
import com.ecommerce.ecommerce.Repository.CartRepository;
import com.ecommerce.ecommerce.Repository.OrderRepository;
import com.ecommerce.ecommerce.Repository.UserRepository;
import com.ecommerce.ecommerce.Service.OrderService;
import com.ecommerce.ecommerce.util.ImageUrls;
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
    private final EntityManager entityManager;

    // One transaction: if any item fails, nothing (stock, order, cart) is changed.
    @Transactional
    @Override
    public OrderResponseDTO placeOrder(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart not found"));

        if (cart.getCartItems().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cart is empty");
        }


        Order order = new Order();
        order.setUser(user);
        order.setStatus("PLACED");
        order.setOrderDate(LocalDateTime.now());

        // Lock every product row until commit, so two buyers can't both take the last unit.
        cart.getCartItems().stream()
                .map(CartItem::getProduct)
                .sorted(Comparator.comparing(Product::getId))
                .distinct()
                .forEach(p -> entityManager.refresh(p, LockModeType.PESSIMISTIC_WRITE));

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
            orderItem.setSize(cartItem.getSize());

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
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

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
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        return orderRepository.findByUserOrderByIdDesc(user)
                .stream()
                .map(order -> toResponse(order, email))
                .toList();
    }

    @Transactional
    @Override
    public OrderResponseDTO cancelOrder(
            Long orderId,
            String email
    ) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        if (!order.getUser().getEmail().equals(email)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You cannot cancel another user's order"
            );
        }

        if ("CANCELLED".equals(order.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order already cancelled");
        }

        // Lock the order so a double-tap can't restore the stock twice, then lock the products.
        entityManager.refresh(order, LockModeType.PESSIMISTIC_WRITE);
        if ("CANCELLED".equals(order.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order already cancelled");
        }
        order.getOrderItems().stream()
                .map(OrderItem::getProduct)
                .sorted(Comparator.comparing(Product::getId))
                .distinct()
                .forEach(p -> entityManager.refresh(p, LockModeType.PESSIMISTIC_WRITE));

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
                        ImageUrls.hero(item.getProduct().getImageUrl(), item.getProduct().getImageUrls()),
                        item.getSize()
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
