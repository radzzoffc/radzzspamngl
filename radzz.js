document.getElementById("spamForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const target = document.getElementById("target").value.trim();
    const message = document.getElementById("message").value.trim();
    const amount = parseInt(document.getElementById("amount").value.trim(), 10);
    const logContainer = document.getElementById("logContainer");

    // Clear log
    logContainer.innerHTML = "";

    if (!target || !message || isNaN(amount) || amount <= 0 || amount > 100) {
        logMessage("⚠️ Pastikan semua input valid (target, pesan, jumlah <= 100)", "error");
        return;
    }

    try {
        // Validasi dan proses link/username
        const username = processNGLLink(target);
        logMessage(`✅ Link diproses: ${username}`, "success");

        logMessage(`⏳ Memulai spam sebanyak ${amount} kali...`, "info");

        let successCount = 0;

        // Mulai spam
        for (let i = 0; i < amount; i++) {
            const deviceId = generateDeviceId();
            const finalMessage = `${message}\nANONIMOUS INVATION`;

            const response = await sendSpam(username, finalMessage, deviceId);

            if (response.status === 200) {
                successCount++;
                logMessage(`✅ Spam ke-${i + 1} berhasil: ${finalMessage}`, "success");
            } else {
                logMessage(`❌ Spam ke-${i + 1} gagal: ${response.error}`, "error");
            }

            // Perbarui progres
            updateProgress(successCount, amount);
        }

        logMessage(`🎉 Spam selesai! Total berhasil: ${successCount} dari ${amount}`, "success");
    } catch (err) {
        logMessage(`❌ Error: ${err.message}`, "error");
    }
});

// Fungsi untuk validasi dan memproses link NGL
function processNGLLink(link) {
    let username;

    // Dukungan untuk berbagai jenis custom link
    const regex = /https:\/\/(?:[a-zA-Z0-9-_]+\.)?(ngl\.link|confess\.ngl\.link)\/([a-zA-Z0-9-_]+)/;

    const match = link.match(regex);

    if (match && match[2]) {
        username = match[2];
    } else {
        throw new Error("Link tidak valid. Gunakan format yang sesuai.");
    }

    return username;
}

// Fungsi mengirim spam (request API NGL)
async function sendSpam(username, question, deviceId) {
    const data = new URLSearchParams({
        username,
        question,
        deviceId,
    });

    try {
        const response = await fetch("https://ngl.link/api/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            },
            body: data.toString(),
        });

        return { status: response.status };
    } catch (error) {
        return { status: 500, error: error.message };
    }
}

// Fungsi untuk log pesan ke UI
function logMessage(message, type = "info") {
    const logContainer = document.getElementById("logContainer");
    const logEntry = document.createElement("div");
    logEntry.classList.add("log-entry", type);
    logEntry.textContent = message;
    logContainer.appendChild(logEntry);
    logContainer.scrollTop = logContainer.scrollHeight;
}

// Fungsi memperbarui progres
function updateProgress(current, total) {
    const spamButton = document.getElementById("spamButton");
    spamButton.textContent = `Mengirim... (${current}/${total})`;

    if (current === total) {
        spamButton.textContent = "Kirimkan";
        spamButton.disabled = false;
    } else {
        spamButton.disabled = true;
    }
}

// Fungsi untuk membuat Device ID random
function generateDeviceId() {
    const length = 21;
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
