const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');
const progress = document.getElementById('progress');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const albumArt = document.getElementById('album-art'); // Album art element

let songs = [];
let songIndex = 0;

// Fetch songs from the server (or define the song list manually)
async function fetchSongs() {
    try {
        const response = await fetch('/songs');
        songs = await response.json();
        if (songs.length > 0) {
            loadSong(songs[songIndex]);
        }
    } catch (error) {
        console.error('Failed to fetch songs:', error);
    }
}

// Load the song and update album art
function loadSong(song) {
    audio.src = song.src;
    title.innerText = song.title;
    artist.innerText = "Unknown Artist"; // Optional: Set artist info

    // Extract album art from the MP3 file
    jsmediatags.read(song.src, {
        onSuccess: function(tag) {
            const tags = tag.tags;
            if (tags.picture) {
                const image = tags.picture;
                const base64String = arrayBufferToBase64(image.data);
                albumArt.src = `data:${image.format};base64,${base64String}`;
            } else {
                albumArt.src = 'default.jpg'; // Fallback if no image is embedded
            }
        },
        onError: function(error) {
            console.log(error);
            albumArt.src = 'default.jpg'; // Fallback on error
        }
    });
}

// Utility function to convert binary data to base64
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

function playSong() {
    audio.play();
    playBtn.innerText = '⏸️';
}

function pauseSong() {
    audio.pause();
    playBtn.innerText = '▶️';
}

function togglePlayPause() {
    if (audio.paused) {
        playSong();
    } else {
        pauseSong();
    }
}

function nextSong() {
    songIndex = (songIndex + 1) % songs.length;
    loadSong(songs[songIndex]);
    playSong();
}

function prevSong() {
    songIndex = (songIndex - 1 + songs.length) % songs.length;
    loadSong(songs[songIndex]);
    playSong();
}

function updateProgress() {
    if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progress.value = progressPercent;
    }
}

function setProgress(e) {
    const newTime = (e.target.value / 100) * audio.duration;
    audio.currentTime = newTime;
}

// Event Listeners
playBtn.addEventListener('click', togglePlayPause);
nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);
audio.addEventListener('timeupdate', updateProgress);
progress.addEventListener('input', setProgress);

// Fetch songs and load the first one on page load
fetchSongs();