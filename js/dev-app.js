var functions = require('/*source file*/');
var Backbone = require('backbone');

// Add foundation dynamic functionality on page
$(document).foundation();

var router = Backbone.Router.extend({
    routes: {
        'create/:story': 'newCadaver',
        'continue/:story': 'continueCadaver',
        'choose': 'chooseCadaver'
        // 'ab/addressbooks/:id1(/:pageNum)/entry/:id2': 'showEntry'
    },
    // homePage: function() {
    //     this.navigate('ab', {trigger: true});
    // },
    newCadaver: function(story) {
        functions.nameoffunction(+story);
    },
    continueCadaver: function(story) {
        functions.nameoffunction(+story);
    },
    chooseCadaver: function() {
        functions.nameoffunction();
    }
});

var thisRouter = new router;

thisRouter.on('route:chooseCadaver');

Backbone.history.start();
