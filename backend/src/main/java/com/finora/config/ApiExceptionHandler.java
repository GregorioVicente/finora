package com.finora.config;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import org.springframework.web.bind.MethodArgumentNotValidException;

@RestControllerAdvice
public class ApiExceptionHandler {
  @ExceptionHandler({IllegalArgumentException.class, NoSuchElementException.class})
  ResponseEntity<Map<String, String>> handle(RuntimeException e) {
    HttpStatus status = e instanceof NoSuchElementException ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST;
    return ResponseEntity.status(status).body(Map.of("message", e.getMessage()));
  }
  @ExceptionHandler(MethodArgumentNotValidException.class)
  ResponseEntity<Map<String, String>> validation(MethodArgumentNotValidException e) {
    String message = e.getBindingResult().getFieldErrors().stream().findFirst().map(error -> error.getDefaultMessage()).orElse("Dados inválidos.");
    return ResponseEntity.badRequest().body(Map.of("message", message));
  }
  @ExceptionHandler(Exception.class)
  ResponseEntity<Map<String, String>> unexpected(Exception e) {
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Erro interno ao acessar os dados."));
  }
}
