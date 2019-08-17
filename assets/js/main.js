var position = 0;
var music = new Array(
    'https://retrowave.ru/audio/51d453832410d084c34f0b83a7a4251b352f2b94.mp3',
    'https://muzofon-online.com/s-mp3/cs1-69v4.vkuseraudio.net/p20/8588224f3a5e17.mp3',
    'https://muzofon-online.com/s-mp3/cs1-66v4.vkuseraudio.net/p13/94b18829bbf30f.mp3',
    'https://muzofon-online.com/s-mp3/cs1-49v4.vkuseraudio.net/p12/dc4d24220e4f36.mp3'
)

var audio = new Audio('');
$().ready(function () {
    $("#play-button").click(function () {
        if (audio.paused) {
            playAt(position);
        } else {
            audio.pause();
        }

    })

    $("#play-next").click(function () {
        if (position < music.length - 1) {
            position++;
            playAt(position);
        }
    })

    $("#play-prev").click(function () {
        if (position > 0) {
            position--;
            playAt(position);
        }
    })

    $('#volume-range').change(function (sender) {
        let volume = $(this).val() / 100;
        console.log(audio.volume);
        audio.volume = volume;
    })

    $(document).on('input', '#slider', function () {
        $('#slider_value').html($(this).val() / 100);
    });

    function playAt(position) {
        if (audio != null) {
            audio.pause();
        }
        audio.src = music[position];
        audio.play();
    }
})