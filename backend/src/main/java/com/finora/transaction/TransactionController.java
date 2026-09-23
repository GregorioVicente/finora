package com.finora.transaction;

import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:4173"})
public class TransactionController {
  private final TransactionRepository repository;
  private final TransactionService service;
  public TransactionController(TransactionRepository repository, TransactionService service) { this.repository = repository; this.service = service; }

  @GetMapping("/transactions")
  public List<Transaction> transactions(@RequestParam(required = false) YearMonth month, Authentication auth) {
    return service.byMonth(month == null ? YearMonth.now() : month, auth.getName());
  }

  @PostMapping("/transactions/import")
  public Map<String, Object> importCsv(@RequestParam MultipartFile file, Authentication auth) throws IOException {
    int count = service.importCsv(file, auth.getName());
    return Map.of("imported", count, "message", count + " transações importadas com sucesso.");
  }

  @PostMapping("/transactions")
  @ResponseStatus(org.springframework.http.HttpStatus.CREATED)
  public Transaction create(@RequestBody CreateTransaction body, Authentication auth) {
    if (body.description() == null || body.description().isBlank()) throw new IllegalArgumentException("Informe a descrição.");
    if (body.amount() == null || body.amount().signum() == 0) throw new IllegalArgumentException("O valor deve ser diferente de zero.");
    String category = body.category() == null || body.category().isBlank() ? CategoryRules.detect(body.description(), body.amount().signum() > 0) : body.category();
    return repository.save(new Transaction(body.date() == null ? LocalDate.now() : body.date(), body.description().trim(), body.amount(), category, auth.getName()));
  }

  @PatchMapping("/transactions/{id}/category")
  public Transaction categorize(@PathVariable Long id, @RequestBody CategoryRequest body, Authentication auth) {
    Transaction tx = repository.findByIdAndOwnerEmail(id, auth.getName()).orElseThrow(() -> new NoSuchElementException("Transação não encontrada."));
    tx.setCategory(body.category());
    return repository.save(tx);
  }

  @DeleteMapping("/transactions/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id, Authentication auth) { repository.delete(repository.findByIdAndOwnerEmail(id, auth.getName()).orElseThrow(() -> new NoSuchElementException("Transação não encontrada."))); return ResponseEntity.noContent().build(); }

  @GetMapping("/dashboard")
  public Dashboard dashboard(@RequestParam(required = false) YearMonth month, Authentication auth) {
    YearMonth selected = month == null ? YearMonth.now() : month;
    List<Transaction> current = service.byMonth(selected, auth.getName());
    BigDecimal income = current.stream().map(Transaction::getAmount).filter(v -> v.signum() > 0).reduce(BigDecimal.ZERO, BigDecimal::add);
    BigDecimal expenses = current.stream().map(Transaction::getAmount).filter(v -> v.signum() < 0).map(BigDecimal::abs).reduce(BigDecimal.ZERO, BigDecimal::add);
    Map<String, BigDecimal> categories = new LinkedHashMap<>();
    current.stream().filter(t -> t.getAmount().signum() < 0).forEach(t -> categories.merge(t.getCategory(), t.getAmount().abs(), BigDecimal::add));
    List<MonthlyTotal> evolution = new ArrayList<>();
    for (int i = 5; i >= 0; i--) {
      YearMonth m = selected.minusMonths(i); List<Transaction> txs = service.byMonth(m, auth.getName());
      BigDecimal inc = txs.stream().map(Transaction::getAmount).filter(v -> v.signum() > 0).reduce(BigDecimal.ZERO, BigDecimal::add);
      BigDecimal exp = txs.stream().map(Transaction::getAmount).filter(v -> v.signum() < 0).map(BigDecimal::abs).reduce(BigDecimal.ZERO, BigDecimal::add);
      evolution.add(new MonthlyTotal(m.toString(), inc, exp));
    }
    return new Dashboard(income, expenses, income.subtract(expenses), current.size(), categories, evolution);
  }

  public record CategoryRequest(@NotBlank String category) {}
  public record CreateTransaction(LocalDate date, String description, BigDecimal amount, String category) {}
  public record MonthlyTotal(String month, BigDecimal income, BigDecimal expenses) {}
  public record Dashboard(BigDecimal income, BigDecimal expenses, BigDecimal balance, int transactionCount, Map<String, BigDecimal> categories, List<MonthlyTotal> evolution) {}
}
