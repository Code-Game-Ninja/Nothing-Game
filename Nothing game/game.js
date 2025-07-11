// NOTHING game main logic

// --- Game State ---
let started = false;
let idleMsgTimeout = null;
let endingMsgTimeout = null;
let pixels = [];
let ambientEnabled = false;
let flickerTimeout = null;
let poeticMsgTimeout = null;
let fiveMinTimer = null;
let clickCount = 0;
let fadeMsgTimeout = null;

// --- DOM Elements ---
const gameContainer = document.getElementById('game-container');
const message = document.getElementById('message');
const fake404 = document.getElementById('fake-404');
const ambientToggle = document.getElementById('ambient-toggle');
const ambientSound = document.getElementById('ambient-sound');
const clickSounds = [
    document.getElementById('click-sound-1'),
    document.getElementById('click-sound-2')
];
const voidSound = document.getElementById('void-sound');
const specialSound = document.getElementById('special-sound');

// --- Overlay Elements ---
const entranceOverlay = document.getElementById('entrance-overlay');
const aboutOverlay = document.getElementById('about-overlay');
const aboutVoidBg = document.getElementById('about-void-bg');
const startBtn = document.getElementById('start-btn');
const entranceSound = document.getElementById('entrance-sound');
const aboutSound = document.getElementById('about-sound');

// --- Void Dots Animation for About Overlay ---
function createVoidDots(num = 18) {
    if (!aboutVoidBg) return;
    aboutVoidBg.innerHTML = '';
    for (let i = 0; i < num; i++) {
        const dot = document.createElement('div');
        dot.className = 'void-dot';
        const left = Math.random() * 100;
        const delay = Math.random() * 8;
        const size = 6 + Math.random() * 10;
        dot.style.left = `${left}vw`;
        dot.style.bottom = `-${size + 10}px`;
        dot.style.width = `${size}px`;
        dot.style.height = `${size}px`;
        dot.style.animationDelay = `${delay}s`;
        aboutVoidBg.appendChild(dot);
    }
}

// --- Utility Functions ---
function fadeMessage(text, duration = 2000) {
    if (fadeMsgTimeout) clearTimeout(fadeMsgTimeout);
    message.textContent = text;
    message.classList.remove('hidden');
    message.style.opacity = '0.85';
    fadeMsgTimeout = setTimeout(() => {
        message.style.opacity = '0';
        setTimeout(() => {
            message.classList.add('hidden');
        }, 1200);
    }, duration);
}
function showMessage(text) {
    message.textContent = text;
    message.classList.remove('hidden');
    message.style.opacity = '0.85';
}
function hideMessage() {
    message.classList.add('hidden');
    message.style.opacity = '0';
}

// --- Pixel Easter Eggs ---
function createPixels() {
    for (let i = 0; i < 40; i++) {
        const pixel = document.createElement('div');
        pixel.className = 'pixel';
        pixel.style.left = `${Math.random() * 100}vw`;
        pixel.style.top = `${Math.random() * 100}vh`;
        gameContainer.appendChild(pixel);
        pixels.push(pixel);
    }
}
function revealRandomPixel() {
    if (pixels.length === 0) return;
    const p = pixels[Math.floor(Math.random() * pixels.length)];
    p.style.background = `hsl(${Math.random()*360}, 30%, 30%)`;
    p.style.opacity = '0.5';
    setTimeout(() => {
        p.style.opacity = '0';
    }, 700);
}

// --- Idle Message ---
function startIdleTimer() {
    if (idleMsgTimeout) clearTimeout(idleMsgTimeout);
    idleMsgTimeout = setTimeout(() => {
        fadeMessage("Are you still there?");
    }, 30000);
}

// --- Ending Message ---
function startFiveMinTimer() {
    if (endingMsgTimeout) clearTimeout(endingMsgTimeout);
    endingMsgTimeout = setTimeout(() => {
        showMessage("Congratulations. You have mastered the art of Nothing.\nNow go do something.");
        setTimeout(resetGame, 7000);
    }, 5 * 60 * 1000);
}

// --- Flicker Effect ---
function flickerScreen() {
    document.body.style.background = 'var(--bg-color-darker)';
    if (flickerTimeout) clearTimeout(flickerTimeout);
    flickerTimeout = setTimeout(() => {
        document.body.style.background = 'var(--bg-color)';
    }, 80);
}

// --- Right Click 404 ---
function showFake404() {
    fake404.classList.add('visible');
    setTimeout(() => {
        fake404.classList.remove('visible');
    }, 1800);
}

// --- Ambient Sound ---
function toggleAmbient() {
    ambientEnabled = !ambientEnabled;
    ambientToggle.textContent = ambientEnabled ? '🔊' : '🔇';
    if (ambientEnabled) {
        ambientSound.currentTime = 0;
        ambientSound.play();
    } else {
        ambientSound.pause();
    }
}

// --- Poetic Messages ---
const poeticMessages = [
    "You found… nothing.",
    "Is this progress?",
    "Sometimes, nothing is everything.",
    "You are still here.",
    "The void notices you.",
    "What are you looking for?",
    "Nothing is happening.",
    "You are part of the void.",
    "Embrace the emptiness.",
    "This is all there is.",
    "You echo in the silence.",
    "The void is patient.",
    "You are not alone in nothingness.",
    "A thought flickers, then fades.",
    "You listen to the silence."
];
function randomPoeticMessage() {
    return poeticMessages[Math.floor(Math.random() * poeticMessages.length)];
}
function maybeShowPoeticMessage() {
    if (poeticMsgTimeout) clearTimeout(poeticMsgTimeout);
    poeticMsgTimeout = setTimeout(() => {
        if (started && Math.random() < 0.4) {
            fadeMessage(randomPoeticMessage(), 1800);
        }
        maybeShowPoeticMessage();
    }, 10000 + Math.random() * 10000);
}

// --- Do Nothing Messages ---
const doNothingMessages = [
    "I said do nothing.",
    "You were told not to.",
    "Why are you clicking?",
    "Let nothing be.",
    "Still searching for something?"
];
function randomDoNothingMessage() {
    return doNothingMessages[Math.floor(Math.random() * doNothingMessages.length)];
}

const escalationMessages = [
    { count: 5, msg: "You really can’t help yourself, can you?" },
    { count: 10, msg: "Persistence in nothingness…" },
    { count: 20, msg: "Still nothing." },
    { count: 50, msg: "You have mastered the art of ignoring instructions." }
];
const secretMessage = "You have discovered the true void. Now, stop.";

function fadeOutAudio(audio, duration = 1200) {
    if (!audio) return;
    const step = 50;
    const initialVolume = audio.volume;
    let t = 0;
    const fade = setInterval(() => {
        t += step;
        audio.volume = Math.max(0, initialVolume * (1 - t / duration));
        if (t >= duration) {
            audio.pause();
            audio.currentTime = 0;
            audio.volume = initialVolume;
            clearInterval(fade);
        }
    }, step);
}

// --- Overlay Logic ---
function showAboutOverlay() {
    entranceOverlay.classList.add('hidden');
    aboutOverlay.classList.remove('hidden');
    fadeOutAudio(entranceSound);
    if (aboutSound) {
        aboutSound.currentTime = 0;
        aboutSound.volume = 0.7;
        aboutSound.play();
    }
}
function showGame() {
    aboutOverlay.classList.add('hidden');
    gameContainer.style.display = 'flex';
    fadeOutAudio(aboutSound);
    init();
}

// Hide game container initially
if (gameContainer) gameContainer.style.display = 'none';

window.addEventListener('DOMContentLoaded', () => {
    // Show entrance overlay, then about overlay after animation or on click
    entranceOverlay.classList.remove('hidden');
    aboutOverlay.classList.add('hidden');
    gameContainer.style.display = 'none';
    // After animation (5.5s), show about overlay
    setTimeout(() => {
        showAboutOverlay();
    }, 5500);
    // Or skip animation on click/tap
    let entranceSoundPlayed = false;
    let entranceSkippable = false;
    function playEntranceSoundOnce() {
        if (!entranceSoundPlayed && entranceSound) {
            entranceSound.currentTime = 0;
            entranceSound.volume = 1;
            entranceSound.play().catch(e => {
                console.log('Entrance sound play error:', e);
            });
            entranceSoundPlayed = true;
        }
    }
    // Play entrance sound on first interaction (if required by browser)
    entranceOverlay.addEventListener('click', playEntranceSoundOnce, { once: true });
    entranceOverlay.addEventListener('touchstart', playEntranceSoundOnce, { once: true });
    entranceOverlay.addEventListener('keydown', playEntranceSoundOnce, { once: true });

    // Only allow skipping entrance after 10 seconds (DISABLED: always wait full 11s)
    // function tryShowAboutOverlay() {
    //     if (entranceSkippable) showAboutOverlay();
    // }
    // entranceOverlay.addEventListener('click', tryShowAboutOverlay);
    // entranceOverlay.addEventListener('touchstart', tryShowAboutOverlay);
    // entranceOverlay.addEventListener('keydown', tryShowAboutOverlay);

    // After 10 seconds, allow user to skip
    setTimeout(() => {
        entranceSkippable = true;
    }, 5000);

    // Automatically show About after 11s if user does nothing
    setTimeout(() => {
        if (entranceSkippable) showAboutOverlay();
    }, 6000);

    // Start game on button click
    if (startBtn) startBtn.addEventListener('click', showGame);
    createVoidDots();
});

// --- Main Game Logic ---
function playSound(sound) {
    if (!ambientEnabled) return;
    try {
        sound.currentTime = 0;
        sound.play();
    } catch (e) {
        console.error('Audio play error:', e);
    }
}
function playRandomClickSound() {
    playSound(clickSounds[Math.floor(Math.random() * clickSounds.length)]);
}
function handleGameClick(e) {
    if (!started) {
        startGame();
        clickCount = 0;
        return;
    }
    startIdleTimer();
    clickCount++;
    if (Math.random() > 0.92) {
        revealRandomPixel();
    }
    // Escalation logic with sound
    let escalated = false;
    for (let i = escalationMessages.length - 1; i >= 0; i--) {
        if (clickCount === escalationMessages[i].count) {
            fadeMessage(escalationMessages[i].msg, 2200);
            playSound(voidSound);
            escalated = true;
            break;
        }
    }
    if (!escalated) {
        if (clickCount === 51) {
            fadeMessage(secretMessage, 3000);
            playSound(specialSound);
            clickCount = 0;
        } else {
            fadeMessage(randomDoNothingMessage(), 1800);
            playRandomClickSound();
        }
    }
}
function handleKey(e) {
    if (!started && (e.code === 'Space' || e.code === 'Enter')) {
        startGame();
        clickCount = 0;
        return;
    }
    if (!started) return;
    if (e.code === 'Space' || e.code === 'Enter') {
        handleGameClick(e);
    } else if (e.key.toLowerCase() === 'm') {
        toggleAmbient();
    }
    if (Math.random() > 0.7) {
        flickerScreen();
    }
    startIdleTimer();
}
function handleContextMenu(e) {
    e.preventDefault();
    if (!started) return;
    showFake404();
    startIdleTimer();
}
function handleTouch(e) {
    e.preventDefault(); // Prevent scrolling/zooming
    handleGameClick(e);
}

function startGame() {
    started = true;
    hideMessage();
    startIdleTimer();
    startFiveMinTimer();
    maybeShowPoeticMessage();
}
function resetGame() {
    started = false;
    showMessage('Click anywhere to begin again');
    if (idleMsgTimeout) clearTimeout(idleMsgTimeout);
    if (endingMsgTimeout) clearTimeout(endingMsgTimeout);
    if (poeticMsgTimeout) clearTimeout(poeticMsgTimeout);
}

function init() {
    createPixels();
    showMessage('Click anywhere to begin');
    gameContainer.addEventListener('click', handleGameClick);
    gameContainer.addEventListener('touchstart', handleTouch, { passive: false });
    document.addEventListener('keydown', handleKey);
    document.addEventListener('contextmenu', handleContextMenu);
    ambientToggle.addEventListener('click', toggleAmbient);
}
 