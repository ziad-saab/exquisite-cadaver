var retrieval = require('./retrieval.js');
var $app = $('#app');
var $buttons = $('#buttons');

//This function permits users to write the first line of a new story:
function createStory() {
    $buttons.html('');
    $app.html('');
    $app.append('<a href="#"><button> Back to Main Menu </button></a>');
    $app.append("<h3>How long will this story be?</h3>");
    $app.append('<form><div class="row"><div class="large-12 columns"><label>(Compulsory)</label><input type="radio" name="nbOfLines" value="10" id="ten"><label for="ten">10 lines</label><input type="radio" name="nbOfLines" value="15" id="fifteen"><label for="fifteen">15 lines</label><input type="radio" name="nbOfLines" value="20" id="twenty"><label for="twenty">20 lines</label></div></div></form>');
    $app.append("<h3>Write the story's first line below:</h3>");
    $app.append('<form><div class="row"><div class="large-12 columns"><label>You are writing line 1</label><input class="newLine" type="text" placeholder="Go crazy!" /></div></div></form>');
    $app.append('<button id="newStory">Submit line</button>');
            
    //The ajax function that's triggered when the button in createStory is clicked
    $('#newStory').on("click", function(){
        var newLine = $('.newLine').val();
        var lineNb = $('*[name=nbOfLines]:checked').val();
        
        if (!newLine || newLine.length < 1) {
            alert("You haven't entered anything!");
        }
        else if (!lineNb || lineNb === undefined ) {
        }
        else {
            $.ajax({method: "POST", url: retrieval.API_URL + 'Stories/newstory', data: {'length': lineNb, 'lineText': newLine}});
            alert("Thanks! Your new story was submitted.");
            window.location.href = "#choice";
        }
        }
    );
}




//This function returns the completed stories in desc order of rating, a certain number per page
function seeCompletedStories(pageNum) {
    $buttons.html('');
    $app.html(''); 
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
}

//This function displays one completed story at random:
function seeCompletedStory(){
    retrieval.getRandomStory().then(
        function(lines){
            var storyId = lines[1].storiesId;
            
            $app.html('');
            $buttons.html('');
            $app.append('<a href="#"><button> Back to Main Menu </button></a>');
            $app.append("<h2>Story #" + storyId + "</h2>");
            $app.append("<h3>One story, at random:</h3>");
            $app.append('<ul class="no-bullet">');
            lines.forEach( function(line) {
                $app.append("<li>" + line.lineText + "</li>");
            });
            $app.append("</ul>");
            $app.append('<button id="randomize">Gimme another!</button>');
            
            $('#randomize').on("click", function(){
                window.location.reload();
            });
        }
    );    
}


//This function chooses one incomplete story at random for the user to continue:
function getStoryToContinue() {
    $app.html('');
    $buttons.html('');
    $app.append('<a href="#"><button> Back to Main Menu </button></a>');
    retrieval.getIncompleteStory().then(
        function(object) {
            var exist = object.exist;
            var storyId = object.storyId;
            var storyLength = object.storyLength;
            console.log(storyLength);
            
            if (exist === false) {
                $app.append('There are no more stories to continue. Why not start a new one?');
            }
            else {
                //gets all the lines from the story randomly chosen above
                retrieval.getLines(storyId).then(
                    function(result) {
                        //gets the last written line of the story to continue
                        var lastLine = result.length;
                        var previousLine = result[lastLine - 1].lineText;
                        $app.append("<h2>Story #" + storyId + "</h2>");
                        $app.append("<h3>Previous Line:</h3>");
                        $app.append("<p>" + previousLine + "</p>");
                        $app.append('<form><div class="row"><div class="large-12 columns"><label>You are writing line ' + (lastLine + 1) + '</label><input class="newLine" type="text" placeholder="Go crazy!" /></div></div></form>');
                        $app.append("<button id='submit'>Submit line</button>");
                        
                        //The ajax function that's triggered when the button is clicked
                        $('#submit').on("click", function(){
                            var newLine = $('.newLine').val();
                            console.log(newLine);
                            
                            if (newLine === undefined || newLine.length < 1) {
                                alert("You haven't entered anything!");
                            }
                            else {
                                $.ajax({method: "POST", url: retrieval.API_URL + 'Lines/newline', data: {'lineNumber': (lastLine + 1), 'storyId': storyId, 'lineText': newLine}});
                                
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
}

//This function gives users some options after completing their line (also the app landing page during dev)

function nextSteps() {
    $buttons.html('');
    $app.html('');
    // $app.append('<h3>Thanks for your contribution!</h3>');
    $app.append('<h4>What would you like to do now?</h4>');
    $app.append('<a href="#continue"><button>Continue another story</button></a><br/>');
    $app.append('<a href="#create"><button>Create a new story</button></a><br/>');
    $app.append('<a href="#seeall"><button>Rate the other stories</button></a><br/>');
    $app.append('<a href="#random"><button>Read a story at random</button></a><br/>');
}

module.exports = {
    'createStory': createStory,
    'seeCompletedStories': seeCompletedStories,
    'seeCompletedStory': seeCompletedStory,
    'getStoryToContinue': getStoryToContinue,
    'nextSteps': nextSteps
};
