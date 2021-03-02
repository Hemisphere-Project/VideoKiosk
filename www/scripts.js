function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}


var socket = io();

socket.on('tree', function(data) {
    $('#mainframe').empty()

    var firstL = false

    // lang menu bar
    var language = $('<div>').addClass('lang-menu').appendTo('#mainframe')

    for (let lang in data) {

        // remove x_ 
        let l = lang
        if (isNumeric(l.split('_')[0])) l = l.split('_')[1]

        if (firstL === false) firstL = l

        // lang button
        $('<div>').addClass('lang-btn lang-btn-' + l).html(l.toUpperCase()).appendTo(language).on('click touchstart', () => {
            //select lang
            $('.gallery').hide()
            $('.menu-content').hide()
            $('.menu-content-' + l).show()
        })

        // lang content
        let content = $('<div>').addClass('menu-content menu-content-' + l).appendTo('#mainframe')
        var k = 1

        // subjects
        for (let subject in data[lang]) {

            // remove x_ 
            let s = subject
            if (isNumeric(s.split('_')[0])) s = s.split('_')[1]

            // gallery
            let gallery = $('<div>').addClass('gallery gallery-' + l + '-' + k).appendTo('#mainframe')

            // title
            let title = $('<div>').addClass('gallery-title').html(s).appendTo(gallery)

            // back btn
            $('<img>').addClass('gallery-back').attr('src', 'images/back.png').appendTo(title)

            // video grid
            for (let video of data[lang][subject]) {
                // remove x_ 
                let nameV = video
                if (isNumeric(nameV.split('_')[0])) nameV = nameV.split('_')[1]
                nameV = nameV.split('.').slice(0, -1).join('.')

                // remove ext
                let baseV = video.split('.').slice(0, -1).join('.')

                // video cell
                var vidCell = $('<div>').addClass('video-cell').appendTo(gallery)

                // video preview
                var vidPrev = $('<div>').addClass('video-preview').appendTo(vidCell)
                $('<img>').addClass('video-snapshot').attr('src', '/media/' + lang + '/' + subject + '/' + baseV + '.jpg').appendTo(vidPrev)
                $('<img>').addClass('video-play').attr('src', 'images/play.png').appendTo(vidPrev)
                $('<div>').addClass('video-legend').html(nameV.toUpperCase()).appendTo(vidCell)
            }


            // subject button
            $('<div>').addClass('subject subject-' + k).html(s).appendTo(content).on('click touchstart', () => {
                $('.menu-content').hide()
                $('.gallery').hide()
                gallery.show()
            })

            k += 1
        }
    }

    // show first lang
    if (firstL !== false) $('.lang-btn-' + firstL).click()

    return;
    for (let m of data) {
        console.log(m)
        if (m[1] == 'image') {
            var img = $('<img />').addClass("media").attr('src', '/media/' + m[0])
            $('<div>').addClass('carousel-cell').append(img).appendTo('#alldivs')
        } else if (m[1] == 'video') {
            var video = $('<video>').addClass("media")
            $('<source>').attr('src', '/media/' + m[0]).attr('type', 'video/mp4').appendTo(video)
            $('<div>').addClass('carousel-cell').append(video).appendTo('#alldivs')
        }

    }


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