# ── Stage 1: Build the JAR ──────────────────────────────────────────
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

# Copy Maven wrapper and pom first (so deps are cached if code changes)
COPY .mvn/ .mvn/
COPY mvnw mvnw.cmd pom.xml ./
RUN ./mvnw dependency:go-offline -q

# Copy source and build
COPY src ./src
RUN ./mvnw package -DskipTests -q

# ── Stage 2: Run with minimal JRE ───────────────────────────────────
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]