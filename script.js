/* ==========================================================================
   MATRIX BACKGROUND DIGITAL RAIN
   ========================================================================== */
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// Cyberpunk/hacking alphabet (binary, hex, characters)
const alphabet = "01010101ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>[]{}/\\*&^%$#@!+-=~";
const fontSize = 14;
const columns = width / fontSize;

const rainDrops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
    // Semi-transparent black to create trailing fade effect
    ctx.fillStyle = 'rgba(7, 8, 12, 0.05)';
    ctx.fillRect(0, 0, width, height);

    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < rainDrops.length; i++) {
        // Random character
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));

        // Color gradient: mostly cyan, with occasional electric purple highlights
        if (Math.random() > 0.97) {
            ctx.fillStyle = '#8b5cf6'; // Electric purple
        } else if (Math.random() > 0.9) {
            ctx.fillStyle = '#10b981'; // Matrix green
        } else {
            ctx.fillStyle = '#00f0ff'; // Cyber cyan
        }

        // x-coordinate = i * fontSize, y-coordinate = rainDrops[i] * fontSize
        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

        // Reset drop to top with random delay once it hits bottom
        if (rainDrops[i] * fontSize > height && Math.random() > 0.975) {
            rainDrops[i] = 0;
        }
        rainDrops[i]++;
    }
}

// Handle resizing dynamically
window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    const newCols = Math.floor(width / fontSize);
    while (rainDrops.length < newCols) rainDrops.push(1);
    if (rainDrops.length > newCols) rainDrops.length = newCols;
});

// Run matrix interval
setInterval(drawMatrix, 33);


/* ==========================================================================
   INTERACTIVE SHELL / TERMINAL
   ========================================================================== */
const terminalInput = document.getElementById('terminal-cmd-input');
const terminalContent = document.getElementById('terminal-content');

const terminalCommands = {
    help: () => `
<div class="text-accent font-bold">ARMSEC TERMINAL CLIENT v1.4.2</div>
<div>Available operations:</div>
<div>  <span class="text-white font-bold">about</span>       - Print dossier profile details</div>
<div>  <span class="text-white font-bold">services</span>    - View engineering & security services</div>
<div>  <span class="text-white font-bold">lab</span>         - Scroll to & trigger simulated virtual sandbox</div>
<div>  <span class="text-white font-bold">discord</span>     - Retrieve Discord server link & join channel</div>
<div>  <span class="text-white font-bold">contact</span>     - View transmission coordinates & PGP details</div>
<div>  <span class="text-white font-bold">clear</span>       - Reset display log history</div>
`,
    about: () => `
<div class="text-comment">// Dossier ID: ARM-7826 // SEC_LEVEL: ALPHA</div>
<div><span class="text-accent font-bold">NAME:</span> Real Elliot</div>
<div><span class="text-accent font-bold">SPECIALTY:</span> Cybersecurity Engineer, Exploit Developer, Web Architect</div>
<div><span class="text-accent font-bold">FOCUS AREAS:</span></div>
<div>  - Malware Simulation & Obfuscation Techniques</div>
<div>  - Penetration Testing & API Vulnerability Hunting</div>
<div>  - Full-Stack Web Development (Secure Architecture)</div>
<div>  - Custom Low-level Automation Scripting (Python, C, Rust)</div>
`,
    services: () => `
<div class="text-comment">// Core Services Catalogue</div>
<div>1. <span class="text-purple font-bold">Secure Coding &amp; Custom Tools:</span> Memory-safe programming, socket engines, automation scripts.</div>
<div>2. <span class="text-red font-bold">Malware Simulation:</span> Custom payloads & evasion tactics for antivirus &amp; EDR assessment.</div>
<div>3. <span class="text-cyan font-bold">Full-Stack Web Dev:</span> Stunning frontends, secure backends, OWASP Top 10 mitigation.</div>
<div>4. <span class="text-green font-bold">Penetration Testing:</span> In-depth network/web application auditing &amp; mitigation reports.</div>
`,
    lab: () => {
        setTimeout(() => {
            const labSec = document.getElementById('lab');
            if (labSec) {
                labSec.scrollIntoView({ behavior: 'smooth' });
                runLabDiagnostic('firewall');
            }
        }, 300);
        return `<div class="text-success">Redirecting to Virtual Sandbox Lab... Loading Firewall module.</div>`;
    },
    discord: () => {
        setTimeout(() => {
            window.open('https://discord.gg/EZqQ9ZNQQ', '_blank');
        }, 500);
        return `<div class="text-success">Redirecting to discord.gg/EZqQ9ZNQQ ... Make sure to introduce yourself!</div>`;
    },
    contact: () => {
        setTimeout(() => {
            const contactSec = document.getElementById('contact');
            if (contactSec) {
                contactSec.scrollIntoView({ behavior: 'smooth' });
            }
        }, 300);
        return `
<div><span class="text-accent font-bold">DISCORD:</span> https://discord.gg/EZqQ9ZNQQ</div>
<div><span class="text-accent font-bold">INSTAGRAM:</span> @iamrealelliotalderson</div>
<div><span class="text-accent font-bold">EMAIL:</span> Alimhussain12665@gmail.com</div>
<div class="text-success">Navigating to secure contact portal form...</div>
`;
    }
};

terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const fullCmd = terminalInput.value.trim();
        const cmd = fullCmd.toLowerCase();

        // Remove active input row placeholder input
        const activeInputRow = document.querySelector('.active-input-row');
        if (activeInputRow) {
            activeInputRow.classList.remove('active-input-row');
            const placeholderSpan = activeInputRow.querySelector('.terminal-input');
            if (placeholderSpan) {
                // Replace input with text
                const textSpan = document.createElement('span');
                textSpan.className = 'text-white';
                textSpan.textContent = fullCmd;
                placeholderSpan.replaceWith(textSpan);
            }
        }

        // Handle commands
        if (cmd === 'clear') {
            terminalContent.innerHTML = `
            <div class="terminal-row text-comment"># Terminal history cleared.</div>
            <div class="terminal-row text-accent">Available commands: [about, services, lab, discord, clear, contact]</div>
            `;
        } else if (cmd) {
            const resultRow = document.createElement('div');
            resultRow.className = 'terminal-row';

            if (terminalCommands[cmd]) {
                resultRow.innerHTML = terminalCommands[cmd]();
            } else {
                resultRow.innerHTML = `<span class="text-red">Command not found: "${fullCmd}". Type "help" for a list of available commands.</span>`;
            }

            terminalContent.appendChild(resultRow);
        }

        // Re-append active input row
        const newActiveRow = document.createElement('div');
        newActiveRow.className = 'terminal-row active-input-row';
        newActiveRow.innerHTML = `
            <span class="terminal-prompt">guest@elliot.sec:~$</span>
            <input type="text" class="terminal-input" id="terminal-cmd-input" autocomplete="off" spellcheck="false" placeholder="type a command...">
        `;
        terminalContent.appendChild(newActiveRow);

        // Re-focus and auto scroll
        const newInput = document.getElementById('terminal-cmd-input');
        newInput.focus();

        // Sync event listener to new input
        newInput.addEventListener('keydown', arguments.callee);

        // Scroll terminal to bottom
        const terminalWindow = document.getElementById('interactive-terminal');
        terminalWindow.scrollTop = terminalWindow.scrollHeight;

        // Clear input value
        terminalInput.value = '';
    }
});

// Auto focus terminal input on click inside the terminal window
document.getElementById('interactive-terminal').addEventListener('click', () => {
    const activeInput = document.getElementById('terminal-cmd-input');
    if (activeInput) activeInput.focus();
});


/* ==========================================================================
   VIRTUAL SECURITY LAB DIAGNOSTICS
   ========================================================================== */
let labTimer = null;

function runLabDiagnostic(moduleType) {
    // Clear existing timer if any
    if (labTimer) clearTimeout(labTimer);

    // Update active button classes
    const buttons = document.querySelectorAll('.lab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    const activeBtn = document.getElementById(`lab-btn-${moduleType}`);
    if (activeBtn) activeBtn.classList.add('active');

    // Update system status
    const statusModule = document.getElementById('lab-status-module');
    const statusContainer = document.getElementById('lab-status-container');
    const statusMem = document.getElementById('lab-status-mem');
    const consoleBody = document.getElementById('lab-console-body');

    statusModule.textContent = "RUNNING...";
    statusModule.className = "text-accent";

    // Setup logging sequences
    let logs = [];

    if (moduleType === 'firewall') {
        statusContainer.textContent = "SECURE_GATEWAY_3";
        statusMem.textContent = "2.14% UTILIZED";
        logs = [
            { text: "// INITIATING PORT INTEGRITY DIAGNOSTIC...", class: "text-comment" },
            { text: "Hooking network sockets interface eth0...", class: "" },
            { text: "Scanning Port 22 (SSH) status: CLOSED (Secure Mode)", class: "text-success" },
            { text: "Scanning Port 80 (HTTP) status: RE-ROUTED TO HTTPS", class: "text-success" },
            { text: "Scanning Port 443 (HTTPS) status: OPEN (SSL: TLS 1.3 Active)", class: "text-success" },
            { text: "Scanning Port 3306 (MySQL) status: CLOSED (Local Socket Only)", class: "text-success" },
            { text: "Analyzing firewall policy logs...", class: "" },
            { text: "Web Application Firewall (WAF): ACTIVE [Custom Rule Engine]", class: "text-success" },
            { text: "Intrusion Prevention System (IPS): 0 threats matching signatures", class: "text-success" },
            { text: "DIAGNOSTIC STATUS: FIREWALL OPERATING OPTIMALLY. 100% SECURE.", class: "text-success font-bold" }
        ];
    } else if (moduleType === 'malware') {
        statusContainer.textContent = "SANDBOX_DOCKER_V9";
        statusMem.textContent = "84.8% UTILIZED";
        logs = [
            { text: "// WARNING: SPINNING UP HEURISTIC MALWARE DETECTOR...", class: "text-red font-bold" },
            { text: "Creating virtualization boundaries... ISO_ENV [OK]", class: "" },
            { text: "Loading custom binary: 'simulated_ransom_payload.exe'...", class: "" },
            { text: "Static Analysis: high entropy detected in .text section (Packed: UPX)", class: "text-accent" },
            { text: "Dynamic Analysis: Payload execution triggered...", class: "" },
            { text: "Monitoring registry callbacks: Attempted persistence via RunOnce (INTERCEPTED)", class: "text-red" },
            { text: "File activity: Process attempted bulk encryption of mock Documents/ (BLOCKED)", class: "text-red" },
            { text: "Network activity: Attempted Tor endpoint connection 192.168.x.x:9001 (BLOCKED)", class: "text-red" },
            { text: "EDR Action: Terminated process tree PID: 9284.", class: "text-success" },
            { text: "DIAGNOSTIC STATUS: SANDBOX DEFENSES SUCCESSFULLY MITIGATED MALWARE BEHAVIOR.", class: "text-success font-bold" }
        ];
    } else if (moduleType === 'network') {
        statusContainer.textContent = "DECRYPTOR_CORE_0";
        statusMem.textContent = "38.5% UTILIZED";
        logs = [
            { text: "// MONITORING RAW INTERFACE CAPTURE...", class: "text-comment" },
            { text: "Sniffing active packets: listening on interface wlan0...", class: "" },
            { text: "Captured Packet #8892 - Proto: TCP - Size: 512 bytes", class: "text-accent" },
            { text: "Analyzing payload payload: encrypted payload detected (Entropy 7.9)", class: "" },
            { text: "Initiating decryption sequence using private PGP parameters...", class: "" },
            { text: "Decryption progress: [25%] [50%] [75%] [100%] SUCCESS.", class: "text-accent" },
            { text: "Parsed Header details: GET /restricted/terminal_admin.html HTTP/1.1", class: "text-success" },
            { text: "Referer: Discord Webhook Integration Interface", class: "text-success" },
            { text: "Payload signature matches verified communications. Marked: SAFE.", class: "text-success" },
            { text: "DIAGNOSTIC STATUS: PACKET DECRYPTED AND AUDITED. NO ANOMALIES FOUND.", class: "text-success font-bold" }
        ];
    }

    // Print logs with delayed simulation
    consoleBody.innerHTML = "";
    let logIndex = 0;

    function printNextLog() {
        if (logIndex < logs.length) {
            const line = document.createElement('div');
            line.className = `console-line ${logs[logIndex].class}`;
            line.innerHTML = logs[logIndex].text;
            consoleBody.appendChild(line);

            // Auto scroll console
            consoleBody.scrollTop = consoleBody.scrollHeight;

            logIndex++;
            labTimer = setTimeout(printNextLog, 450);
        } else {
            statusModule.textContent = "ONLINE";
            statusModule.className = "text-success";

            const cursorLine = document.createElement('div');
            cursorLine.className = "console-line text-accent";
            cursorLine.innerHTML = "&gt; _";
            consoleBody.appendChild(cursorLine);
            consoleBody.scrollTop = consoleBody.scrollHeight;
        }
    }

    printNextLog();
}


/* ==========================================================================
   ENCRYPTED CONTACT PORTAL ACTION
   ========================================================================== */
function handlePortalSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('form-name').value;
    const email = document.getElementById('form-email').value;
    const subject = document.getElementById('form-subject').value;
    const message = document.getElementById('form-message').value;
    const statusMsg = document.getElementById('form-status-msg');
    const submitBtn = document.getElementById('btn-submit-contact');

    // Save original button content
    const originalBtnHTML = submitBtn.innerHTML;

    // Change button state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="btn-text">ENCRYPTING...</span>`;

    statusMsg.className = "form-status-msg text-accent";
    statusMsg.innerHTML = "Initializing RSA key generator...";

    // Step 1: Encrypt
    setTimeout(() => {
        statusMsg.innerHTML = "Applying PGP armor blocks. Encryption cipher: AES-256...";
        submitBtn.innerHTML = `<span class="btn-text">ROUTING PORTAL...</span>`;

        // Step 2: Route
        setTimeout(() => {
            statusMsg.innerHTML = "Tunneling message payload through secure nodes...";
            submitBtn.innerHTML = `<span class="btn-text">TRANSMITTING...</span>`;

            // Step 3: Transmit
            setTimeout(() => {
                statusMsg.className = "form-status-msg text-success font-bold";
                statusMsg.innerHTML = "TRANSMISSION SUCCESSFUL: Payload securely delivered to Real Elliot.";

                // Reset form fields
                document.getElementById('portal-form').reset();

                // Restore button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHTML;

                // Clear success message after delay
                setTimeout(() => {
                    statusMsg.innerHTML = "";
                }, 6000);
            }, 1200);
        }, 1200);
    }, 1000);
}


/* ==========================================================================
   NAVIGATION AND PAGE INTERACTIONS
   ========================================================================== */
// Header scroll styling toggle
window.addEventListener('scroll', () => {
    const header = document.querySelector('.main-header');
    if (window.scrollY > 40) {
        header.classList.add('navbar-scrolled');
        header.classList.remove('navbar-glass');
    } else {
        header.classList.remove('navbar-scrolled');
        header.classList.add('navbar-glass');
    }
});

// Navigation links highlight (ScrollSpy)
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');
const drawerLinks = document.querySelectorAll('.drawer-link');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        // If current scroll position is within the section (with offset)
        if (window.scrollY >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// Mobile Drawer Menu toggle
const mobileToggle = document.getElementById('mobile-toggle');
const mobileDrawer = document.getElementById('mobile-drawer');
const drawerClose = document.getElementById('drawer-close');

function openDrawer() {
    mobileDrawer.classList.add('open');
}

function closeDrawer() {
    mobileDrawer.classList.remove('open');
}

mobileToggle.addEventListener('click', openDrawer);
drawerClose.addEventListener('click', closeDrawer);

// Close drawer when clicking a drawer link
drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
});

// Close drawer if clicking outside of it
document.addEventListener('click', (e) => {
    if (!mobileDrawer.contains(e.target) && !mobileToggle.contains(e.target) && mobileDrawer.classList.contains('open')) {
        closeDrawer();
    }
});


/* ==========================================================================
   DISCORD USER COUNT RANDOMIZER (Live feeling)
   ========================================================================== */
const onlineCountEl = document.getElementById('discord-online-count');

if (onlineCountEl) {
    setInterval(() => {
        const currentCount = parseInt(onlineCountEl.textContent, 10);
        // Randomly add/subtract 1-3 members to simulate people moving around
        const drift = Math.floor(Math.random() * 7) - 3;
        const newCount = Math.max(120, Math.min(180, currentCount + drift));
        onlineCountEl.textContent = newCount;
    }, 4000);
}

// Initial diagnostic run on page load
window.addEventListener('DOMContentLoaded', () => {
    // Run initial firewall lab simulation
    runLabDiagnostic('firewall');
});
