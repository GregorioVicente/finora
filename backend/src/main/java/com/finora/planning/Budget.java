package com.finora.planning;
import jakarta.persistence.*; import java.math.BigDecimal;
@Entity @Table(name="budgets",uniqueConstraints=@UniqueConstraint(columnNames={"owner_email","budget_month","category"}))
public class Budget {@Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; @Column(name="owner_email",nullable=false) private String ownerEmail; @Column(name="budget_month",nullable=false) private String month; @Column(nullable=false) private String category; @Column(nullable=false,precision=14,scale=2) private BigDecimal limitAmount;
protected Budget(){} public Budget(String owner,String month,String category,BigDecimal limit){ownerEmail=owner;this.month=month;this.category=category;limitAmount=limit;} public Long getId(){return id;} public String getMonth(){return month;} public String getCategory(){return category;} public BigDecimal getLimitAmount(){return limitAmount;} public void setLimitAmount(BigDecimal v){limitAmount=v;}}
