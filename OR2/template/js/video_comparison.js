document.addEventListener('DOMContentLoaded', function() {
    var videos = document.querySelectorAll('.video');
    videos.forEach(function(video) {
        resizeAndPlay(video);
    });
});

function resizeAndPlay(element) {
    var cv = document.getElementById(element.id + "Merge");
    var vid = element;

    vid.addEventListener('loadedmetadata', function() {
        cv.width = vid.videoWidth / 2; 
        cv.height = vid.videoHeight;

        vid.play();
        vid.style.display = 'none';

        playVids(vid.id);
    });
}

function playVids(videoId) {
    var videoMerge = document.getElementById(videoId + "Merge");
    var vid = document.getElementById(videoId);

    var position = 0.5;
    var mergeContext = videoMerge.getContext("2d");

    function trackLocation(e) {
        var bcr = videoMerge.getBoundingClientRect();
        position = ((e.pageX - bcr.x) / bcr.width);
        position = Math.min(Math.max(position, 0), 1);
    }

    function trackLocationTouch(e) {
        var bcr = videoMerge.getBoundingClientRect();
        position = ((e.touches[0].pageX - bcr.x) / bcr.width);
        position = Math.min(Math.max(position, 0), 1);
    }

    videoMerge.addEventListener("mousemove",  trackLocation, false); 
    videoMerge.addEventListener("touchstart", trackLocationTouch, false);
    videoMerge.addEventListener("touchmove",  trackLocationTouch, false);

    function drawLoop() {
        var canvasWidth = videoMerge.width;
        var canvasHeight = videoMerge.height;

        var vidWidth = vid.videoWidth;
        var vidHeight = vid.videoHeight;

        if (vidWidth === 0 || vidHeight === 0) {
            requestAnimationFrame(drawLoop);
            return;
        }

        mergeContext.clearRect(0, 0, canvasWidth, canvasHeight);

        mergeContext.drawImage(
            vid,
            0, 0, vidWidth / 2, vidHeight,
            0, 0, canvasWidth, canvasHeight
        );

        mergeContext.save();
        mergeContext.beginPath();
        mergeContext.rect(canvasWidth * position, 0, canvasWidth * (1 - position), canvasHeight);
        mergeContext.closePath();
        mergeContext.clip();

        mergeContext.drawImage(
            vid,
            vidWidth / 2, 0, vidWidth / 2, vidHeight,
            0, 0, canvasWidth, canvasHeight
        );

        mergeContext.restore();

        mergeContext.beginPath();
        mergeContext.moveTo(canvasWidth * position, 0);
        mergeContext.lineTo(canvasWidth * position, canvasHeight);
        mergeContext.strokeStyle = "#AAAAAA";
        mergeContext.lineWidth = 5;            
        mergeContext.stroke();

        requestAnimationFrame(drawLoop);
    }

    vid.addEventListener('play', function() {
        requestAnimationFrame(drawLoop);
    }, false);
}

