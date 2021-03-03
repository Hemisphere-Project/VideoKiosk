var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const { readdirSync } = require('fs')
const fs = require('fs')
const os = require('os')

// Media
var mediapath = "/data/media"
var ext_images = ['jpg', 'jpeg', 'png', 'gif']
var ext_videos = ['mp4']

function isVideo(path) {
    return (ext_videos.indexOf(path.replace(/.*\./, '').toLowerCase()) >= 0)
}

function isImage(path) {
    return (ext_images.indexOf(path.replace(/.*\./, '').toLowerCase()) >= 0)
}

function isMedia(path) {
    return isImage(path) || isVideo(path)
}

// List directories
const getDirectories = source =>
    readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

const getVideos = source =>
    readdirSync(source, { withFileTypes: true })
    .filter(dirent => !dirent.isDirectory())
    .map(dirent => dirent.name)
    .filter(dirent => isVideo(dirent))

function treeList(path) {
    var tree = {}
    for (let c of getDirectories(path))
        tree[c] = getVideos(path + '/' + c)
    return tree
}


// Server
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/www/index.html');
});
app.use(express.static(__dirname + '/www'))
app.use('/media', express.static(mediapath))

// Socketio
io.on('connection', (socket) => {
    console.log('a user connected');

    // Send list
    socket.emit('tree', treeList(mediapath))

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// Go
http.listen(5200, () => {
    console.log('listening on *:5200');
});