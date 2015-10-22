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




