$(document).foundation();

// Button that displays the about-rules layout 

var $layout = $('.aboutTheProjectAndRules');
$('.buttonAbout').click(function(e){
    $layout.removeClass('hide').addClass('show animated slideInUp');
     e.preventDefault();
});

//Button that closes the about-rules layout
$('.buttonAboutClose').click(function(e){
    $layout.removeClass('show animated slideInUp').addClass('animated slideOutDown');
    setTimeout(function() {
        $layout.addClass('hide');
    }, 1000)
    e.preventDefault();
});

var retrieval = require('./lib/display.js');
var Backbone = require('backbone');

var router = Backbone.Router.extend({
    routes: {
        '': 'homePage',
        'create': 'newCadaver',
        'continue': 'continueCadaver',
        'seeall(/p:pageNum)': 'readCadavers',
        'random': 'readCadaver',
        'choice': 'nextSteps'
        // 'ab/addressbooks/:id1(/:pageNum)/entry/:id2': 'showEntry'
    },
    // homePage: function() {
    //     this.navigate('ab', {trigger: true});
    // },
    homePage: function() {
        this.navigate('choice', {trigger: true});
    },
    newCadaver: function() {
        retrieval.createStory();
    },
    continueCadaver: function() {
        retrieval.getStoryToContinue();
    },
    readCadaver: function (){
        retrieval.seeCompletedStory();
    },
    readCadavers: function(pageNum) {
        var storyNb = 5;
        if (pageNum) {
            retrieval.seeCompletedStories(+pageNum, storyNb);
        }
        else {
            retrieval.seeCompletedStories(0);
        }
    },
    nextSteps: function() {
        retrieval.nextSteps();
    }
});

var thisRouter = new router;

thisRouter.on('route: nextSteps');

Backbone.history.start();

