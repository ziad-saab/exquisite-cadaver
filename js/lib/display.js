var retrieval = require('./retrieval.js')
// var _ = require('underscore');
var $app = $('#app');

//This function initiates the process of creating a new story:

function createStory() {
    console.log("hello from createStory()");
    return $.getJSON(retrieval.API_URL + 'Stories').then(
        function(result) {
            var newStoryId = result.length + 1;
            
            $app.html('');
            $app.append('<a href="#"><button> <<< </button></a>');
            $app.append("<h3>Write the story's first line below:</h3>");
            //input form
            $app.append('<a href="#choice"><button >Submit line</button>');
            //ajax function here
        }
    );
}

function submitLineNewStory() {
    console.log('Hello from submitLineNewStory()?');
}


//This function returns the completed stories in desc order of rating

function seeCompletedStories(pageNum) {
    $app.html(''); 
    $app.append('<a href="#"><button> <<< </button></a>');
    $app.append("<h3>All stories, descending order of rating:</h3>");
    retrieval.getStories(pageNum).then(
       function(object) {
           var result = object.stories;
           var hasNextPage = object.hasNextPage;
           
           result.forEach(function(story){
                var id = story.id;
                $.getJSON(retrieval.API_URL + 'Stories/' + id + '/Lines?filter={"fields":"lineText"}').then(
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
    ).then(
        function(hasNextPage) {
            //Previous page/next page buttons
            var previousPage = $('<a href="#seeall/p' + (pageNum - 1) + '"><button class="button round">previous page</button></a>');
            var nextPage = $('<a href="#seeall/p' + (pageNum + 1) + '"><button class="button round">next page</button></a>');
    
            //disable first previous page button
            if (pageNum !== 0) {
                $app.append(previousPage);
            }
            //disable last next button
            if (hasNextPage === true) {
                $app.append(nextPage);
            }    
        }
    )
}



//This function returns one completed story at random:
function seeCompletedStory(){
    var arrayOfStories = [];
    console.log('hello from seeCompletedStory()!');
    return $.getJSON(retrieval.API_URL + 'Stories').then(
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
            $.getJSON(retrieval.API_URL + 'Stories/' + storyId + '/Lines?filter={"fields":"lineText"}').then(
                function(lines){
                    $app.html('');
                    $app.append('<a href="#"><button> <<< </button></a>');
                    $app.append("<h2>Story #" + storyId + "</h2>");
                    $app.append("<h3>One story, at random:</h3>");
                    $app.append('<ul class="no-bullet">');
                    lines.forEach( function(line) {
                        $app.append("<li>" + line.lineText + "</li>");
                    });
                    $app.append("</ul>");
                    $app.append('<a href="#random"><button>Gimme another!</button></a>');
                    //will have to make the above a clickon event
                });
        }    
    );
}


//This function choose one incomplete story at random for the user to continue:
function getStoryToContinue() {
    var arrayOfStories = [];
    console.log('Hello from getStoryToContinue()!!');
    return $.getJSON(retrieval.API_URL + 'Stories').then(
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
                $app.html('');
                $app.append('<a href="#"><button> <<< </button></a>');
                $app.append("<h3>There are no stories to continue.</h3>");
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
            $.getJSON(retrieval.API_URL + 'Stories/' + storyId + '/Lines').then(
                function(result) {
                    //gets the last written line of the story to continue
                    var lastLine = result.length;
                    $.getJSON(retrieval.API_URL + 'Stories/' + storyId + '/Lines?filter={"where":{"lineNumber":' + lastLine + '},"fields":"lineText"}').then(
                        function(previousLine) {
                            $app.html('');
                            $app.append('<a href="#"><button> <<< </button></a>');
                            $app.append("<h2>Story #" + storyId + "</h2>");
                            $app.append("<h3>Previous Line:</h3>");
                            previousLine.forEach(function(line) {
                                $app.append("<p>" + line.lineText + "</p>");
                            })
                            //append a form line here
                            $app.append("<a href='#choice'><button >Submit line</button>");
                            //ajax function here
                        }    
                    );
                }
            );
        }
    );
}

//This function gives users some options after completing their line (also the app landing page during dev)

function nextSteps() {
    $app.html('');
    // $app.append('<h3>Thanks for your contribution!</h3>');
    $app.append('<h4>What would you like to do now?</h4>');
    $app.append('<a href="#continue"><button>Continue another story</button></a>');
    $app.append('<a href="#create"><button>Create a new story</button></a>');
    $app.append('<a href="#seeall"><button>Rate the other stories</button></a>');
    $app.append('<a href="#random"><button>Read a story at random</button></a>');
}

//This function will add the user's new line to the story to be continued:
// function addNewLine(){
//   $.ajax({ method: 'POST', url: API_URL + "Lines", 
//     data: {
//         lineNumber: previousLine.lineNumber + 1, //how do we get the previous line's line number?
//         date: "CURDATE", 
//         lineText: userInput, //have to define variable
//         storiesId: storiesId //how do we get the story id?
//     } 
//     }); 
// }

module.exports = {
    'createStory': createStory,
    'seeCompletedStories': seeCompletedStories,
    'seeCompletedStory': seeCompletedStory,
    'getStoryToContinue': getStoryToContinue,
    'nextSteps': nextSteps
};
