package com.finora.transaction;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

class CategoryRulesTest {
  @Test void categorizesKnownExpense() { assertThat(CategoryRules.detect("Compra no Supermercado", false)).isEqualTo("Alimentação"); }
  @Test void defaultsUnknownExpense() { assertThat(CategoryRules.detect("Pagamento desconhecido", false)).isEqualTo("Outros"); }
}
