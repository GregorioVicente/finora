package com.finora.auth;
import io.jsonwebtoken.*; import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value; import org.springframework.stereotype.Service;
import javax.crypto.SecretKey; import java.nio.charset.StandardCharsets; import java.util.Date;
@Service public class JwtService {
  private final SecretKey key; private final long expiration;
  public JwtService(@Value("${finora.jwt-secret}") String secret,@Value("${finora.jwt-expiration-ms}") long expiration){this.key=Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));this.expiration=expiration;}
  public String create(String email){Date now=new Date();return Jwts.builder().subject(email).issuedAt(now).expiration(new Date(now.getTime()+expiration)).signWith(key).compact();}
  public String subject(String token){return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload().getSubject();}
}
