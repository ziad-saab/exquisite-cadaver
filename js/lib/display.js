var retrieval = require('./retrieval.js')
var _ = require("underscore")
var $app = $('#app');
var $buttons = $('#buttons');


//This function creates the header in each view 
var $header = $('#header');
function createHeader(options) {
    $header.html('');
    var entryTemplateText = require('raw!../views/header.ejs');
    var template = _.template( entryTemplateText );
    var compiledTemplate = template();
    $header.append(compiledTemplate);
}

//This function creates the footer in each view
var $footer = $('#footer');
function createFooter(options) {
    $footer.html('');
    var entryTemplateText = require('raw!../views/footer.ejs');
    var template = _.template( entryTemplateText );
    var compiledTemplate = template();
    $footer.append(compiledTemplate);
}

//This function deploys the layout
var $layout = $('.aboutTheProjectAndRules hide');
function deployingLayout() {
    $layout.html('');
    var entryTemplateText = require('raw!../views/layout.ejs')
    var template = _.template( entryTemplateText );
    var compiledTemplate = template();
    $layout.append(compiledTemplate);
}
  

//This function permits users to write the first line of a new story:
function createStory() {
    return $.getJSON(retrieval.API_URL + 'Stories').then(
        function(result) {
            var newStoryId = (result.length + 1);
            
            $buttons.html('');
            $app.html('');
            createHeader();
            
            $app.append('<a href="#"><button> Back to Main Menu </button></a>');
            $app.append("<h3>How long will this story be?</h3>");
            $app.append('<form><div class="row"><div class="large-12 columns"><label>(Compulsory)</label><input type="radio" name="lines" value="10" id="ten"><label for="ten">10 Lines</label><input type="radio" name="lines" value="15" id="fifteen"><label for="fifteen">15 Lines</label><input type="radio" name="lines" value="20" id="twenty"><label for="twenty">20 Lines</label></div></div></form>');
            $app.append("<h3>Write the story's first line below:</h3>");
            $app.append('<form><div class="row"><div class="large-12 columns"><label>You are writing line 1</label><input type="text" placeholder="Go crazy!" /></div></div></form>');
            $app.append('<a href="#choice"><button >Submit line</button>');
            
            createFooter();
            
            //ajax function here
        }
    );
}

//The ajax function that's triggered when the button in createStory is clicked
function submitLineNewStory() {
    console.log('Hello from submitLineNewStory()?');
}


//This function returns the completed stories in desc order of rating, a certain number per page
function seeCompletedStories(pageNum) {
    $buttons.html('');
    $app.html(''); 
    createHeader();
    
    $app.append('<a href="#"><button> Back to Main Menu </button></a>');
    $app.append("<h3>All stories, descending order of rating:</h3>");
    retrieval.getStoriesByRating(pageNum).then(
       function(object) {
           var result = object.arrayOfStories;
           var hasNextPage = object.hasNextPage;
           
           result.forEach(function(story){
                var id = story.id;
                retrieval.getStoriesLines(story).then(
                function(lines) {
                    $app.append("<h2>Story #" + id + "</h2>");
                    $app.append('<ul class="no-bullet">');
                    lines.forEach(function(line){
                        $app.append("<li>" + line.lineText + "</li>");
                    });
                });
            });
            
            $app.append("</ul>");
            return hasNextPage;
       } 
    ).then(
        function(hasNextPage) {
            //Previous page/next page buttons
            var previousPage = $('<a href="#seeall/p' + (pageNum - 1) + '"><button class="button round">previous page</button></a>');
            var nextPage = $('<a href="#seeall/p' + (pageNum + 1) + '"><button class="button round">next page</button></a>');
    
            //disable first previous page button
            if (pageNum !== 0) {
                $buttons.append(previousPage);
            }
            //disable last next button
            if (hasNextPage === true) {
                $buttons.append(nextPage);
            }    
        }
    );
    createFooter();
}

//This function displays one completed story at random:
function seeCompletedStory(){
    retrieval.getRandomStory().then(
        function(lines){
            var storyId = lines[1].storiesId;
            
            $app.html('');
            $buttons.html('');
            createHeader();
            
            $app.append('<a href="#"><button> Back to Main Menu </button></a>');
            $app.append("<h2>Story #" + storyId + "</h2>");
            $app.append("<h3>One story, at random:</h3>");
            $app.append('<ul class="no-bullet">');
            lines.forEach( function(line) {
                $app.append("<li>" + line.lineText + "</li>");
            });
            $app.append("</ul>");
            $app.append('<a href="#random"><button>Gimme another!</button></a>');
            //will have to make the above a clickon event
        }
    ); 
    createFooter();
}


//This function chooses one incomplete story at random for the user to continue:
function getStoryToContinue() {
    $app.html('');
    $buttons.html('');
    createHeader();
    
    $app.append('<a href="#"><button> Back to Main Menu </button></a>');
    retrieval.getIncompleteStory().then(
        function(object) {
            var exist = object.exist;
            var storyId = object.storyId;
            
            if (exist === false) {
                $app.append('There are no more stories to continue. Why not start a new one?');
            }
            else {
                //gets all the lines from the story randomly chosen above
                retrieval.getLines(storyId).then(
                    function(result) {
                        //gets the last written line of the story to continue
                        var lastLine = result.length;
                        console.log(result[lastLine - 1]);
                        var previousLine = result[lastLine - 1].lineText;
                        
                        $app.append("<h2>Story #" + storyId + "</h2>");
                        $app.append("<h3>Previous Line:</h3>");
                        $app.append("<p>" + previousLine + "</p>");
                        $app.append('<form><div class="row"><div class="large-12 columns"><label>You are writing line ' + (lastLine + 1) + '</label><input type="text" placeholder="Go crazy!" /></div></div></form>');
                        $app.append("<a href='#choice'><button >Submit line</button>");
                        //ajax function here
                    }
                );
            }
        }
    );
    createFooter();
}

//This function gives users some options after completing their line (also the app landing page during dev)

function nextSteps() {
    $buttons.html('');
    $app.html('');
    createHeader();
    // $app.append('<h3>Thanks for your contribution!</h3>');
    $app.append('<h4>What would you like to do now?</h4>');
    $app.append('<a href="#continue"><button>Continue another story</button></a><br/>');
    $app.append('<a href="#create"><button>Create a new story</button></a><br/>');
    $app.append('<a href="#seeall"><button>Rate the other stories</button></a><br/>');
    $app.append('<a href="#random"><button>Read a story at random</button></a><br/>');
    createFooter();
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
