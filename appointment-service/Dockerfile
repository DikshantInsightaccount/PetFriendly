FROM amazoncorretto:25-alpine3.22-jdk

WORKDIR /home
ADD target/*.jar app.jar

EXPOSE 8083

ENV SPRING_PROFILES_ACTIVE=docker

CMD ["java", "-jar", "app.jar"]
