var functions = require('./dev-database.js');
var Backbone = require('backbone');

// Add foundation dynamic functionality on page
$(document).foundation();

var router = Backbone.Router.extend({
    routes: {
        'create': 'newCadaver',
        'continue': 'continueCadaver',
        'choose': 'chooseCadaver',
        'see': 'readCadavers'
        // 'ab/addressbooks/:id1(/:pageNum)/entry/:id2': 'showEntry'
    },
    // homePage: function() {
    //     this.navigate('ab', {trigger: true});
    // },
    newCadaver: functions.createStory(),
    continueCadaver: functions.getStoryToContinue(),
    chooseCadaver: functions.nameoffunction(),
    readCadavers: functions.seeCompletedStories()
});

var thisRouter = new router;

thisRouter.on('route:chooseCadaver');

Backbone.history.start();
