# Video Script: Spring Boot 3 + Spring Security 6: Complete JWT Authentication with Refresh Tokens (2026)

**Target Length:** 38-45 minutes  
**Thumbnail:** Use generated JWT thumbnail (2.jpg)  
**Title (YouTube):** Spring Boot 3 + Spring Security 6: Complete JWT Authentication with Refresh Tokens (2026)  
**Target SEO keywords:** spring boot jwt, spring boot 3 jwt authentication, jwt refresh token spring boot, spring security 6

## 0. Pre-roll / Hook (0:00 - 0:45)
[Screen: Thumbnail style + upbeat tech music]
"Hey everyone, in this video we're building **production-grade JWT authentication** in Spring Boot 3 — with both access tokens AND refresh tokens, proper stateless security, and the refresh token persisted in PostgreSQL.

Most tutorials stop at the easy access token part. In a real SaaS like the Jira clone I'm building (COD8FLOW), that will break your users.

Today we implement the **full flow**: register, login, protected endpoints, and refresh.

By the end you'll have working `/api/v1/auth/register`, `/login`, and `/refresh` that the React frontend can actually call.

Let's build it the right way."

## 1. Why This Matters + Project Context (0:45 - 3:30)
- Quick recap of COD8FLOW (Jira clone, Java 21 + React + Postgres + Flyway)
- Show current project status from README phases
- Problem with simple JWT tutorials
- Architecture decision: stateless + refresh tokens in DB (show diagram)
- What we'll cover today (list on screen)

## 2. Project & Dependencies Review (3:30 - 6:00)
- Open pom.xml
- Highlight: spring-boot-starter-security, jjwt 0.12.6 (api/impl/jackson), validation, lombok, postgres, flyway
- application.yml JWT config (show secret + expirations)
- Current migrations (V1 users, V2 refresh_tokens)

## 3. Domain: User Entity + Role (6:00 - 10:00)
- Show User.java (explain UUID id, Lombok, timestamps, @Enumerated STRING)
- Show Role enum (ADMIN / MEMBER)
- Small note: defaults added for isActive + role
- Flyway table matches exactly

## 4. JwtService Deep Dive (10:00 - 18:00)
- Open JwtService.java
- Walk through:
  - @Value injections
  - generateAccessToken (with role claim)
  - generateRefreshToken
  - buildToken private method
  - extractEmail, isTokenExpired, extractAllClaims
  - hexToBytes + getSigningKey (important for the hex secret)
- Test mentally: why no "Bearer " handling here (it's in filter)

Live demo tip: Show a quick token generation in a test if time.

## 5. UserDetailsServiceImpl (18:00 - 21:00)
- Simple but critical
- Map our User -> Spring Security User with "ROLE_" prefix
- Explain why "ROLE_MEMBER"

## 6. The JwtAuthFilter + The Bug (21:00 - 28:00)  ← Gold content
- Show the filter code
- Walk the doFilterInternal logic step by step
- **Reveal the bug I shipped**: non-final jwtService field → never injected → NPE
- Show the fix (private final + @RequiredArgsConstructor)
- Re-explain the whole flow now that it works
- SecurityContext population

This segment alone is extremely valuable for viewers.

## 7. SecurityConfig (28:00 - 33:00)
- Public routes: auth/** , health, actuator
- Stateless session
- AuthenticationProvider setup (show the fixed version with setUserDetailsService + setPasswordEncoder)
- PasswordEncoder bean (BCrypt)
- AuthenticationManager bean (for use in service)
- Add filter before UsernamePassword...

## 8. DTOs (quick) + AuthService & Controller (33:00 - 40:00)
- Show RegisterRequest, LoginRequest, AuthResponse, new RefreshRequest
- AuthService interface
- AuthServiceImpl walk-through (register logic, login with AuthenticationManager, refresh + rotation)
- How we persist refresh tokens (delete old, save new)
- AuthController @RestController mappings with @Valid

## 9. End-to-End Test with curl / frontend mention (40:00 - 43:00)
- Run the app (or show successful compile)
- curl register
- curl login → get tokens
- curl protected health with Bearer (show 401 vs success)
- curl refresh
- Tease: Next video will connect the React frontend (Zustand + http interceptor already ready)

## 10. Wrap + CTA (43:00 - end)
- Summary of what we built
- Common pitfalls recap (the 3 we hit: injection, provider config, token table)
- "If you're following along, drop a comment with what you're building"
- Subscribe + "next video: Workspaces & Boards domain"
- Link GitHub, full YT guide in description, playlist

## Chapters / Timestamps (put in description)
00:00 Intro & why refresh tokens
...
(Use the full ones from the guide description template)

**Post-production notes:**
- Chapters in description + spoken
- Cards:  "Watch the bug fix story" if separate video, subscribe, playlist
- End screen with next video
- Pin comment with GitHub link + "Try the /register endpoint yourself"
