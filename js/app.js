var functions = require('./lib/dev-database.js');
var Backbone = require('backbone');

$(document).foundation();

$('.buttonAbout').click(function(e){
     e.preventDefault();
     $('.about-rules').show();
});

$('.buttonClose').click(function(e){
    e.preventDefault();
    $('.about-rules').hide();
});

var router = Backbone.Router.extend({
    routes: {
        'create': 'newCadaver',
        'continue': 'continueCadaver',
        'seeall': 'readCadavers',
        'random': 'readCadaver',
        'thanks': 'nextSteps'
        // 'ab/addressbooks/:id1(/:pageNum)/entry/:id2': 'showEntry'
    },
    // homePage: function() {
    //     this.navigate('ab', {trigger: true});
    // },
    newCadaver: functions.createStory(),
    continueCadaver: functions.getStoryToContinue(),
    readCadavers: functions.seeCompletedStories(),
    readCadaver: functions.seeCompletedStory(),
    nextSteps: functions.nextSteps()
});

// functions.getStoryToContinue;

var thisRouter = new router;

// thisRouter.on();

Backbone.history.start();
