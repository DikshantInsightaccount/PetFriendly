pipeline {
    agent any

    tools {
        maven 'maven'
        jdk 'java25'
        nodejs 'NodeJs'
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

        // ---------------- BUILD JAVA BACKEND ----------------

        stage('Build Java Backend Services') {
            steps {
                script {
                    def javaServices = [
                        "AuthService",
                        "VetService",
                        "api-gateway",
                        "appointment-service",
                        "eureka-server",
                        "petservice",
                        "visitservice"
                    ]

                    for (service in javaServices) {
                        dir(service) {
                            bat 'mvn clean install -Dmaven.test.skip=true'
                        }
                    }
                }
            }
        }

        // ---------------- SETUP FLASK ----------------

        stage('Setup Chatbot Backend (Flask)') {
            steps {
                dir('chatbotbackend') {
                    bat '''
                    python -m venv venv
                    venv\\Scripts\\activate
                    pip install -r requirements.txt
                    '''
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

                    // Start Java services (in correct order)
                    def services = [
                        "eureka-server",
                        "api-gateway",
                        "AuthService",
                        "VetService",
                        "appointment-service",
                        "petservice",
                        "visitservice"
                    ]

                    for (service in services) {
                        dir(service) {
                            bat 'start cmd /c "java -jar target\\*.jar"'
                        }
                    }

                    // Start Flask chatbot
                    dir('chatbotbackend') {
                        bat '''
                        start cmd /c "venv\\Scripts\\activate && python app.py"
                        '''
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
