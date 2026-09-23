package com.finora.transaction;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
  List<Transaction> findByOwnerEmailAndDateBetweenOrderByDateDesc(String ownerEmail, LocalDate start, LocalDate end);
  Optional<Transaction> findByIdAndOwnerEmail(Long id, String ownerEmail);
}
