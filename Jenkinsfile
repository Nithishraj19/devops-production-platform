pipeline {
    agent any

    stages {

        stage('Docker Build') {
            steps {
                sh 'docker build -t devops-production-platform:jenkins .'
            }
        }

        stage('Run Container') {
            steps {
                sh '''
                    docker rm -f devops-production-platform-test || true

                    docker run -d \
                        --name devops-production-platform-test \
                        -p 3001:3000 \
                        devops-production-platform:jenkins
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    sleep 3
                    docker exec devops-production-platform-test \
                        wget -qO- http://localhost:3000/health
                '''
            }
        }

        stage('Docker Image Check') {
            steps {
                sh 'docker images | grep devops-production-platform'
            }
        }

        stage('Cleanup') {
            steps {
                sh '''
                    docker rm -f devops-production-platform-test || true
                '''
            }
        }
    }
}
