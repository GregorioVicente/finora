package com.finora.auth;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:4173"})
public class AuthController {
  private final UserRepository users;
  private final PasswordEncoder encoder;
  private final JwtService jwt;

  public AuthController(UserRepository users, PasswordEncoder encoder, JwtService jwt) {
    this.users = users;
    this.encoder = encoder;
    this.jwt = jwt;
  }

  @PostMapping("/register")
  public AuthResponse register(@Valid @RequestBody Credentials body) {
    String email = normalize(body.email());
    if (users.existsByEmail(email)) throw new IllegalArgumentException("Este e-mail já está cadastrado.");
    String name = email.substring(0, email.indexOf('@'));
    return response(users.save(new AppUser(name, email, encoder.encode(body.password()))));
  }

  @PostMapping("/login")
  public AuthResponse login(@Valid @RequestBody Credentials body) {
    AppUser user = users.findByEmail(normalize(body.email()))
      .orElseThrow(() -> new IllegalArgumentException("E-mail ou senha inválidos."));
    if (!encoder.matches(body.password(), user.getPassword())) throw new IllegalArgumentException("E-mail ou senha inválidos.");
    return response(user);
  }

  private String normalize(String email) { return email.toLowerCase().trim(); }
  private AuthResponse response(AppUser user) { return new AuthResponse(jwt.create(user.getEmail()), user.getName(), user.getEmail()); }

  public record Credentials(@Email @NotBlank String email, @NotBlank String password) {}
  public record AuthResponse(String token, String name, String email) {}
}
