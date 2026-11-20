#!/bin/bash
# Starts the Spring Boot backend on JDK 21 using the real database in ./data
cd "$(dirname "$0")" || exit 1
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
exec "ecommerce 2/mvnw" -f "ecommerce 2/pom.xml" spring-boot:run "-Dspring-boot.run.arguments=--spring.datasource.url=jdbc:h2:file:$PWD/data/ecommerce_db"
