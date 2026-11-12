package com.ecommerce.ecommerce.Repository;

import com.ecommerce.ecommerce.Entity.Order;
import com.ecommerce.ecommerce.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
List<Order> findByUser(User user);
}
