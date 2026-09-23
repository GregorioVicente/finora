package com.finora.transaction;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "transactions")
public class Transaction {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
  @Column(nullable = false) private LocalDate date;
  @Column(nullable = false) private String description;
  @Column(nullable = false, precision = 14, scale = 2) private BigDecimal amount;
  @Column(nullable = false) private String category;
  @Column(nullable = false) private String ownerEmail;

  protected Transaction() {}
  public Transaction(LocalDate date, String description, BigDecimal amount, String category, String ownerEmail) {
    this.date = date; this.description = description; this.amount = amount; this.category = category; this.ownerEmail = ownerEmail;
  }
  public Long getId() { return id; }
  public LocalDate getDate() { return date; }
  public String getDescription() { return description; }
  public BigDecimal getAmount() { return amount; }
  public String getCategory() { return category; }
  @JsonIgnore public String getOwnerEmail() { return ownerEmail; }
  public void setCategory(String category) { this.category = category; }
}
