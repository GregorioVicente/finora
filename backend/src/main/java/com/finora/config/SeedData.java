package com.finora.config;

import com.finora.transaction.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;
import com.finora.auth.*;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SeedData {
  @Bean CommandLineRunner seed(TransactionRepository repository, UserRepository users, PasswordEncoder encoder) {
    return args -> {
      if (!users.existsByEmail("demo@finora.com")) users.save(new AppUser("Usuário Demo", "demo@finora.com", encoder.encode("demo123")));
      if (repository.count() > 0) return;
      YearMonth now = YearMonth.now(); List<Transaction> data = new ArrayList<>();
      for (int i = 5; i >= 0; i--) {
        YearMonth month = now.minusMonths(i);
        data.add(new Transaction(month.atDay(5), "Salário mensal", new BigDecimal("8500.00"), "Renda", "demo@finora.com"));
        data.add(new Transaction(month.atDay(7), "Aluguel do apartamento", new BigDecimal("-2100.00"), "Moradia", "demo@finora.com"));
        data.add(new Transaction(month.atDay(11), "Supermercado Central", new BigDecimal("-642.40"), "Alimentação", "demo@finora.com"));
        data.add(new Transaction(month.atDay(16), "Posto Avenida", new BigDecimal("-320.00"), "Transporte", "demo@finora.com"));
        data.add(new Transaction(month.atDay(21), "Academia Movimento", new BigDecimal("-149.90"), "Saúde", "demo@finora.com"));
        data.add(new Transaction(month.atDay(25), "Netflix", new BigDecimal("-55.90"), "Lazer", "demo@finora.com"));
      }
      repository.saveAll(data);
    };
  }
}
