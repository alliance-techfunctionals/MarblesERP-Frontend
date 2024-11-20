pipeline {
    agent any
     environment {
        BRANCH_NAME = "${env.GIT_BRANCH}"  // Use Jenkins built-in variable for branch
        CI = false  
    }
    stages {
        stage('Pull Code') {
            steps {
                script {
                    echo "Branch: ${BRANCH_NAME}"
                     // Pull from the correct branch (dev or master)
                    if (BRANCH_NAME == 'origin/develop' || BRANCH_NAME == 'origin/master') {
                        git branch: "${BRANCH_NAME.replace('origin/', '')}", url: 'https://github.com/alliance-techfunctionals/MarblesERP-Frontend.git', credentialsId: 'df3ecd76-8ee1-4a84-989f-bedac9fd38da'
                    } else {
                        error("Unsupported branch: ${BRANCH_NAME}. Exiting...")
                    }
                }
            }
        }
        stage('Build Application') {
            steps {
                  script {
                    echo "Branch: ${BRANCH_NAME == 'origin/develop'}"
                    if (BRANCH_NAME == 'origin/develop') {
                        sh 'sudo npm install --force; npm run build-dev'
                    } else if (BRANCH_NAME == 'origin/master') {
                        sh 'sudo npm install --force; npm run build-prod'
                    }
                  }
            }
        }
        stage('Deploy Application') {
            steps {
                script {
                  echo "Branch: ${BRANCH_NAME == 'origin/develop'}"
                  if (BRANCH_NAME == 'origin/develop') {
                      sh 'sudo rm -rf /var/www/testartsandlife.atf-labs.com/*'
                      sh 'sudo mv dist/* /var/www/testartsandlife.atf-labs.com/'
                  } else if (BRANCH_NAME == 'origin/master') {
                      sh 'sudo rm -rf /var/www/artsandlife.atf-labs.com/*'
                      sh 'sudo mv dist/* /var/www/artsandlife.atf-labs.com/'
                  }
                }
            }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}