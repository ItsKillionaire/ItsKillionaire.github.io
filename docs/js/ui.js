// --- UI Logic ---
const contentSections = document.querySelectorAll(".content-section");
const heroSection = document.querySelector(".hero-section");
const siteTitleLink = document.querySelector(".site-title");
const navButtons = document.querySelectorAll(".nav-button");

function showContent(targetId) {
    // Hide hero section
    heroSection.classList.add("hidden");
    heroSection.classList.remove("visible", "fade-in");

    // Hide all content sections
    contentSections.forEach(section => {
        section.classList.add("hidden");
        section.classList.remove("visible", "fade-in");
    });

    // Show the target section
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
        targetSection.classList.remove("hidden");
        // Use a timeout to allow the display property to change before adding the fade-in class
        setTimeout(() => {
            targetSection.classList.add("visible", "fade-in");
        }, 20);
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
    setTimeout(() => {
        heroSection.classList.add("visible", "fade-in");
    }, 20);


    // Hide all content sections
    contentSections.forEach(section => {
        section.classList.add("hidden");
        section.classList.remove("visible", "fade-in");
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


navButtons.forEach(button => {
    button.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = button.getAttribute("href").substring(1);
        showContent(targetId);
    });
});

// --- Close content and return home ---
function handleCloseEvent(e) {
    // Check if a content section is visible
    const aSectionIsVisible = Array.from(contentSections).some(section => section.classList.contains('visible'));

    if (aSectionIsVisible) {
        // If click is outside of the content section, go home
        if (e.type === 'click' && !e.target.closest('.content-section')) {
            goHome();
        }
        // If Escape key is pressed, go home
        if (e.type === 'keydown' && e.key === 'Escape') {
            goHome();
        }
    }
}

document.addEventListener('keydown', handleCloseEvent);
document.body.addEventListener('click', handleCloseEvent);
