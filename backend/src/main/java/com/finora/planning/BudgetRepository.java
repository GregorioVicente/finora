package com.finora.planning;
import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface BudgetRepository extends JpaRepository<Budget,Long>{List<Budget> findByOwnerEmailAndMonthOrderByCategory(String email,String month);Optional<Budget> findByIdAndOwnerEmail(Long id,String email);Optional<Budget> findByOwnerEmailAndMonthAndCategory(String email,String month,String category);}
