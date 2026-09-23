package com.finora.auth;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {
  @Bean PasswordEncoder encoder() { return new BCryptPasswordEncoder(); }

  @Bean
  SecurityFilterChain security(HttpSecurity http, JwtFilter filter) throws Exception {
    return http
      .csrf(csrf -> csrf.disable())
      .cors(cors -> {})
      .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
      .authorizeHttpRequests(auth -> auth
        .requestMatchers("/api/auth/**", "/api/health", "/error", "/h2-console/**").permitAll()
        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
        .anyRequest().authenticated())
      .exceptionHandling(errors -> errors
        .authenticationEntryPoint((request, response, exception) -> writeError(response, 401, "Sessão ausente, inválida ou expirada."))
        .accessDeniedHandler((request, response, exception) -> writeError(response, 403, "Você não tem permissão para esta operação.")))
      .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))
      .addFilterBefore(filter, UsernamePasswordAuthenticationFilter.class)
      .build();
  }

  private static void writeError(HttpServletResponse response, int status, String message) throws java.io.IOException {
    response.setStatus(status);
    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");
    response.getWriter().write("{\"message\":\"" + message + "\"}");
  }
}
