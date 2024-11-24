# To-Do App 📝

A simple To-Do application to help users organize tasks efficiently. This project is built with **Node.js**, **React.js**, and **Next.js** and includes support for **Docker** and **Kubernetes** deployment.

---

## Features ✨

- Add, edit, and delete tasks.
- Mark tasks as complete or pending.
- Responsive design for mobile and desktop.
- Dockerized for easy deployment.
- Kubernetes configuration for scalable deployment.

---

## Getting Started 🚀

### Prerequisites
Before running the app, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16+)
- [Docker](https://www.docker.com/)
- [Kubernetes](https://kubernetes.io/)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Youssefsrasra/to-do-app1.git
   cd to-do-app1
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at http://localhost:3000

## CI/CD Pipeline with Jenkins 🛠️

This project includes a Jenkins pipeline for continuous integration and quality assurance using SonarQube.

### Jenkins Pipeline Script

```groovy
pipeline {
    agent any
    tools {
        jdk 'jdk17'
        nodejs 'node16'
    }
    environment {
        SCANNER_HOME = tool 'sonar-scanner'
        SLACK_CHANNEL = '#your-channel-name' 
        SLACK_CREDENTIALS = 'slack-token-id'
    }
    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }
        stage('Checkout from Git') {
            steps {
                git branch: 'main', url: https://github.com/1Youssefsrasra/to-do-app1'
            }
        }
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonar-server') {
                    sh '''$SCANNER_HOME/bin/sonar-scanner -Dsonar.projectName=to-do-app \
                    -Dsonar.projectKey=to-do-app'''
                }
            }
        }
        stage('Quality Gate') {
            steps {
                script {
                    waitForQualityGate abortPipeline: false, credentialsId: 'Sonar-token'
                }
            }
        }
        stage('Install Dependencies') {
            steps {
                sh "npm install"
            }
        }
 stage('OWASP FS SCAN') {
            steps {
                dependencyCheck additionalArguments: '--scan ./ --disableYarnAudit --disableNodeAudit', odcInstallation: 'DP-Check'
                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
            }
        }
        stage('TRIVY FS SCAN') {
            steps {
                sh "trivy fs . > trivyfs.txt"
            }
        }
        stage("Docker Build & Push"){
            steps{
                script{
                   withDockerRegistry(credentialsId: 'docker', toolName: 'docker'){   
                       sh "docker build --build-arg TMDB_V3_API_KEY=<myapikey> -t to-do-app ."
                       sh "docker tag to-do-app djo1/to-do-app:latest "
                       sh "docker push djo1/to-do-app:latest "
                    }
                }
            }
        }
        stage("TRIVY"){
            steps{
                sh "trivy image djo1/to-do-app:latest > trivyimage.txt" 
            }
        }
        stage('Deploy to container'){
            steps{
                sh 'docker run -d --name to-do-app -p 8081:80 djo1/to-do-app:latest'
            }
        }
    }
    }
 post {
        always {
            script {
                def status = currentBuild.currentResult
                def color = (status == 'SUCCESS') ? 'good' : (status == 'FAILURE') ? 'danger' : 'warning'
                slackSend(
                    channel: env.SLACK_CHANNEL,
                    color: color,
                    message: "*Job Name*: ${env.JOB_NAME}\n*Build Number*: #${env.BUILD_NUMBER}\n*Status*: ${status}\n*Duration*: ${currentBuild.durationString}\n*Build URL*: ${env.BUILD_URL}"
                )
            }
        }
    }
}
```
## Monitoring
    1. Install Prometheus and Grafana:
    2. Set up Prometheus and Grafana to monitor the application.
    
## Kubernetes Deployment:
    1. Create a Kubernetes Cluster with Node Groups
    2. Monitor Kubernetes with Prometheus
    3. Install Node Exporter using Helm
    4. Configure Prometheus to Scrape Metrics
    5. Deploy Application with ArgoCD
