// --- Tone.js Audio Setup ---
let masterVolume;
let chorus, reverb, sfxSynth, clickSynth;
let audioInitialized = false;
let backgroundMusic;

const initialVolumeDb = -60;
const targetVolumeDb = -6;

function initializeAudio() {
    if (audioInitialized) return;

    masterVolume = new Tone.Volume(initialVolumeDb).toDestination();
    chorus = new Tone.Chorus(4, 2.5, 0.5).connect(masterVolume);
    reverb = new Tone.Reverb({ decay: 5, predelay: 0.1, wet: 0.3 }).connect(chorus);

    sfxSynth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "triangle" },
        envelope: { attack: 0.01, decay: 0.1, sustain: 0.0, release: 0.1 },
        volume: -10,
    }).connect(masterVolume);

    clickSynth = new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 8,
        envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 0.2 },
        volume: -15,
    }).connect(masterVolume);

    audioInitialized = true;
    console.log("Tone.js audio components initialized.");
    setupAudioControls(); // Setup controls after initialization
}

function setupAudioControls() {
    const volumeSlider = document.getElementById('masterVolume');
    const muteButton = document.getElementById('muteButton');
    if (!volumeSlider || !muteButton) return;

    let lastVolumeBeforeMute = targetVolumeDb;

    volumeSlider.addEventListener('input', () => {
        const volumeValue = parseFloat(volumeSlider.value);
        masterVolume.volume.value = volumeValue;
        backgroundMusic.volume = Tone.dbToGain(volumeValue);
        lastVolumeBeforeMute = volumeValue;
        muteButton.classList.remove('muted');
        window.updateSliderVisuals(volumeValue);
    });

    muteButton.addEventListener('click', () => {
        const isMuted = muteButton.classList.toggle('muted');
        const muteIcon = muteButton.querySelector('i');

        if (isMuted) {
            lastVolumeBeforeMute = parseFloat(volumeSlider.value) > initialVolumeDb ? parseFloat(volumeSlider.value) : lastVolumeBeforeMute;
            masterVolume.volume.value = -Infinity;
            backgroundMusic.volume = 0;
            volumeSlider.value = initialVolumeDb;
        } else {
            masterVolume.volume.value = lastVolumeBeforeMute;
            backgroundMusic.volume = Tone.dbToGain(lastVolumeBeforeMute);
            volumeSlider.value = lastVolumeBeforeMute;
        }
        window.updateSliderVisuals(parseFloat(volumeSlider.value));

        muteIcon.classList.add('animated');
        muteIcon.addEventListener('animationend', () => muteIcon.classList.remove('animated'), { once: true });
    });
}

// --- HTML Audio Element for Background Music ---
backgroundMusic = document.createElement("audio");
backgroundMusic.id = "backgroundMusic";
backgroundMusic.src = "https://github.com/ItsKillionaire/ItsKillionaire.github.io/raw/refs/heads/main/docs/assets/crystals_moon.mp3";
backgroundMusic.loop = true;
backgroundMusic.volume = 0;
backgroundMusic.preload = "auto";
document.body.appendChild(backgroundMusic);

// --- Event Listeners ---
document.getElementById("startButton").addEventListener("click", async () => {
    if (Tone.context.state !== "running") {
        await Tone.start();
    }
    initializeAudio();
    try {
        await backgroundMusic.play();
    } catch (error) {
        console.error("Background music playback failed:", error);
    }
    document.getElementById("initialOverlay").classList.add("hidden");

    const volumeSlider = document.getElementById('masterVolume');
    const duration = 1500;
    const startTime = performance.now();

    function animateVolume(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentDb = initialVolumeDb + (targetVolumeDb - initialVolumeDb) * easedProgress;

        masterVolume.volume.value = currentDb;
        backgroundMusic.volume = Tone.dbToGain(currentDb);
        volumeSlider.value = currentDb;
        window.updateSliderVisuals(currentDb);

        if (progress < 1) {
            requestAnimationFrame(animateVolume);
        }
    }
    requestAnimationFrame(animateVolume);
});

// Button Hover SFX
document.querySelectorAll(".nav-button").forEach((button) => {
    button.addEventListener("mouseenter", () => {
        if (!audioInitialized) return;
        sfxSynth.triggerAttackRelease("C5", "16n");
    });
});

// New: System Status Update (Mock Data)
const systemStatusElement = document.getElementById("systemStatus");
let uptimeSeconds = 0;
let activeConnections = 0;
let dataPackets = 0;

function updateSystemStatus() {
    uptimeSeconds++;
    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = uptimeSeconds % 60;

    // Simulate dynamic data
    activeConnections = Math.floor(Math.random() * 10) + 1; // 1 to 10 connections
    dataPackets += Math.floor(Math.random() * 100) + 10; // 10 to 109 packets per second

    systemStatusElement.innerHTML = `
                STATUS: ONLINE | UPTIME: ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")} |
                CONNECTIONS: ${activeConnections.toString().padStart(2, "0")} | DATA TRANSFERRED: ${dataPackets.toLocaleString()} PKTS
            `;
}

// Update status every second
setInterval(updateSystemStatus, 1000);

// Initial call to set status immediately
updateSystemStatus();
