// --- Tone.js Audio Setup ---
// Declare variables globally (without 'let' for re-assignment in initializeAudio)
let masterVolume;
let chorus;
let reverb;
// bgSynth and bgLoop are removed as background music is handled by HTML Audio
let sfxSynth;
let clickSynth;
let flickerSynth;

let isMuted = false;
let audioInitialized = false; // Flag to ensure Tone.js audio components are initialized only once

// HTML Audio element for background music (declared globally)
let backgroundMusic;

function initializeAudio() {
    if (audioInitialized) {
    console.log("Audio already initialized. Skipping re-initialization.");
    return;
    }

    // --- Tone.js SFX Setup ---
    // Master volume for Tone.js SFX
    masterVolume = new Tone.Volume(-6).toDestination(); // Initial volume -6dB (~50%)

    // Effects for Vaporwave Vibe (for SFX, not background music)
    chorus = new Tone.Chorus(4, 2.5, 0.5).connect(masterVolume); // Wide, detuned sound
    reverb = new Tone.Reverb({ decay: 5, predelay: 0.1, wet: 0.3 }).connect(
    chorus,
    ); // Ambient space

    // SFX Synths (connected to masterVolume)
    sfxSynth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "triangle" },
    envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.0,
        release: 0.1,
    },
    volume: -10,
    }).connect(masterVolume);

    clickSynth = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 8,
    envelope: {
        attack: 0.001,
        decay: 0.4,
        sustain: 0.01,
        release: 0.2,
    },
    volume: -15,
    }).connect(masterVolume);

    flickerSynth = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: {
        attack: 0.001,
        decay: 0.05,
        sustain: 0.0,
        release: 0.05,
    },
    }).connect(masterVolume); // Removed explicit volume from flickerSynth as it's very subtle

    audioInitialized = true; // Set flag to true after initialization
    console.log("Tone.js audio components initialized.");
}

// --- HTML Audio Element for Background Music ---
// Create the HTML Audio element here, but don't play it until user interaction
backgroundMusic = document.createElement("audio");
backgroundMusic.id = "backgroundMusic";
backgroundMusic.src =
    "https://github.com/ItsKillionaire/ItsKillionaire.github.io/raw/refs/heads/main/docs/assets/crystals_moon.mp3"; // VERIFIED PATH
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5; // 50% volume (0.0 to 1.0)
backgroundMusic.preload = "auto"; // Preload for faster start
document.body.appendChild(backgroundMusic); // Add to DOM

// --- Event Listeners ---

// Initial Interaction Overlay to start AudioContext and play background music
document
    .getElementById("startButton")
    .addEventListener("click", async () => {
    console.log("Start button clicked. Attempting to start audio...");

    // Initialize Tone.js SFX components
    initializeAudio();

    // Start HTML Audio for background music
    try {
        await backgroundMusic.play();
        console.log("Background music started.");
    } catch (error) {
        console.error("Failed to play background music:", error);
        // Handle autoplay policy issues if needed
    }

    // Start Tone.js AudioContext for SFX if not running
    if (Tone.context.state !== "running") {
        await Tone.start();
        console.log("Tone.js AudioContext state:", Tone.context.state);
    }

    document.getElementById("initialOverlay").classList.add("hidden");
    document.querySelector(".content-sections").classList.remove("hidden");
    // Update volume slider to reflect HTML audio volume
    // Note: Tone.gainToDb(backgroundMusic.volume) converts 0-1 range to dB for slider
    document.getElementById("masterVolume").value = Tone.gainToDb(
        backgroundMusic.volume,
    );
    console.log(
        "Master volume slider value set to:",
        document.getElementById("masterVolume").value,
    );
    });

// Master Volume Control (now controls both Tone.js and HTML Audio)
document.getElementById("masterVolume").addEventListener("input", (e) => {
    // Check if masterVolume (Tone.js object) is initialized
    if (!audioInitialized || !masterVolume) return;

    const volumeDb = parseFloat(e.target.value);
    masterVolume.volume.value = volumeDb; // Controls Tone.js SFX
    backgroundMusic.volume = Tone.dbToGain(volumeDb); // Controls HTML Audio

    console.log(
    "Volume slider changed to:",
    volumeDb,
    "dB. HTML Audio volume:",
    backgroundMusic.volume,
    );

    if (isMuted && volumeDb > -60) {
    isMuted = false;
    document.getElementById("muteButton").textContent = "Mute";
    }
});

// Mute/Unmute Button (now controls both Tone.js and HTML Audio)
document.getElementById("muteButton").addEventListener("click", () => {
    // Check if masterVolume (Tone.js object) is initialized
    if (!audioInitialized || !masterVolume) return;

    if (isMuted) {
    const currentSliderValue = parseFloat(
        document.getElementById("masterVolume").value,
    );
    masterVolume.volume.value = currentSliderValue; // Unmute Tone.js
    backgroundMusic.volume = Tone.dbToGain(currentSliderValue); // Unmute HTML Audio
    document.getElementById("muteButton").textContent = "Mute";
    console.log(
        "Unmuted. Volume:",
        currentSliderValue,
        "dB. HTML Audio volume:",
        backgroundMusic.volume,
    );
    // Ensure Tone.js Transport is started if it was stopped
    if (Tone.Transport.state !== "started") {
        Tone.Transport.start();
    }
    if (backgroundMusic.paused) {
        // Resume HTML audio if paused
        backgroundMusic.play();
    }
    } else {
    masterVolume.volume.value = -Infinity; // Mute Tone.js
    backgroundMusic.volume = 0; // Mute HTML Audio
    document.getElementById("muteButton").textContent = "Unmute";
    console.log("Muted.");
    // Stop Tone.js Transport when muted to prevent "start time" errors if trying to restart
    if (Tone.Transport.state === "started") {
        Tone.Transport.stop();
    }
    if (!backgroundMusic.paused) {
        // Pause HTML audio if playing
        backgroundMusic.pause();
    }
    }
    isMuted = !isMuted;
});

// Button Hover SFX
document.querySelectorAll(".nav-button").forEach((button) => {
    button.addEventListener("mouseenter", () => {
    if (!audioInitialized) return;
    sfxSynth.triggerAttackRelease("C5", "16n");
    });
    button.addEventListener("mouseleave", () => {
    // Optional: subtle sound on mouse leave
    });
    // Add click effect
    button.addEventListener("click", (e) => {
        e.preventDefault();
        if (!audioInitialized) return;
        button.classList.add("clicked");
        clickSynth.triggerAttackRelease("C4", "32n"); // Play click SFX on button click
        button.addEventListener(
            "animationend",
            () => {
            button.classList.remove("clicked");
            },
            { once: true },
        );
        const targetId = button.getAttribute("href").substring(1);
        showContent(targetId);
    });
});

// Neon Flickering SFX (synced with CSS animation iteration)
const siteTitle = document.getElementById("siteTitle");
siteTitle.addEventListener("animationiteration", () => {
    if (!audioInitialized) return;
    // Play a subtle flicker sound occasionally or on every iteration
    if (Math.random() < 0.5) {
    // Adjust probability for desired frequency
    flickerSynth.triggerAttackRelease("8n");
    }
});

// General Click SFX (matching cursor trail)
document.body.addEventListener("click", (e) => {
    if (!audioInitialized) return;
    // Check if the click was on a nav button (or a child of one)
    let isNavButton = false;
    let targetElement = e.target;
    while (targetElement != null) {
    if (
        targetElement.classList &&
        targetElement.classList.contains("nav-button")
    ) {
        isNavButton = true;
        break;
    }
    targetElement = targetElement.parentElement;
    }

    // Only play general click SFX if not on a nav button
    if (!isNavButton) {
    clickSynth.triggerAttackRelease("C4", "32n"); // A subtle pop sound
    }
});

// Cursor Glow Effect (from previous version)
document.addEventListener("mousemove", function (e) {
    const cursorGlow = document.createElement("div");
    cursorGlow.className = "cursor-glow";
    document.body.appendChild(cursorGlow);

    cursorGlow.style.left = e.clientX + "px";
    cursorGlow.style.top = e.clientY + "px";

    cursorGlow.style.setProperty(
    "--glow-color",
    `var(--color-neon-${["purple", "blue", "pink", "green", "yellow"][Math.floor(Math.random() * 5)]})`,
    );

    setTimeout(() => {
    cursorGlow.remove();
    }, 500);
});

// Ensure audio context is resumed on any interaction if suspended (mobile browsers)
document.body.addEventListener("touchstart", async () => {
    if (!audioInitialized) initializeAudio(); // Initialize if not already
    if (Tone.context.state !== "running") await Tone.start();
    if (backgroundMusic.paused) backgroundMusic.play(); // Play HTML audio
    // Tone.Transport is handled by mute/unmute, no need to force start here
});
document.body.addEventListener("mousedown", async () => {
    if (!audioInitialized) initializeAudio(); // Initialize if not already
    if (Tone.context.state !== "running") await Tone.start();
    if (backgroundMusic.paused) backgroundMusic.play(); // Play HTML audio
    // Tone.Transport is handled by mute/unmute, no need to force start here
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