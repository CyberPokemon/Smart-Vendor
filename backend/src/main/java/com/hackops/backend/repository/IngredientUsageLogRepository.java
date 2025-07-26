package com.hackops.backend.repository;

import com.hackops.backend.model.IngredientUsageLog;
import com.hackops.backend.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface IngredientUsageLogRepository extends JpaRepository<IngredientUsageLog, Long> {
    List<IngredientUsageLog> findByUserAndDate(Users user, LocalDate date);
}

