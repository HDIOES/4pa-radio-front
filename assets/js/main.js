var position = 0;
var music = new Array(
    { path: '/music/Sora iro Days   Gurren Lagan.mp3', artist: 'TTGL', title: "opening 1", cover: "/assets/cover/H-csaK3Gpb.jpg" },
    { path: '/music/My Dearest 1 op   Guilty Crown.mp3', artist: 'unknown1', title: "retrowave1", cover: "/assets/cover/cg.jpg" },
    { path: '/music/1.mp3', artist: 'Нейромонах Феофан', title: "Светлая русь", cover: "/assets/cover/Neiromonah-Feofan-Moscow-9824.jpg" },
    { path: '/music/MOB CHOIR   99.mp3', artist: 'unknown1', title: "anime2", cover: "/assets/cover/D3Q3iuDW0AAu41L.jpg" },
    { path: '/music/Survivor - BLUE ENCOUNT.m4a', artist: 'unknown1', title: "anime2", cover : "/assets/cover/CQjjPtJUkAAVHxU.jpg" },

)


var buttonsChars = {
    pause: '@',
    play: 'C',
    next: 'A',
    prev: 'B'
}

var audio = new Audio('');
audio.playsinline = true;
var vibrantColor = "#FF9800";
var mutedColor = "#FFF";
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//audio.crossOrigin = "anonymous";
$().ready(function () {

    audio.volume = 0.05;
    $("#volume-range").val(0.05);
    drawingCircle();
    setArtistAndTrack(position);

    function drawPolyline(bands) {
        var drawingCanvas = document.getElementById('circle');
        if (drawingCanvas && drawingCanvas.getContext) {
            var context = drawingCanvas.getContext('2d');
            context.lineWidth = "2";
            let count = 150;
            context.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
            context.strokeStyle = vibrantColor;
            context.beginPath();
            for (let position = 0; position < count; position++) {
                let element = bands[position];
                if (element < 200) {
                    element = element % 100 + 200;
                }
                context.arc(300, 300, element, 0 + (2 * Math.PI / count * position), 0 + (2 * Math.PI / count * (position + 1)), false);
            }
            context.closePath();
            context.stroke();

        }
    }

    function drawProgress(currentTime, duration){
        var drawingCanvas = document.getElementById('progress-circle');
        if (drawingCanvas && drawingCanvas.getContext) {
            var context = drawingCanvas.getContext('2d');
            context.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
            context.strokeStyle = mutedColor;
            context.fillStyle = "rgba(255,255,255, 0.00)";
            context.lineWidth = "10";
            context.beginPath();
            context.arc(300, 300, 196, 0 , Math.PI * 2 / duration * currentTime, false);
        
            context.stroke();
        }
    }

    function drawingCircle(radius = 200, coror = vibrantColor) {
        var drawingCanvas = document.getElementById('circle');
        if (drawingCanvas && drawingCanvas.getContext) {
            var context = drawingCanvas.getContext('2d');
            context.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
            context.strokeStyle = coror;
            context.fillStyle = "rgba(255,255,255, 0.00)";
            context.lineWidth = "2";
            context.beginPath();
            context.arc(300, 300, radius, 0, Math.PI * 2, true);
            context.closePath();
            context.stroke();
        }
    }

    var analyse = function () {

        var AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audio = audio;

        var _that = this;

        //Создание источника
        this.controls = true;
        //Создаем аудио-контекст
        this.context = new AudioContext();
        this.node = this.context.createScriptProcessor(2048, 1, 1);
        //Создаем анализатор
        this.analyser = this.context.createAnalyser();
        this.analyser.smoothingTimeConstant = 0.3;
        this.analyser.fftSize = 512;
        this.bands = new Uint8Array(this.analyser.frequencyBinCount);
        //Подписываемся на событие

        this.audio.addEventListener('canplay', function () {
            if (!_that.source) {
                _that.source = _that.context.createMediaElementSource(_that.audio);

                _that.source.connect(_that.analyser);
                _that.analyser.connect(_that.node);
                _that.node.connect(_that.context.destination);
                _that.source.connect(_that.context.destination);

                _that.node.onaudioprocess = function () {
                    _that.analyser.getByteFrequencyData(_that.bands);
                    if (!_that.audio.paused) {
                        return typeof _that.update === "function" ? _that.update(_that.bands) : 0;
                    }
                };
            }
        })

        return this;
    };



    audio.addEventListener("ended", function () {
        console.log("ended");
        playNext();
    })

    $("#play-button").click(function () {
        if (audio.paused) {
            $(this).html(buttonsChars.pause)
            audio.play();
        } else {
            $(this).html(buttonsChars.play);
            audio.pause();
        }

    })

    $("#play-next").click(function () {
        playNext();
    })

    $("#play-prev").click(function () {
        playPrev();
    })

    $('#volume-range').change(function (sender) {
        let volume = $(this).val() / 100;
        console.log(audio.volume);
        audio.volume = volume;
    })

    $(document).on('input', '#slider', function () {
        $('#slider_value').html($(this).val() / 100);
    });

    
    var elem = new analyse();

    elem.update = function (bands) {
        drawPolyline(bands);
        drawProgress(audio.currentTime, audio.duration);
        console.log( audio.currentTime  );
        console.log( audio.duration);
    }
    

    function playAt(position) {
        if (audio != null) {
            audio.pause();
        }
        var track = music[position];
        audio.src = track.path;
        audio.play();
        $("#play-button").html(buttonsChars.pause)
    }

    function resetColor() {
        vibrantColor = "#FF9800";
        mutedColor = "#FFF";
    }

    function setColors() {
        jQuery('.main-color').css({ color: vibrantColor });

        $("button.main-color").hover(function () {
            $(this).css("color", mutedColor)
        },
            function () {
                $(this).css("color", vibrantColor);
            }
        );
    }

    function setArtistAndTrack(position) {
        var track = music[position];
        audio.src = track.path;
        $("#playing-track-title").html(track.title);
        $("#playing-track-artist").html(track.artist);
        if (track.cover) {
            $("#playing-cover-image").attr("src", track.cover);
            var img = document.getElementById("playing-cover-image");
            img.addEventListener('load', function () {
                var vibrant = new Vibrant(img);
                var swatches = vibrant.swatches()
                vibrantColor = swatches.Vibrant.getHex();
                mutedColor = swatches.Muted.getHex();
                console.log(vibrantColor);
                console.log(swatches);
                setColors();
                drawingCircle();
            });


        } else {
            resetColor();
            setColors();
            $("#playing-cover-image").attr("src", "/assets/svg/music-player.svg");
        }
    }

    function playNext() {
        if (position < music.length - 1) {
            position++;
            setArtistAndTrack(position);
            playAt(position);
        }
    }

    function playPrev() {
        if (position > 0) {
            position--;
            setArtistAndTrack(position);
            playAt(position);
        }
    }

})