#! /bin/bash


### functions
Help()
{
   echo "create simple react project"
   echo
   echo "Example: ./create-react-app-script.sh <project-name> <options>"
   echo
}


Build () 
{
    #initializing project
    echo "creating react project named $1";
    mkdir ./$1
    cd ./$1
    npm init -y
    # entry point
    mkdir public
    cp $REACT_SCRIPTED_HOME/README.md ./
    cp $REACT_SCRIPTED_HOME/include/index.html ./public
    cp $REACT_SCRIPTED_HOME/include/package.json ./
    # install packages
    npm install 
    # Configuration
    cp $REACT_SCRIPTED_HOME/include/.babelrc ./
    cp $REACT_SCRIPTED_HOME/include/webpack.config.js ./
    # source code hello world
    mkdir ./src
    cp $REACT_SCRIPTED_HOME/include/App.jsx ./src
    cp $REACT_SCRIPTED_HOME/include/index.js ./src
    # to start
    echo "write npm start in project root folder to start server"
    echo "happy hacking :)"
}

Help
no_args="true"
### handeling options
while getopts :h:s:ts: option; do
   case $option in
    h)
        Help 
        exit;;
   esac
   case $option in 
    s)
        Simplify $2
        exit;;
    esac
    case $option in 
    ts)
        TypeScript $2
        exit;;
    esac
    no_args="false"
done
