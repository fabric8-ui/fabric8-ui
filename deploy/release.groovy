#!/usr/bin/groovy
def ci (){
    stage('build planner npm'){
        container('ui'){
            sh 'npm install'
            sh 'npm run build'
        }
    }

    stage('unit test'){
        container('ui'){
            sh 'npm run test:unit'
        }
    }

    stage('func test'){
        dir('runtime'){
            container('ui'){
                sh '''
        /usr/bin/Xvfb :99 -screen 0 1024x768x24 &
        export API_URL=https://api.prod-preview.openshift.io/api/
        export NODE_ENV=inmemory
        npm install
        ./tests/run_functional_tests.sh smokeTest
'''
            }
        }
    }
}

def ciBuildDownstreamProject(project){
    stage('build fabric8-ui npm'){
        return buildSnapshotFabric8UI{
            pullRequestProject = project
        }
    }
}

def buildImage(imageName){
    stage('build snapshot image'){
        sh "cd fabric8-ui && docker build -t ${imageName} -f Dockerfile.deploy ."
    }

    stage('push snapshot image'){
        sh "cd fabric8-ui && docker push ${imageName}"
    }
}

def cd (b){
    stage('fix git repo'){
        sh './scripts/fix-git-repo.sh'
    }

    stage('build'){
        sh 'npm install'
        sh 'npm run build'
    }

    stage('unit test'){
        sh 'npm run test:unit'
    }

    stage('func test'){
        dir('runtime'){
            container('ui'){
                sh '''
        /usr/bin/Xvfb :99 -screen 0 1024x768x24 &
        export API_URL=https://api.prod-preview.openshift.io/api/
        export NODE_ENV=inmemory
        npm install
        ./tests/run_functional_tests.sh smokeTest
    '''
            }
        }
    }

    stage('release'){
        def published = npmRelease{
            branch = b
        }
        return published
    }
}

def updateDownstreamProjects(v){
    echo 'we would Update Downstream Projects'
    pushPackageJSONChangePR{
        propertyName = 'fabric8-planner'
        projects = [
                'fabric8-ui/fabric8-npm-dependencies'
        ]
        version = v
        containerName = 'ui'
        autoMerge = true
    }
}
return this
