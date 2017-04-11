#!/usr/bin/groovy
def ci (){
    stage('build planner npm'){
        sh 'npm install'
        sh 'npm run build'
    }

    stage('unit test'){
        sh './run_unit_tests.sh'
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
        sh './fix-git-repo.sh'
    }

    stage('build'){
        sh 'npm install'
        sh 'npm run build'
    }

    stage('unit test'){
        sh './run_unit_tests.sh'
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