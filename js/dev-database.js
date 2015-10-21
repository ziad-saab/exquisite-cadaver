var Promise = require('bluebird');
var _ = require('underscore');
var $ = require('jquery');
var $app = $('#app');

//Modify this variable after migrating the api to heroku
var API_URL = 'https://exquisite-cadaver-loopback-cathe313.c9.io/api/';

var arrayOfStories = [];

//This function initiates the process of creating a new story:
function createStory(){
    return $.getJSON(API_URL + 'Stories').then(
        function(result) {
            var lastId = result.length;
            
        }
    );
}


//This function returns one completed story at random:
function seeCompletedStories(){
    return $.getJSON(API_URL + 'Stories').then(
        function(result) {
            //collects in an array the ids of the stories that have been completed
            for (var i = 0; i < result.length; i++) {
                if ([i].incomplete === false) {
                    arrayOfStories.push([i].id);
                }
            }
        }
    ).then(
        function(){
            //this will return one of the array's id at random
            var poz = Math.floor(Math.random() * arrayOfStories.length);
            return arrayOfStories[poz];
        }
    ).then(
        function(storyId) {
            //gets all the lines from the story randomly chosen above
            return $.getJSON(API_URL + 'Stories/' + storyId + '/Lines?filter={"fields":"lineText"}');
        }
    ).then(
        function(lines){
            //replace by code that will display lines to the user
            console.log(lines);
            arrayOfStories = [];
        }    
    ).catch(
        function(error) {
            console.log('There was an ' + error);
        }
    );
}


//This function choose one incomplete story at random for the user to continue:
function getStoryToContinue() {
    return $.getJSON(API_URL + 'Stories').then(
        function(result) {
            //collects in an array the ids of the stories that are not complete yet
            for (var i = 0; i < result.length; i++) {
                if ([i].incomplete === true) {
                    arrayOfStories.push([i].id);
                }
            }
        }
    ).then(
        function(){
            //this will return one of the array's id at random
            var poz = Math.floor(Math.random() * arrayOfStories.length);
            return arrayOfStories[poz];
        }
    ).then(
        function(storyId) {
            //gets all the lines from the story randomly chosen above
            return $.getJSON(API_URL + 'Stories/' + storyId + '/Lines');
        }
    ).then(
        function(result) {
            //gets the last written line of the story to continue
            var lastLine = result.length;
            return $.getJSON(API_URL + 'Stories/' + result.id + '/Lines?filter={"where":{"lineNumber":' + lastLine + '},"fields":"lineText"}');
        }    
    ).then(
        function(previousLine) {
            //replace by code that will display line for the user
            console.log(previousLine);
            arrayOfStories = [];
        }
    ).catch(
        function(error) {
            console.log('There was an ' + error);
        }
    );
}


//This function will add the user's new line to the story to be continued:
function addNewLine(){
   $.ajax({ method: 'POST', url: API_URL + "Lines", 
    data: {
        lineNumber: previousLine.lineNumber + 1, //how do we get the previous line's line number?
        date: "CURDATE", // how do we get the current date??
        lineText: userInput, //have to define variable
        storiesId: storiesId //how do we get the story id?
    } 
    }); 
}





