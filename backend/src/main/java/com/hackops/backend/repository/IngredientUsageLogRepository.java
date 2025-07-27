package com.hackops.backend.repository;

import com.hackops.backend.model.IngredientUsageLog;
import com.hackops.backend.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface IngredientUsageLogRepository extends JpaRepository<IngredientUsageLog, Long> {
    List<IngredientUsageLog> findByUserAndDate(Users user, LocalDate date);

    @Query("SELECT i FROM IngredientUsageLog i WHERE i.user = :user AND MONTH(i.date) = :month AND YEAR(i.date) = :year")
    List<IngredientUsageLog> findByUserAndMonthYear(@Param("user") Users user, @Param("month") int month, @Param("year") int year);

    List<IngredientUsageLog> findByUserAndDateBetween(Users user, LocalDate start, LocalDate end);


}

