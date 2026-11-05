package com.ecommerce.ecommerce.Repository;

import com.ecommerce.ecommerce.Entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

}
