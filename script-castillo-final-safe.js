// SCRIPT PARA LA PARADA "CASTILLO"

let respuestasCastillo = {};
let aciertosCastillo = 0;
let simbolosCastillo = [];
let secuenciaCastillo = [3, 2, 0, 1]; // ⚔️ ✝️ 🛡️ 🕯️
let inputUsuarioCastillo = [];

window.addEventListener("DOMContentLoaded", () => {
  // Activar música
  const musicBtn = document.querySelector(".music-btn");
  const bgMusic = document.getElementById("background-music");
  const musicIcon = document.querySelector(".music-icon");
  let musicPlaying = true;

  musicBtn?.addEventListener("click", () => {
    if (musicPlaying) {
      bgMusic.pause();
      musicIcon.textContent = "🔇";
    } else {
      bgMusic.play().catch(() => {});
      musicIcon.textContent = "🎵";
    }
    musicPlaying = !musicPlaying;
  });

  // Carrusel
  let currentSlide = 0;
  const slides = document.querySelectorAll(".slide");
  const prevBtn = document.querySelector(".prev-slide");
  const nextBtn = document.querySelector(".next-slide");

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.style.display = i === index ? "block" : "none";
    });
  }

  prevBtn?.addEventListener("click", () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  });
  nextBtn?.addEventListener("click", () => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  });

  showSlide(currentSlide);

  // Simbolos secuencia
  simbolosCastillo = document.querySelectorAll(".simbolo");

  simbolosCastillo.forEach(s => s.addEventListener("click", e => {
    const id = Number(e.target.dataset.id);
    inputUsuarioCastillo.push(id);
    s.classList.add("activo");
    setTimeout(() => s.classList.remove("activo"), 500);

    if (inputUsuarioCastillo[inputUsuarioCastillo.length - 1] !== secuenciaCastillo[inputUsuarioCastillo.length - 1]) {
      document.getElementById("resultado-secuencia").textContent = "❌ Fallaste. Intenta de nuevo.";
      playSound("error-sound");
      inputUsuarioCastillo = [];
      return;
    }

    if (inputUsuarioCastillo.length === secuenciaCastillo.length) {
      document.getElementById("resultado-secuencia").textContent = "✅ ¡Secuencia correcta!";
      playSound("coins-sound");
      if (!respuestasCastillo.secuencia) {
        respuestasCastillo.secuencia = true;
        aciertosCastillo++;
        comprobarFinal();
      }
    }
  }));
});

window.iniciarSecuencia = function () {
  inputUsuarioCastillo = [];
  document.getElementById("voz-gonzalo").play().catch(() => {});
};

window.checkAnswer = function (respuesta, correcta, n) {
  const resultado = document.getElementById(`quiz-resultado-${n}`);
  if (respuesta === correcta) {
    resultado.textContent = "✅ Correcto";
    playSound("success-sound");
    if (!respuestasCastillo[`q${n}`]) {
      respuestasCastillo[`q${n}`] = true;
      aciertosCastillo++;
      comprobarFinal();
    }
  } else {
    resultado.textContent = "❌ Incorrecto";
    playSound("error-sound");
  }
};

window.checkVisualAnswer = function (respuesta, correcta, n) {
  const resultado = document.getElementById(`visual-resultado-${n}`);
  if (respuesta === correcta) {
    resultado.textContent = "✅ Bien observado";
    playSound("success-sound");
    if (!respuestasCastillo[`v${n}`]) {
      respuestasCastillo[`v${n}`] = true;
      aciertosCastillo++;
      comprobarFinal();
    }
  } else {
    resultado.textContent = "❌ Observa mejor...";
    playSound("error-sound");
  }
};

window.showHint = function (texto) {
  alert("💡 Pista: " + texto);
};

function playSound(id) {
  const el = document.getElementById(id);
  if (el) {
    el.currentTime = 0;
    el.play().catch(() => {});
  }
}

function comprobarFinal() {
  const total = 5; // preguntas + visual + secuencia
  if (Object.keys(respuestasCastillo).length >= total) {
    const btn = document.getElementById("continue-button");
    if (btn) btn.style.display = "block";
    registrarJugador();
  }
}

function registrarJugador() {
  const nombre = localStorage.getItem("jugador") || "Aventurero";
  const inicio = Number(localStorage.getItem("inicio-castillo")) || Date.now();
  const tiempo = Math.floor((Date.now() - inicio) / 1000);
  let ranking = JSON.parse(localStorage.getItem("ranking") || "[]");

  ranking.push({ nombre, tiempo, aciertos: aciertosCastillo });
  localStorage.setItem("ranking", JSON.stringify(ranking));
  localStorage.setItem("castillo-completed", "true");
}

window.checkLocationManual = function () {
  const input = document.getElementById("location-input");
  const valor = input?.value.trim().toLowerCase();
  if (valor === "castillo") {
    document.getElementById("location-check").style.display = "none";
    document.getElementById("game-content").style.display = "block";
    playSound("success-sound");
    localStorage.setItem("inicio-castillo", Date.now().toString());
  } else {
    document.getElementById("location-status").textContent = "❌ Ese no es el nombre correcto.";
  }
};

window.checkLocation = function () {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const dist = getDistanceFromLatLonInMeters(pos.coords.latitude, pos.coords.longitude, 40.520512, -6.063541);
      if (dist <= 30) {
        document.getElementById("location-check").style.display = "none";
        document.getElementById("game-content").style.display = "block";
        playSound("success-sound");
        localStorage.setItem("inicio-castillo", Date.now().toString());
      } else {
        document.getElementById("location-status").textContent = `📍 Estás a ${Math.round(dist)} m. Acércate más.`;
      }
    },
    () => {
      document.getElementById("location-status").textContent = "⚠️ No se pudo obtener tu ubicación.";
    },
    { enableHighAccuracy: true }
  );
};

function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
