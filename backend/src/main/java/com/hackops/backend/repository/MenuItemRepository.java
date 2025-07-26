package com.hackops.backend.repository;

import com.hackops.backend.model.MenuItem;
import com.hackops.backend.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByUser(Users user);
    Optional<MenuItem> findByUserAndFoodName(Users user, String foodName);
}
