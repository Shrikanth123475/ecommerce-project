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