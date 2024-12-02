// Ambil elemen-elemen penting
const form = document.querySelector("#spamForm");
const logContainer = document.querySelector("#logContainer");
const spamButton = document.querySelector("#spamButton");

// Fungsi untuk memproses link atau username
function processTarget(target) {
    let username;

    if (target.startsWith("https://confess.ngl.link/") || target.startsWith("https://ngl.link/")) {
        username = target.replace(/https:\/\/(confess\.ngl\.link|ngl\.link)\//, "").split("/")[0];
    } else {
        username = target; // Asumsi langsung username
    }

    if (!username) {
        throw new Error("Username atau link target tidak valid.");
    }

    return username;
}

// Fungsi untuk melakukan spam request
async function sendSpam(username, message, count) {
    const results = [];
    for (let i = 0; i < count; i++) {
        const deviceId = crypto.randomUUID(); // Membuat ID perangkat unik
        const finalMessage = `${message}\nANONIMOUS SPAM`;
        const data = { username, question: finalMessage, deviceId };

        try {
            const response = await fetch("https://ngl.link/api/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams(data),
            });

            if (response.ok) {
                results.push(`Spam ${i + 1}: Sukses`);
            } else {
                results.push(`Spam ${i + 1}: Gagal`);
            }
        } catch (error) {
            results.push(`Spam ${i + 1}: Error - ${error.message}`);
        }

        // Update log setiap iterasi
        updateLog(results[results.length - 1]);

        // Delay opsional 1 detik untuk menghindari rate limit
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return results;
}

// Fungsi untuk memperbarui log
function updateLog(entry) {
    const logEntry = document.createElement("div");
    logEntry.className = "log-entry";
    logEntry.textContent = entry;
    logContainer.appendChild(logEntry);
    logContainer.scrollTop = logContainer.scrollHeight; // Auto-scroll ke bawah
}

// Event handler untuk form submission
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const target = document.querySelector("#target").value.trim();
    const message = document.querySelector("#message").value.trim();
    const amount = parseInt(document.querySelector("#amount").value, 10);

    // Validasi input
    if (!target || !message || isNaN(amount) || amount <= 0 || amount > 100) {
        alert("Harap masukkan data dengan benar! Jumlah spam maksimal 100.");
        return;
    }

    // Nonaktifkan tombol selama proses
    spamButton.disabled = true;
    spamButton.textContent = "Mengirimkan...";

    try {
        const username = processTarget(target);
        logContainer.innerHTML = ""; // Bersihkan log lama
        updateLog("⏳ Memulai spam...");

        const results = await sendSpam(username, message, amount);

        updateLog("✅ Spam selesai!");
        updateLog(results.join("\n"));
    } catch (error) {
        updateLog(`❌ Error: ${error.message}`);
    } finally {
        spamButton.disabled = false;
        spamButton.textContent = "Kirimkan";
    }
});
