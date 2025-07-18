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
