pipeline {
    agent any

    tools {
        maven 'Maven3'
        jdk 'Java17'
        nodejs 'Node18'
    }

    environment {
        BRANCH = "main"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: "${BRANCH}",
                    url: 'https://github.com/DikshantInsightaccount/PetFriendly.git'
            }
        }

        // ---------------- BUILD BACKEND ----------------

        stage('Build Backend Services') {
            steps {
                script {
                    def services = [
                        "AuthService",
                        "VetService",
                        "api-gateway",
                        "appointment-service",
                        "chatbotbackend",
                        "eureka-server",
                        "petservice",
                        "visitservice"
                    ]

                    for (service in services) {
                        dir(service) {
                            bat 'mvn clean install -DskipTests'
                        }
                    }
                }
            }
        }

        // ---------------- BUILD FRONTEND ----------------

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                    bat 'npm run build'
                }
            }
        }

        // ---------------- START BACKEND ----------------

        stage('Start Backend Services') {
            steps {
                script {
                    def services = [
                        "eureka-server",
                        "api-gateway",
                        "AuthService",
                        "VetService",
                        "appointment-service",
                        "petservice",
                        "visitservice",
                        "chatbotbackend"
                    ]

                    for (service in services) {
                        dir(service) {
                            bat """
                            start cmd /c "java -jar target\\*.jar"
                            """
                        }
                    }
                }
            }
        }

        // ---------------- ARCHIVE ----------------

        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: '**/target/*.jar', fingerprint: true
                archiveArtifacts artifacts: 'frontend/dist/**', fingerprint: true
            }
        }
    }

    post {
        success {
            echo 'Build & Services Started Successfully!'
        }
        failure {
            echo 'Build Failed!'
        }
    }
}
