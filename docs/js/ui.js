// --- UI Logic ---
const contentSections = document.querySelectorAll(".content-section");
const heroSection = document.querySelector(".hero-section");
const siteTitleLink = document.querySelector(".site-title");
const navButtons = document.querySelectorAll(".nav-button");

function showContent(targetId) {
    heroSection.classList.add("hidden");
    contentSections.forEach(section => section.classList.add("hidden"));
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
        targetSection.classList.remove("hidden");
    }
    navButtons.forEach(button => {
        button.classList.toggle("active", button.getAttribute("href").substring(1) === targetId);
    });
}

function goHome() {
    heroSection.classList.remove("hidden");
    contentSections.forEach(section => section.classList.add("hidden"));
    navButtons.forEach(button => button.classList.remove("active"));
}

siteTitleLink.addEventListener("click", (e) => { e.preventDefault(); goHome(); });

navButtons.forEach(button => {
    button.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = button.getAttribute("href").substring(1);
        showContent(targetId);
    });
});

// --- Close content and return home ---
function handleCloseEvent(e) {
    // Check if a content section is visible and the click is outside of it
    const aSectionIsVisible = Array.from(contentSections).some(section => !section.classList.contains('hidden'));
    if (aSectionIsVisible && !e.target.closest('.content-section') && !e.target.closest('.nav-button')) {
        goHome();
    }
}

document.addEventListener('click', handleCloseEvent);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        goHome();
    }
});

// --- Cursor Glow Effect ---
document.addEventListener("mousemove", function (e) {
    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.body.appendChild(glow);
    const colors = ["purple", "blue", "pink", "green", "yellow"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    glow.style.setProperty("--glow-color", `var(--color-neon-${randomColor})`);
    glow.style.left = e.pageX + "px";
    glow.style.top = e.pageY + "px";
    glow.addEventListener("animationend", () => glow.remove());
});

// --- Button Click Animation ---
document.querySelectorAll(".nav-button").forEach((button) => {
    button.addEventListener("click", function () {
        this.classList.add("clicked");
        setTimeout(() => this.classList.remove("clicked"), 200);
    });
});

// --- Audio Volume Control Visuals ---
window.updateSliderVisuals = (value) => {
    const volumeSlider = document.getElementById('masterVolume');
    const muteButton = document.getElementById('muteButton');
    const sliderTrack = document.querySelector('.volume-slider-track');
    if (!volumeSlider || !muteButton || !sliderTrack) return;

    const muteIcon = muteButton.querySelector('i');
    const min = parseFloat(volumeSlider.min);
    const isMuted = muteButton.classList.contains('muted');
    const percentage = isMuted ? 0 : ((value - min) / (parseFloat(volumeSlider.max) - min)) * 100;

    sliderTrack.style.setProperty('--slider-percentage', `${percentage}%`);

    let glowColor = 'var(--color-neon-blue)';
    if (percentage >= 66) glowColor = 'var(--color-neon-yellow)';
    else if (percentage >= 33) glowColor = 'var(--color-neon-green)';

    sliderTrack.style.setProperty('--glow-color', glowColor);
    volumeSlider.style.setProperty('--glow-color', glowColor);

    if (isMuted || value <= min) {
        muteIcon.className = 'fas fa-volume-xmark';
    } else if (percentage < 50) {
        muteIcon.className = 'fas fa-volume-low';
    } else {
        muteIcon.className = 'fas fa-volume-high';
    }
};

// Set initial visual state of the slider on load
document.addEventListener('DOMContentLoaded', () => {
    const volumeSlider = document.getElementById('masterVolume');
    if(volumeSlider) {
        volumeSlider.value = -60;
        window.updateSliderVisuals(-60);
    }
});
