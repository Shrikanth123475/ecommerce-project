package com.ecommerce.ecommerce.ServiceImpl;

import com.ecommerce.ecommerce.DTO.OrderDTO;
import com.ecommerce.ecommerce.Entity.Order;
import com.ecommerce.ecommerce.Repository.OrderRepository;
import com.ecommerce.ecommerce.Service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;

    @Override
    public OrderDTO createOrder(OrderDTO orderDTO) {

        Order order = Order.builder()
                .totalAmount(orderDTO.getTotalAmount())
                .status(orderDTO.getStatus())
                .build();

        order = orderRepository.save(order);

        return mapToDTO(order);
    }

    @Override
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public OrderDTO getOrderById(Long id) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        return mapToDTO(order);
    }

    @Override
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

    private OrderDTO mapToDTO(Order order) {

        return OrderDTO.builder()
                .id(order.getId())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .build();
    }
}