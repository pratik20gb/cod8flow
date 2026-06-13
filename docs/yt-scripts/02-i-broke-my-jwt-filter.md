# Video Script: I Thought My Spring Boot JWT Was Production Ready... It Wasn't (Bug Fix Session)

**Target Length:** 22-28 minutes  
**Thumbnail:** Use the "BROKEN JWT" dramatic one (4.jpg)  
**Title:** I Shipped a Broken JWT Filter in Spring Boot — Here's How I Fixed It Live

## Hook (0:00-0:40)
"Today is not a polished tutorial. 
This is me showing you the **exact bugs** I shipped while implementing JWT in my COD8FLOW project this week.

If you've ever thought 'my auth works on my machine' — this video is for you."

## Story Setup (0:40-4:00)
- Why I'm building in public
- Quick demo of the "working" register that actually didn't protect routes
- Show the 401s that should have worked

## Bug #1: JwtAuthFilter injection failure (4:00-10:00)
- Show the code: `private JwtService jwtService;` (not final)
- @RequiredArgsConstructor doesn't pick it up
- What happens at runtime
- The fix + explanation of Spring injection rules
- Live recompile + test

## Bug #2: DaoAuthenticationProvider not wired with PasswordEncoder (10:00-15:00)
- In SecurityConfig the provider was created but encoder never set
- Why BCrypt comparisons were failing silently or not
- The correct pattern (new provider + setUserDetails + setPasswordEncoder)
- Why many copy-paste tutorials get this wrong

## Bug #3: Minor but painful (entity + config matcher) (15:00-19:00)
- User id field (fixed to UUID)
- Missing leading slash in health matcher
- Refresh token rotation logic gotchas

## The "After" Demo (19:00-24:00)
- Full register → login → use token on protected route → refresh
- Show Postman or curl + mention the frontend is now unblocked
- Honest reflection: "This is why shipping real projects teaches you more than 10 tutorials"

## Lessons & Takeaways (24:00-end)
- List the 3 concrete lessons
- "Always test protected routes immediately"
- "Read the Spring Security reference, not just blogs"
- CTA: Comment your worst auth bug. Subscribe for the rest of the COD8FLOW build.

**Description template, tags, chapters:** Use the ones from the master YT guide.

**Editing notes:** Lots of screen zooms on the buggy lines. Red circles + "BUG" callouts. Fast cuts during the "fix + retest" part.
