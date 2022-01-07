import groovy.json.JsonSlurper
pipeline{
    agent any
        stages{
            stage('SCM Checkout'){
                steps{
                    git branch: 'hotfix', credentialsId: 'GitHubCredentials', url: 'https://github.com/sunaiddetho/nodejs-test-unittest-declarative'
            }}
            stage('Deploy Docker'){
                steps{
                    script{
                        sh "docker build -t sunaiddetho/nodejs-test:1.0.0 ."
                        sh "docker rm -f nodejs-test || true"
                        sh "docker run --restart always -p 8001:8001 -d --name nodejs-test --hostname avanza-nodejs-test sunaiddetho/nodejs-test:1.0.0"
                        sh 'sleep 10'
            }}}
            stage('Unit Test'){
                steps {
                    script {
                        def RES = httpRequest 'http://avanza-nodejs-test:8001'

                    if ( "${RES}" == "Status: 200" ) {
                        stage('Echo API Test'){
                            
                                script {
                                    def response = httpRequest 'http://avanza-nodejs-test:8001'
                                    // println('Status: '+response.status)
                                    // println('Response: '+response.content)
                                
                                if ( "${response}" == "Status: 200" ) {
                                    stage('Trigger Ansible') {
                                        ansiblePlaybook become: true, colorized: true, credentialsId: 'rootCredentials', disableHostKeyChecking: true, inventory: 'inventory', playbook: 'ansible/nginx-install.yaml'
                                        // ansiblePlaybook become: true, colorized: true, credentialsId: 'rootCredentials', disableHostKeyChecking: true, inventory: 'inventory', playbook: 'ansible/copy-file.yaml'
                                        // ansiblePlaybook become: true, colorized: true, credentialsId: 'rootCredentials', disableHostKeyChecking: true, inventory: 'inventory', playbook: 'ansible/modify-file.yaml'
            }}}}}}}}  
        }
        post {
            success { 
                emailext mimeType: 'text/html',
                to: 'sunaiddetho@gmail.com,sunaiddetho@hotmail.com',
                subject: "Build '${env.JOB_NAME}' Status: Successfull",
                body: "<h2>BUILD STATUS: ${currentBuild.result}</h2>\
                <table>\
                    <tr> <td> Build Name </td> <td> ${env.JOB_NAME} </td> </tr>\
                    <tr> <td> Build No: </td> <td> ${env.BUILD_NUMBER} </td> </tr>\
                    <tr> <td> Build URL: </td> <td> ${env.BUILD_URL} </td> </tr>\
                    <tr> <td> Build Date: </td> <td> ${env.BUILD_TIMESTAMP} </td> </tr>\
                    <tr> <td> Build Duration: </td> <td> ${currentBuild.durationString} </td> </tr>\
                </table>", attachLog: true
            }
                failure {
                    emailext mimeType: 'text/html',
                    to: 'sunaiddetho@gmail.com,sunaiddetho@hotmail.com',
                    subject: "Build '${env.JOB_NAME}' Status: Failure",
                    body: "<h2>BUILD STATUS: ${currentBuild.result}</h2>\
                        <table>\
                        <tr> <td> Build Name: </td> <td> ${env.JOB_NAME} </td> </tr>\
                        <tr> <td> Build No: </td> <td> ${env.BUILD_NUMBER} </td> </tr>\
                        <tr> <td> Build URL: </td> <td> ${env.BUILD_URL} </td> </tr>\
                        <tr> <td> Build Date: </td> <td> ${env.BUILD_TIMESTAMP} </td> </tr>\
                        <tr> <td> Build Duration: </td> <td> ${currentBuild.durationString} </td> </tr>\
                    </table>", attachLog: true
            }
        }
}
