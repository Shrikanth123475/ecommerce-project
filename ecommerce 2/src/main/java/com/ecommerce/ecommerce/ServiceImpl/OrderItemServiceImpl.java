package com.ecommerce.ecommerce.ServiceImpl;

import com.ecommerce.ecommerce.DTO.OrderItemDTO;
import com.ecommerce.ecommerce.Entity.OrderItem;
import com.ecommerce.ecommerce.Repository.OrderItemRepository;
import com.ecommerce.ecommerce.Service.OrderItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderItemServiceImpl implements OrderItemService {

    private final OrderItemRepository orderItemRepository;

    @Override
    public OrderItemDTO createOrderItem(OrderItemDTO orderItemDTO) {

        OrderItem orderItem = OrderItem.builder()
                .quantity(orderItemDTO.getQuantity())
                .price(orderItemDTO.getPrice())
                .build();

        orderItem = orderItemRepository.save(orderItem);

        return mapToDTO(orderItem);
    }

    @Override
    public List<OrderItemDTO> getAllOrderItems() {

        return orderItemRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    @Override
    public OrderItemDTO getOrderItemById(Long id) {

        OrderItem orderItem = orderItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order Item Not Found"));

        return mapToDTO(orderItem);
    }
    @Override
    public OrderItemDTO updateOrderItem(Long id,
                                        OrderItemDTO orderItemDTO) {

        OrderItem orderItem = orderItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order Item Not Found"));

        orderItem.setQuantity(orderItemDTO.getQuantity());
        orderItem.setPrice(orderItemDTO.getPrice());

        orderItem = orderItemRepository.save(orderItem);

        return mapToDTO(orderItem);
    }
    @Override
    public void deleteOrderItem(Long id) {

        orderItemRepository.deleteById(id);
    }
    private OrderItemDTO mapToDTO(OrderItem orderItem) {

        return OrderItemDTO.builder()
                .productId(
                        orderItem.getProduct() != null
                                ? orderItem.getProduct().getId()
                                : null
                )
                .quantity(orderItem.getQuantity())
                .price(orderItem.getPrice())
                .build();
    }
}