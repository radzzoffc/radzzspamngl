document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
  alert("Akses klik kanan diblokir");
});

document.onkeydown = function(e) {
  if (e.keyCode == 123) {
    alert("Akses Developer Tools diblokir");
    return false;
  }
  if (e.ctrlKey && (e.shiftKey && (e.keyCode == 73 || e.keyCode == 74 || e.keyCode == 67)) || 
      e.ctrlKey && (e.keyCode == 85 || e.keyCode == 83)) {
    alert("Shortcut DevTools diblokir");
    return false;
  }
};

let devtools = {
  open: false,
  orientation: null,
};
(function() {
  const threshold = 160;
  setInterval(function() {
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    if (widthThreshold || heightThreshold) {
      if (!devtools.open) {
        alert("DevTools terdeteksi, Akses diblokir");
      }
      devtools.open = true;
    } else {
      devtools.open = false;
    }
  }, 1000);
})();

document.getElementById("spamForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const target = document.getElementById("target").value.trim();
    const message = document.getElementById("message").value.trim();
    const amount = parseInt(document.getElementById("amount").value.trim(), 10);
    const logContainer = document.getElementById("logContainer");
    
    logContainer.innerHTML = "";

    if (!target || !message || isNaN(amount) || amount <= 0 || amount > 99999) {
        logMessage("Pastikan semua input valid (target, pesan, jumlah <= null)", "error");
        return;
    }

    try {
        const username = processNGLLink(target);
        logMessage(`Sended: ${username}`, "success");

        logMessage(`Started with ammout ${amount} Spams...`, "info");

        let successCount = 0;

        for (let i = 0; i < amount; i++) {
            const deviceId = generateDeviceId();
            const finalMessage = `${message}\nANONIMOUS INVATION`;

            const response = await sendSpam(username, finalMessage, deviceId);

            if (response.status === 200) {
                successCount++;
                logMessage(`${i + 1} berhasil: ${finalMessage}`, "success");
            } else {
                logMessage(`${i + 1} gagal: ${response.error}`, "error");
            }
            updateProgress(successCount, amount);
        }

        logMessage(`Done Spamming, Total Succes count: ${successCount} from ${amount}`, "success");
    } catch (err) {
        logMessage(`Error: ${err.message}`, "error");
    }
});

function processNGLLink(link) {
    let username;
    const regex = /https:\/\/(?:[a-zA-Z0-9-_]+\.)?(ngl\.link|confess\.ngl\.link)\/([a-zA-Z0-9-_]+)/;

    const match = link.match(regex);

    if (match && match[2]) {
        username = match[2];
    } else {
        throw new Error("Link tidak valid. Gunakan format yang sesuai.");
    }

    return username;
}

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

function logMessage(message, type = "info") {
    const logContainer = document.getElementById("logContainer");
    const logEntry = document.createElement("div");
    logEntry.classList.add("log-entry", type);
    logEntry.textContent = message;
    logContainer.appendChild(logEntry);
    logContainer.scrollTop = logContainer.scrollHeight;
}

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

function generateDeviceId() {
    const length = 21;
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

particlesJS.load('particles-js', 'particles.json', function() {
    console.log('Particles loaded.');
});
