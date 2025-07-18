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

// --- New Content Switching Logic ---
const contentSections = document.querySelectorAll(".content-section");
const heroSection = document.querySelector(".hero-section");
const siteTitleLink = document.querySelector(".site-title");
const navButtons = document.querySelectorAll(".nav-button");


function showContent(targetId) {
    // Hide hero section
    heroSection.classList.add("hidden");
    // Hide all content sections
    contentSections.forEach(section => {
        section.classList.add("hidden");
    });

    // Show the target section
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
        targetSection.classList.remove("hidden");
    }

    // Update active button
    navButtons.forEach(button => {
        if (button.getAttribute("href").substring(1) === targetId) {
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        }
    });
}

function goHome() {
    // Show hero section
    heroSection.classList.remove("hidden");

    // Hide all content sections
    contentSections.forEach(section => {
        section.classList.add("hidden");
    });

    // Remove active class from all buttons
    navButtons.forEach(button => {
        button.classList.remove("active");
    });
}

siteTitleLink.addEventListener("click", (e) => {
    e.preventDefault();
    goHome();
});

// --- Terminal Logic ---
const terminalInput = document.getElementById("terminalInput");
const terminalOutput = document.getElementById("terminalOutput");
const terminalBody = document.getElementById("terminalBody");

const commands = {
    whoami: `
        <p><strong>Name:</strong> Kevin Mosqueda</p>
        <p><strong>From:</strong> Guadalajara, México</p>
        <p>A passionate developer crafting clean code and elegant solutions, constantly exploring the frontiers of technology.</p>
    `,
    skills: `
        <ul>
            <li>Arch Linux</li>
            <li>Web Design (HTML, CSS)</li>
            <li>JavaScript (Node.js, React)</li>
            <li>Python (Automation, Scripting)</li>
            <li>Bash/Shell Scripting</li>
            <li>Cybersecurity (Beginner)</li>
            <li>Open-source Contributions</li>
        </ul>
    `,
    help: `
        <p>Available commands:</p>
        <ul>
            <li><strong>whoami</strong> - Display my information</li>
            <li><strong>skills</strong> - List my skills</li>
            <li><strong>clear</strong> - Clear the terminal</li>
            <li><strong>help</strong> - Show this help message</li>
        </ul>
    `,
    clear: ""
};

function printToTerminal(content) {
    const output = document.createElement("div");
    output.innerHTML = content;
    terminalOutput.appendChild(output);
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

terminalInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const command = terminalInput.value.trim();
        const output = document.createElement("div");
        output.classList.add("command-output");

        const promptLine = document.createElement("div");
        promptLine.classList.add("prompt-line");
        promptLine.innerHTML = `<span class="prompt-user">guest@k-nexus:</span><span class="prompt-symbol">$&nbsp;</span>${command}`;
        output.appendChild(promptLine);

        if (command in commands) {
            if (command === "clear") {
                terminalOutput.innerHTML = "";
            } else {
                const commandOutput = document.createElement("div");
                commandOutput.innerHTML = commands[command];
                output.appendChild(commandOutput);
            }
        } else {
            const errorOutput = document.createElement("div");
            errorOutput.innerHTML = `<p>Command not found: ${command}</p>`;
            output.appendChild(errorOutput);
        }

        terminalOutput.appendChild(output);
        terminalInput.value = "";
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
});

printToTerminal("<p>Welcome to the Killionaire Nexus terminal.</p><p>Type 'help' to see available commands.</p>");

// --- Snake Game Logic ---
const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("highScore");

const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = {};
let direction = "right";
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let gameOver = false;

highScoreElement.textContent = highScore;

function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)),
        y: Math.floor(Math.random() * (canvas.height / gridSize))
    };
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    direction = "right";
    score = 0;
    scoreElement.textContent = score;
    gameOver = false;
    generateFood();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "#00ff00" : "#00cc00";
        ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize, gridSize);
    }

    ctx.fillStyle = "#ff00aa";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

    if (gameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "40px 'Audiowide', cursive";
        ctx.textAlign = "center";
        ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 20);
        ctx.font = "20px 'Fira Code', monospace";
        ctx.fillText("Press Enter to Restart", canvas.width / 2, canvas.height / 2 + 20);
    }
}

function update() {
    if (gameOver) return;

    const head = { x: snake[0].x, y: snake[0].y };

    switch (direction) {
        case "up":
            head.y--;
            break;
        case "down":
            head.y++;
            break;
        case "left":
            head.x--;
            break;
        case "right":
            head.x++;
            break;
    }

    if (head.x < 0) head.x = canvas.width / gridSize - 1;
    if (head.x >= canvas.width / gridSize) head.x = 0;
    if (head.y < 0) head.y = canvas.height / gridSize - 1;
    if (head.y >= canvas.height / gridSize) head.y = 0;

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver = true;
            if (score > highScore) {
                highScore = score;
                localStorage.setItem("highScore", highScore);
                highScoreElement.textContent = highScore;
            }
            draw(); // Draw one last time to show the game over screen
            return;
        }
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreElement.textContent = score;
        generateFood();
    } else {
        snake.pop();
    }

    draw();
}

document.addEventListener("keydown", (e) => {
    if (gameOver && e.key === "Enter") {
        resetGame();
        return;
    }

    switch (e.key) {
        case "ArrowUp":
            if (direction !== "down") direction = "up";
            break;
        case "ArrowDown":
            if (direction !== "up") direction = "down";
            break;
        case "ArrowLeft":
            if (direction !== "right") direction = "left";
            break;
        case "ArrowRight":
            if (direction !== "left") direction = "right";
            break;
    }
});

generateFood();
setInterval(update, 100);