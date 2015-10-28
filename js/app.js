$(document).foundation();

// Button that displays the about-rules layout 
var $layout = $('.aboutTheProjectAndRules');
$('body').on("click", '#bottomButtonAbout', function(e) {
    $layout.removeClass('hide').addClass('show animated slideInUp');
     e.preventDefault();
});

// Button that closes the about-rules layout
$('body').on("click", '.buttonAboutClose', function(e){
    $layout.removeClass('show animated slideInUp').addClass('animated slideOutDown');
    setTimeout(function() {
        $layout.removeClass('animated slideOutDown').addClass('hide');
    }, 1000)
    e.preventDefault();
});

var display = require('./lib/display.js');
var Backbone = require('backbone');

var router = Backbone.Router.extend({
    routes: {
        '': 'homePage',
        'create': 'newCadaver',
        'continue': 'continueCadaver',
        'seeall(/p:pageNum)': 'readCadavers',
        'random': 'readCadaver',
        'choice': 'nextSteps',
        'login': 'login',
        'register': 'register',
        'logout': 'logout',
        'password': 'resetPassword',
        'reset?access_token=:token': 'newPassword'
    },
    homePage: function() {
        this.navigate('choice', {trigger: true});
    },
    newCadaver: function() {
        display.createStory();
    },
    continueCadaver: function() {
        display.getStoryToContinue();
    },
    readCadaver: function (){
        display.seeCompletedStory();
    },
    readCadavers: function(pageNum) {
        var storyNb = 5;
        if (pageNum) {
            display.seeCompletedStories(+pageNum, storyNb);
        }
        else {
            display.seeCompletedStories(0);
        }
    },
    nextSteps: function() {
        display.nextSteps();
    },
    login: function() {
        display.userLogin();
    },
    register: function() {
        display.userReg();
    },
    logout: function() {
        display.userLogout();
    },
    resetPassword: function() {
        display.resetPassword();
    },
    newPassword: function(token) {
        display.newPassword(token);
    }
});

var thisRouter = new router;

thisRouter.on('route: nextSteps');

Backbone.history.start();

