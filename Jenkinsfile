pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t devops-production-platform:jenkins .'
            }
        }

        stage('Docker Image Check') {
            steps {
                sh 'docker images | grep devops-production-platform'
            }
        }
    }
}
