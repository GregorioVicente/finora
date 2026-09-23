package com.finora.transaction;

import org.apache.commons.csv.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.*;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class TransactionService {
  private final TransactionRepository repository;
  public TransactionService(TransactionRepository repository) { this.repository = repository; }

  public List<Transaction> byMonth(YearMonth month, String ownerEmail) {
    return repository.findByOwnerEmailAndDateBetweenOrderByDateDesc(ownerEmail, month.atDay(1), month.atEndOfMonth());
  }

  public int importCsv(MultipartFile file, String ownerEmail) throws IOException {
    if (file.isEmpty()) throw new IllegalArgumentException("O arquivo CSV está vazio.");
    String content = new String(file.getBytes(), StandardCharsets.UTF_8).replace("\uFEFF", "");
    char delimiter = content.lines().findFirst().orElse("").contains(";") ? ';' : ',';
    CSVFormat format = CSVFormat.DEFAULT.builder().setDelimiter(delimiter).setHeader().setSkipHeaderRecord(true)
      .setIgnoreEmptyLines(true).setTrim(true).get();
    List<Transaction> imported = new ArrayList<>();
    try (CSVParser parser = CSVParser.parse(content, format)) {
      Map<String, Integer> headers = new HashMap<>();
      parser.getHeaderMap().forEach((key, value) -> headers.put(normalize(key), value));
      int dateIndex = required(headers, "data", "date");
      int descriptionIndex = required(headers, "descricao", "description", "historico");
      int amountIndex = required(headers, "valor", "amount");
      Integer categoryIndex = optional(headers, "categoria", "category");
      for (CSVRecord row : parser) {
        LocalDate date = parseDate(row.get(dateIndex));
        String description = row.get(descriptionIndex).trim();
        BigDecimal amount = parseAmount(row.get(amountIndex));
        String category = categoryIndex == null ? "" : row.get(categoryIndex).trim();
        if (category.isBlank()) category = CategoryRules.detect(description, amount.signum() >= 0);
        imported.add(new Transaction(date, description, amount, category, ownerEmail));
      }
    } catch (RuntimeException e) {
      throw new IllegalArgumentException("Não foi possível processar o CSV: " + e.getMessage(), e);
    }
    repository.saveAll(imported);
    return imported.size();
  }

  private static String normalize(String text) { return java.text.Normalizer.normalize(text, java.text.Normalizer.Form.NFD).replaceAll("\\p{M}", "").toLowerCase().trim(); }
  private static int required(Map<String, Integer> headers, String... names) {
    Integer found = optional(headers, names);
    if (found == null) throw new IllegalArgumentException("Coluna obrigatória ausente: " + names[0]);
    return found;
  }
  private static Integer optional(Map<String, Integer> headers, String... names) {
    for (String name : names) if (headers.containsKey(name)) return headers.get(name);
    return null;
  }
  private static LocalDate parseDate(String value) {
    for (DateTimeFormatter f : List.of(DateTimeFormatter.ISO_LOCAL_DATE, DateTimeFormatter.ofPattern("dd/MM/yyyy"))) {
      try { return LocalDate.parse(value.trim(), f); } catch (Exception ignored) {}
    }
    throw new IllegalArgumentException("Data inválida: " + value);
  }
  private static BigDecimal parseAmount(String value) {
    String v = value.trim().replace("R$", "").replace(" ", "");
    if (v.contains(",")) v = v.replace(".", "").replace(',', '.');
    return new BigDecimal(v);
  }
}
