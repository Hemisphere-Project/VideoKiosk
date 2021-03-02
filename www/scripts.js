function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}


var socket = io();

socket.on('tree', function(data) {
    $('#mainframe').empty()

    let content = $('<div>').addClass('menu').appendTo('#mainframe')
    var k = 1

    // topics
    // for (let topic in data[lang]) {
    for (let topic in data) {

        // remove x_ 
        let s = topic
        if (isNumeric(s.split('_')[0])) s = s.split('_')[1]

        // gallery
        let gallery = $('<div>').addClass('gallery gallery-' + k).appendTo('#mainframe')

        // title
        let title = $('<div>').addClass('gallery-title').html(s).appendTo(gallery)

        // back btn
        $('<img>').addClass('gallery-back').attr('src', 'images/back.png').appendTo(title).on('click touchstart', () => {

            $('.gallery').animate({ opacity: 0 }, 300, () => {
                $('.gallery').removeClass('visible')
            })
            $('#menu').addClass('visible')
            $('#menu').animate({ opacity: 1 }, 600)

        })

        // video grid
        for (let video of data[topic]) {
            // remove x_ 
            let nameV = video
            if (isNumeric(nameV.split('_')[0])) nameV = nameV.split('_')[1]
            nameV = nameV.split('.').slice(0, -1).join('.')

            // remove extension
            let baseV = video.split('.').slice(0, -1).join('.')

            // video cell
            var vidCell = $('<div>').addClass('video-cell').appendTo(gallery)

            // video preview
            var vidPrev = $('<div>').addClass('video-preview').appendTo(vidCell)
            $('<img>').addClass('video-snapshot').attr('src', '/media/' + topic + '/' + baseV + '.jpg').appendTo(vidPrev)
            $('<div>').addClass('video-legend').html(nameV.toUpperCase()).appendTo(vidCell)

            // play btn
            $('<img>').addClass('video-play').attr('src', 'images/play.png').appendTo(vidPrev).on('click touchstart', () => {

                // Player
                var vidplayer = $('<video>').addClass("mediaplayer").appendTo('#player')
                $('<source>').attr('src', '/media/' + topic + '/' + video).attr('type', 'video/mp4').appendTo(vidplayer)

                // Close btn
                $('<div>').addClass('close').appendTo('#player').on('click touchstart', () => {
                    vidplayer.trigger('pause')
                    $('#player').animate({ opacity: 0 }, 300, () => {
                        $('#player').removeClass('visible')
                        $('#player').empty()
                    })
                })

                // Progress bar
                var progressbar = $('<div>').addClass('bar')
                $('<div>').addClass('progress').append(progressbar).appendTo('#player')

                // Start
                $('#player').addClass('visible')
                $('#player').animate({ opacity: 1 }, 400, () => {
                    vidplayer.trigger('play')

                    vidplayer.on('timeupdate', () => {
                        const percent = (vidplayer[0].currentTime / vidplayer[0].duration) * 100;
                        progressbar.animate({ 'width': percent + '%' }, 200)
                    });

                    vidplayer.on('ended', () => {
                        $('.close').click()
                    })
                })

            })
        }


        // topic button
        $('<div>').addClass('topic topic-' + k).html(s).appendTo('#menu').on('click touchstart', () => {

            gallery.addClass('visible')
            gallery.animate({ display: 'grid', opacity: 1 }, 1000)

            $('#menu').animate({ opacity: 0 }, 300, () => {
                $('#menu').removeClass('visible')
            })

        })

        k += 1
    }

    // Initial view
    $('#menu').addClass('visible')
    $('.gallery').removeClass('visible')




});


var inactivityTime = function() {
    var timer;

    window.onload = timerReset;
    document.onkeypress = timerReset;
    document.onmousemove = timerReset;
    document.onmousedown = timerReset;
    document.ontouchstart = timerReset;
    document.onclick = timerReset;
    document.onscroll = timerReset;
    document.onkeypress = timerReset;

    function timerElapsed() {
        console.log("Timer elapsed");
        location.reload();
    };

    function timerReset() {
        console.log("Reseting timer");
        clearTimeout(timer);
        timer = setTimeout(timerElapsed, 1 * 10 * 1000); // 1 mins
    }
};
// inactivityTime()