const spamForm = document.getElementById('spamForm');
const logContainer = document.getElementById('logContainer');
const spamButton = document.getElementById('spamButton');

// Fungsi untuk mengirim spam dengan penanganan asinkron
async function sendSpam(target, message, amount) {
    const username = target.replace('https://ngl.link/', '').trim();
    const delay = 2000; // Jeda 2 detik antar request
    let counter = 0;

    // Fungsi delay (tunggu waktu tertentu)
    const delayPromise = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    for (let i = 0; i < amount; i++) {
        try {
            const deviceId = Array(21)
                .fill(null)
                .map(() => Math.random().toString(36)[2])
                .join('');

            const finalMessage = `${message}\nANONIMOUS INVATIONS`;
            const data = new URLSearchParams({
                username,
                question: finalMessage,
                deviceId,
                gameSlug: '',
                referrer: '',
            }).toString();

            const response = await fetch('https://ngl.link/api/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0',
                },
                body: data,
            });

            if (response.ok) {
                counter++;
                addLog(`Spam #${counter} berhasil dikirim ke ${target}`);
            } else {
                addLog(`Spam #${i + 1} gagal dikirim: ${response.status}`);
            }

            // Tunggu sebelum permintaan berikutnya
            await delayPromise(delay);
        } catch (err) {
            addLog(`Spam #${i + 1} error: ${err.message}`);
        }
    }

    spamButton.disabled = false;
    addLog(`Selesai mengirim ${counter} spam ke ${target}`);
}

// Fungsi untuk menambahkan log
function addLog(message) {
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    logContainer.appendChild(logEntry);
    logContainer.scrollTop = logContainer.scrollHeight; // Auto scroll ke log terbaru
}

// Event listener untuk form submit
spamForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const target = document.getElementById('target').value.trim();
    const message = document.getElementById('message').value.trim();
    const amount = parseInt(document.getElementById('amount').value, 10);

    if (!target || !message || isNaN(amount) || amount <= 0) {
        return alert('Semua input wajib diisi dengan benar!');
    }

    spamButton.disabled = true;
    addLog(`Memulai spam ke ${target} sebanyak ${amount} kali...`);
    sendSpam(target, message, amount);
});
