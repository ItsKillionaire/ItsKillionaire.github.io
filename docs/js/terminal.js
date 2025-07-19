document.addEventListener("DOMContentLoaded", () => {
    const terminalInput = document.getElementById("terminalInput");
    const terminalOutput = document.getElementById("terminalOutput");
    const terminalBody = document.getElementById("terminalBody");

    if (!terminalInput || !terminalOutput || !terminalBody) {
        console.error("Terminal elements not found!");
        return;
    }

    const commands = {
        whoami: `
            <p><strong>User:</strong> guest</p>
            <p><strong>Host:</strong> killionaire-nexus</p>
            <p><strong>Shell:</strong> bash 5.1.16</p>
        `,
        skills: `
            <pre>
+------------------------------------+
| Skills Matrix                    |
+------------------------------------+
| Web Dev      | JS, React, Node.js  |
| Sys Admin    | Arch Linux, Bash    |
| Scripting    | Python, Shell       |
| Cloud        | Docker, AWS (Basic) |
| Cybersecurity| Pentesting (Beginner) |
+------------------------------------+
            </pre>
        `,
        help: `
            <p>K-Nexus Shell, version 1.0.1</p>
            <p>Available commands:</p>
            <ul>
                <li><strong>whoami</strong> - Display system information</li>
                <li><strong>skills</strong> - Show skill matrix</li>
                <li><strong>clear</strong> - Clear the terminal screen</li>
                <li><strong>help</strong> - Show this help message</li>
                <li><strong>exit</strong> - Close the terminal</li>
            </ul>
        `,
        clear: "",
        exit: "",
    };

    function escapeHTML(str) {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

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
            promptLine.innerHTML = `<span class="prompt-user">[guest@k-nexus ~]</span><span class="prompt-symbol">$ </span><span class="prompt-command">${escapeHTML(command)}</span>`;
            output.appendChild(promptLine);

            if (command in commands) {
                if (command === "clear") {
                    terminalOutput.innerHTML = "";
                } else if (command === "exit") {
                    if (typeof goHome === "function") {
                        goHome();
                    }
                } else {
                    const commandOutput = document.createElement("div");
                    commandOutput.innerHTML = commands[command];
                    output.appendChild(commandOutput);
                }
            } else if (command !== "") {
                const errorOutput = document.createElement("div");
                errorOutput.innerHTML = `<p>Command not found: ${escapeHTML(command)}</p>`;
                output.appendChild(errorOutput);
            }

            terminalOutput.appendChild(output);
            terminalInput.value = "";
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    });

    printToTerminal(
        "<p>Last login: Fri Jul 18 14:20:00 2025 on pts/0</p><p>Welcome to the Killionaire Nexus. Type 'help' for a list of commands.</p>",
    );
});
