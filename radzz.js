// Script Backend untuk Web (Spam NGL)

const form = document.querySelector("spamForm"); // Form utama
const resultContainer = document.querySelector("resultContainer"); // Kontainer hasil

// Fungsi memvalidasi dan memproses link NGL
function processNGLLink(link) {
    let username;

    // Validasi link dari confess.ngl.link dan pengalihan /confessions
    if (link.startsWith("https://confess.ngl.link/") || link.startsWith("https://ngl.link/")) {
        username = link.replace(/https:\/\/(confess\.ngl\.link|ngl\.link)\//, "").split("/")[0];
    } else {
        throw new Error("Link tidak valid. Gunakan format yang sesuai.");
    }

    // Pastikan username terdeteksi
    if (!username) throw new Error("Username tidak ditemukan dalam link.");

    return username;
}

// Fungsi untuk melakukan spam request
async function sendSpam(username, message, count) {
    const results = [];
    for (let i = 0; i < count; i++) {
        const deviceId = crypto.randomUUID(); // Membuat Device ID acak
        const finalMessage = `${message}\nANONIMOUS INVATION`;
        const data = { username, question: finalMessage, deviceId };

        try {
            const response = await fetch("https://ngl.link/api/submit", {
                method: "POST",
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
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

        // Tunggu 2 detik sebelum iterasi berikutnya (opsional untuk menghindari rate limit)
        await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    return results;
}

// Event handler ketika form dikirim
form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Mencegah reload halaman

    // Ambil data dari form
    const link = form.querySelector("#link").value.trim();
    const message = form.querySelector("#message").value.trim();
    const count = parseInt(form.querySelector("#count").value);

    try {
        if (!link || !message || isNaN(count) || count <= 0) {
            throw new Error("Semua field wajib diisi dengan benar!");
        }

        const username = processNGLLink(link); // Memproses username dari link
        resultContainer.textContent = "⏳ Mulai spam...";

        // Kirim spam
        const results = await sendSpam(username, message, count);

        // Tampilkan hasil
        resultContainer.innerHTML = `<h3>Hasil Spam:</h3><ul>${results
            .map((res) => `<li>${res}</li>`)
            .join("")}</ul>`;
    } catch (error) {
        resultContainer.textContent = `❌ Error: ${error.message}`;
    }
});
