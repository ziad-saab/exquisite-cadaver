$(document).foundation();

 
$('.buttonAbout').click(function(e){
     e.preventDefault();
     $('.about-rules').show()
});

$('.buttonClose').click(function(e){
    e.preventDefault();
    $('.about-rules').hide()
})
