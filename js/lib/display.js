var retrieval = require('./retrieval.js');
var _ = require("underscore");
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
    var entryTemplateText = require('raw!../views/layout.ejs');
    var template = _.template( entryTemplateText );
    var compiledTemplate = template();
    $layout.append(compiledTemplate);
}
  

//This function permits users to choose the length of a new story:

function createStory() {
    $buttons.html('');
    $app.html('');
    createHeader();
    var entryTemplateText = require('raw!../views/createStoryLength.ejs');
    var template = _.template(entryTemplateText);
    var compiledTemplate = template();
    $app.append(compiledTemplate);
    
    createFooter();
   
    // The function that's triggered when the length button is clicked
    //This function makes appear the form (with the length choosen) where users write the first line of a new story
    $(".length").on('click', function() {
        var numberOfLines = $(this).val();
        var entryTemplateText = require('raw!../views/createStoryText.ejs');
        var template = _.template(entryTemplateText);
        var compiledTemplate = template({'numberOfLines': numberOfLines});
        $app.append(compiledTemplate);
        $('.length').off('click');
        
    
        //The ajax function that's triggered when the button in createStory is clicked
        $('#newStory').on("click", function() {
        var newLine = $('input[class=newLine]').val();
        console.log(newLine);
        
        var userId = 1;
    
        if (!newLine || newLine.length < 1) {
            alert("You haven't entered anything!");
        }
        else {
                $.ajax({method: "POST", url: retrieval.API_URL + 'Stories/newstory', data: {'length': numberOfLines, 'lineText': newLine, 'userId': userId}});
                alert("Thanks! Your new story was submitted.");
                window.location.href = "#choice";
        }
        });
    });
        

}




//This function returns the completed stories in desc order of rating, a certain number per page
function seeCompletedStories(pageNum) {
    $buttons.html('');
    $app.html(''); 
    createHeader();
    
    //This is the basic if we want to implemant a template 
    // var entryTemplateText = require('raw!../views/seeCompletedStories.ejs');
    // var template = _.template(entryTemplateText);
    // var compiledTemplate = template();
    // $app.append(compiledTemplate);
    
    $app.append('<a href="#"><button> Back to Main Menu </button></a>');
    $app.append("<h3>All stories, descending order of rating:</h3>");
    retrieval.getStoriesByRating(pageNum).then(
        function(apiResultObject) {
            var stories = apiResultObject.arrayOfStories;
            var hasNextPage = apiResultObject.hasNextPage;
           
            stories.forEach(function(story){
                var id = story.id;
                var rating = story.rating;
                
                retrieval.getStoriesLines(story).then(
                function(lines) {
                    $app.append("<h2>Story #" + id + "</h2>");
                    $app.append("<img class='downvoting' src='../images/downarrow.png'><img class='upvoting' src='../images/uparrow.png'>");
                    $app.append('<ul class="no-bullet">');
                    lines.forEach(function(line){
                    $app.append("<li>" + line.lineText + "</li>");
                    });
                    console.log(rating);
                    
                    //Voting functions
                    $('.upvoting').on("click", function(){
                        $.ajax({method: "PUT", url: retrieval.API_URL + 'Stories/' + id, data: {'rating': (rating + 1)}});
                        alert("Thanks! Your vote was submitted.");
                        window.location.reload();
                    });
                    
                    $('.downvoting').on("click", function(){
                        $.ajax({method: "PUT", url: retrieval.API_URL + 'Stories/' + id, data: {'rating': (rating - 1)}});
                        alert("Thanks! Your vote was submitted.");
                        window.location.reload();
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
            var entryTemplateText = require('raw!../views/seeCompletedStory.ejs');
            var template = _.template(entryTemplateText);
            var compiledTemplate = template({'lines':lines, 'storyId':storyId});
            $app.append(compiledTemplate);
            
            $('#randomize').on("click", function(){
                window.location.reload();
            });
        }
    ); 
    createFooter();
}


//This function chooses one incomplete story at random for the user to continue:
function getStoryToContinue() {
    $app.html('');
    $buttons.html('');
    createHeader();
    

    
    //$app.append('<a href="#"><button> Back to Main Menu </button></a>');
    retrieval.getIncompleteStory().then(
        function(story) {
            var exist = story.exist;
            var storyId = story.storyId;
            var storyLength = story.storyLength;
            console.log("storyLength =" + storyLength);
            
            if (exist === false) {
                $app.append('There are no more stories to continue. Why not start a new one?');
            }
            else {
                //gets all the lines from the story randomly chosen above
                retrieval.getLines(storyId).then(
                    function(linesOfSelectedStory) {
                        console.log("linesOfSelectedStory = " , linesOfSelectedStory);
                        //gets the last written line of the story to continue
                        var lastLine = linesOfSelectedStory.length;
                        console.log("lastline =" , lastLine);
                        
                        
                        var previousLine = lastLine !== 0? linesOfSelectedStory[lastLine - 1].lineText: 0;
                        console.log("previousLine =" , previousLine);
                        
                        //This creates (with a template) the form to continue the story     
                        var entryTemplateText = require('raw!../views/getStoryToContinue.ejs');
                        var template = _.template(entryTemplateText);
                        var compiledTemplate = template({'previousLine':previousLine, 'linesOfSelectedStory':linesOfSelectedStory, 'storyId':storyId, 'lastLine':lastLine, 'storyLength':storyLength});
                        $app.append(compiledTemplate);
                                        
                     
                        //The ajax function that's triggered when the button is clicked
                        $('#submit').on("click", function(){
                            var newLine = $('.newLine').val();
                            var userId = 1;
                            
                            if (newLine === undefined || newLine.length < 1) {
                                alert("You haven't entered anything!");
                            }
                            else {
                                $.ajax({method: "POST", url: retrieval.API_URL + 'Lines/newline', data: {'lineNumber': (lastLine + 1), 'storyId': storyId, 'lineText': newLine, 'userId': userId }});
                                
                                if (storyLength === (lastLine + 1)) {
                                    $.ajax({method: "PUT", url: retrieval.API_URL + 'Stories/' + storyId, data: {'incomplete': false}});
                                }
                                
                                alert("Thanks! Your new line was submitted.");
                                window.location.href = "#choice";
                            }
                        });    
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
    
    var entryTemplateText = require('raw!../views/nextSteps.ejs');
    var template = _.template(entryTemplateText);
    var compiledTemplate = template();
    $app.append(compiledTemplate);
    // $app.append('<h3>Thanks for your contribution!</h3>');
    
    createFooter();
}

module.exports = {
    'createStory': createStory,
    'seeCompletedStories': seeCompletedStories,
    'seeCompletedStory': seeCompletedStory,
    'getStoryToContinue': getStoryToContinue,
    'nextSteps': nextSteps
};
