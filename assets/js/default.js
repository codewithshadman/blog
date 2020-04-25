$(function() {
    var offset = $('.floating-header').outerHeight(true) + 10;
    // your current click function
    $('a[href^="#"]').on('click', function(e) {
        var hash = $(this).attr('href');
        if( hash == '#' || hash == '#subscribe') return;
        e.preventDefault();
        window.history.pushState(null, null, $(this).attr('href'));
        $('html, body').animate({
            scrollTop: ($( $(this).attr('href') ).offset().top - offset) + 'px'
        }, 1000, 'swing');
    });

    // *only* if we have anchor on the url
    if(window.location.hash) {
        var hash = $(this).attr('href');
        if( hash == '#' || hash == '#subscribe') return;
        $(window).on('load', function(){
            // smooth scroll to the anchor id
            $('html, body').animate({
                scrollTop: ($(window.location.hash).offset().top - offset) + 'px'
            }, 1000, 'swing');
        });
    }

});