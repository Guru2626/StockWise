# Build stage
FROM eclipse-temurin:17-jdk AS build
WORKDIR /app

# Install Maven
RUN apt-get update && apt-get install -y maven

# Copy the pom.xml and install dependencies
COPY pom.xml .
RUN mvn -q -B dependency:go-offline

# Copy the source code and build the project
COPY src ./src
RUN mvn -q -B -DskipTests package

# Run stage
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy the app.jar from the build stage to the final stage
COPY --from=build /app/target/app.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
