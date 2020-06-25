var TAG = '[main]';
var clog = console.log;

$(function() {
    clog(TAG + '[starts]');
    $('#div-overlay').animate({
        left: '100%'
    }, 1000, 'easeInOutSine', function() {
        clog('overlay animate completed');
        $('#div-overlay').hide();
        $('header').animate({
            height: '64px'
        }, 1000, function() {
            clog('height animate completed');
            $('body').css('overflow', 'unset');
        });
    });
    clog(TAG + '[ends]');
});