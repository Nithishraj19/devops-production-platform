pipeline {
    agent any

    environment {
        APP_NAME = 'devops-production-platform'
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Docker Build') {
            steps {
                sh '''
                    docker build \
                        -t ${APP_NAME}:${IMAGE_TAG} \
                        .
                '''
            }
        }

        stage('Run Container') {
            steps {
                sh '''
                    docker rm -f ${APP_NAME}-test || true

                    docker run -d \
                        --name ${APP_NAME}-test \
                        -p 3001:3000 \
                        ${APP_NAME}:${IMAGE_TAG}
                '''
            }
        }

        stage('Application Health Check') {
            steps {
                sh '''
                    sleep 3

                    docker exec ${APP_NAME}-test \
                        wget -qO- http://localhost:3000/health
                '''
            }
        }

        stage('Load Image into Kind') {
            steps {
                sh '''
                    kind load docker-image \
                        ${APP_NAME}:${IMAGE_TAG} \
                        --name devops-platform
                '''
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    kubectl set image \
                        deployment/${APP_NAME} \
                        ${APP_NAME}=${APP_NAME}:${IMAGE_TAG}

                    kubectl rollout status \
                        deployment/${APP_NAME} \
                        --timeout=120s
                '''
            }
        }

        stage('Kubernetes Verification') {
            steps {
                sh '''
                    kubectl get pods \
                        -l app=${APP_NAME}

                    kubectl get deployment ${APP_NAME}
                '''
            }
        }

        stage('Kubernetes Health Check') {
            steps {
                sh '''
                    kubectl run ${APP_NAME}-health-check-${BUILD_NUMBER} \
                        --rm \
                        --restart=Never \
                        --image=${APP_NAME}:${IMAGE_TAG} \
                        --command -- \
                        wget -qO- http://localhost:3000/health
                '''
            }
        }
    }

    post {
        always {
            sh '''
                docker rm -f ${APP_NAME}-test || true
            '''
        }
    }
}
