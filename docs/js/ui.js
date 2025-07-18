// --- UI Logic ---
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
