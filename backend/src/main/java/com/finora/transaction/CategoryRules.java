package com.finora.transaction;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public final class CategoryRules {
  private static final Map<String, List<String>> RULES = new LinkedHashMap<>();
  static {
    RULES.put("Alimentação", List.of("mercado", "supermercado", "ifood", "restaurante", "padaria", "cafe"));
    RULES.put("Transporte", List.of("uber", "99", "posto", "combustivel", "estacionamento", "metro"));
    RULES.put("Moradia", List.of("aluguel", "condominio", "energia", "eletricidade", "agua", "internet"));
    RULES.put("Saúde", List.of("farmacia", "hospital", "clinica", "laboratorio", "academia"));
    RULES.put("Lazer", List.of("netflix", "spotify", "cinema", "steam", "ingresso"));
    RULES.put("Compras", List.of("amazon", "shopping", "loja", "magazine", "mercado livre"));
    RULES.put("Renda", List.of("salario", "pagamento", "pix recebido", "rendimento"));
  }
  private CategoryRules() {}
  public static String detect(String description, boolean income) {
    String normalized = description.toLowerCase();
    return RULES.entrySet().stream().filter(e -> e.getValue().stream().anyMatch(normalized::contains))
      .map(Map.Entry::getKey).findFirst().orElse(income ? "Renda" : "Outros");
  }
}

