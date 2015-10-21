// var Backbone = require('backbone');
// var _ = require('underscore');
$(document).foundation();
var $app = $('#app');

//Modify this variable after migrating the api to heroku
var API_URL = 'https://exquisite-cadaver-loopback-cathe313.c9.io/api/';



//This function initiates the process of creating a new story:
function createStory() {
    return $.getJSON(API_URL + 'Stories').then(
        function(result) {
            var lastId = result.length;
        }
    );
}


//This function returns the completed stories in desc order of rating

function seeCompletedStories() {
    console.log("hello from seeCompletedStories()");
    //$app.html(''); // Clear the #app div
    return $.getJSON(API_URL + 'Stories?filter={"order":"rating%20DESC"}').then(
        function(result) {
            $app.append("<h3>All stories, descending order of rating:</h3>");
            result.forEach(function(story){
                var id = story.id;
                $.getJSON(API_URL + 'Stories/' + id + '/Lines?filter={"fields":"lineText"}').then(
                function(lines) {
                    $app.append("<h2>Story #" + id + "</h2>");
                    $app.append('<ul class="no-bullet">');
                    lines.forEach(function(line){
                        $app.append("<li>" + line.lineText + "</li>");
                    });
                    $app.append("</ul>");
                });
            });
        }
    );
}



//This function returns one completed story at random:
function seeCompletedStory(){
    var arrayOfStories = [];
    console.log('hello from seeCompletedStory()!');
    return $.getJSON(API_URL + 'Stories').then(
        function(result) {
            //collects in an array the ids of the stories that have been completed
            result.forEach(function(story) {
                if (story.incomplete === false) {
                    arrayOfStories.push(story.id);
                }
            });
        }
    ).then(
        function() {
            //this will return one of the array's id at random
            var poz = Math.floor( Math.random() * arrayOfStories.length );
            return arrayOfStories[poz];
        }
    ).then(
        function(storyId) {
            //gets all the lines from the story randomly chosen above
            $.getJSON(API_URL + 'Stories/' + storyId + '/Lines?filter={"fields":"lineText"}').then(
                function(lines){
                    //$app.html(''); // Clear the #app div
                    $app.append("<h2>Story #" + storyId + "</h2>");
                    $app.append("<h3>One story, at random:</h3>");
                    $app.append('<ul class="no-bullet">');
                    lines.forEach( function(line) {
                        $app.append("<li>" + line.lineText + "</li>");
                    });
                    $app.append("</ul>");
                });
        }    
    );
}


//This function choose one incomplete story at random for the user to continue:
function getStoryToContinue() {
    var arrayOfStories = [];
    console.log('Hello from getStoryToContinue()!!');
    return $.getJSON(API_URL + 'Stories').then(
        function(result) {
            //collects in an array the ids of the stories that are not complete yet
            result.forEach(function(story){
                if (story.incomplete === true) {
                    arrayOfStories.push(story.id);
                }
            });
        }
    ).then(
        function(){
            if (arrayOfStories.length === 0) {
                $app.html(''); // Clear the #app div
                $app.append("<h3>There are no stories to continue. Why not start one!</h3>");
                $app.append("<button><a href='#create'>Start a new story</a></button>");
                return;
            }
            else {
                //this will return one of the array's id at random
                var poz = Math.floor( Math.random() * arrayOfStories.length );
                return arrayOfStories[poz];
            }
        }
    ).then(
        function(storyId) {
            //gets all the lines from the story randomly chosen above
            $.getJSON(API_URL + 'Stories/' + storyId + '/Lines').then(
                function(result) {
                    //gets the last written line of the story to continue
                    var lastLine = result.length;
                    $.getJSON(API_URL + 'Stories/' + storyId + '/Lines?filter={"where":{"lineNumber":' + lastLine + '},"fields":"lineText"}').then(
                        function(previousLine) {
                            //$app.html(''); // Clear the #app div
                            $app.append("<h2>Story #" + storyId + "</h2>");
                            $app.append("<h3>Previous Line:</h3>");
                            previousLine.forEach(function(line) {
                                $app.append("<p>" + line.lineText + "</p>");
                            })
                            //append a form line here
                        }    
                    );
                }
            );
        }
    );
}


//This function will add the user's new line to the story to be continued:
// function addNewLine(){
//   $.ajax({ method: 'POST', url: API_URL + "Lines", 
//     data: {
//         lineNumber: previousLine.lineNumber + 1, //how do we get the previous line's line number?
//         date: "CURDATE", // how do we get the current date??
//         lineText: userInput, //have to define variable
//         storiesId: storiesId //how do we get the story id?
//     } 
//     }); 
// }

module.exports = {
    createStory: createStory(),
    seeCompletedStories: seeCompletedStories(),
    seeCompletedStory: seeCompletedStory(),
    getStoryToContinue: getStoryToContinue()
};
