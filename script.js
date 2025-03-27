document.addEventListener('DOMContentLoaded', () => {
  let musicPlaying = true;
  const bgMusic = document.getElementById("background-music");
  const musicBtn = document.querySelector(".music-btn");
  const musicIcon = document.querySelector(".music-icon");

  if (musicBtn) {
    musicBtn.addEventListener("click", () => {
      if (musicPlaying) {
        bgMusic.pause();
        musicIcon.textContent = "🔇";
      } else {
        bgMusic.play().catch(() => {});
        musicIcon.textContent = "🎵";
      }
      musicPlaying = !musicPlaying;
    });
  }

  // Carrusel de imágenes
  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => slide.classList.toggle("active", i === index));
  }

  if (document.querySelector(".prev-slide")) {
    document.querySelector(".prev-slide").addEventListener("click", () => {
      currentSlide = (currentSlide > 0) ? currentSlide - 1 : slides.length - 1;
      showSlide(currentSlide);
    });
  }

  if (document.querySelector(".next-slide")) {
    document.querySelector(".next-slide").addEventListener("click", () => {
      currentSlide = (currentSlide < slides.length - 1) ? currentSlide + 1 : 0;
      showSlide(currentSlide);
    });
  }

  showSlide(currentSlide);

  // Geolocalización
  const locations = {
    castillo: { lat: 40.520512, lng: -6.063541 },
    plaza: { lat: 40.520621, lng: -6.063455 },
    iglesia: { lat: 40.521379, lng: -6.063810 },
    fuente: { lat: 40.522185, lng: -6.064564 },
    ermita: { lat: 40.522793, lng: -6.066424 },
    puente: { lat: 40.522552, lng: -6.065858 },
    "puente-tablas": { lat: 40.524500, lng: -6.067200 },
    humilladero: { lat: 40.523200, lng: -6.066700 },
    arco: { lat: 40.521800, lng: -6.063000 },
    callejon: { lat: 40.521900, lng: -6.063300 },
    escortinas: { lat: 40.523600, lng: -6.064900 }
  };

  function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  window.checkLocation = function () {
    if (!navigator.geolocation) {
      setStatus("⚠️ Geolocalización no disponible.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const stop = getCurrentStop();
        const loc = locations[stop];
        const dist = getDistanceFromLatLonInMeters(
          pos.coords.latitude,
          pos.coords.longitude,
          loc.lat,
          loc.lng
        );

        if (dist <= 25) {
          setStatus("✅ Ubicación verificada.");
          unlockContent();
        } else {
          setStatus(`📍 Estás a ${Math.round(dist)} m del lugar. Acércate.`);
        }
      },
      (err) => {
        setStatus("⚠️ Error al obtener tu posición.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // ✅ Versión mejorada para verificación manual (selección múltiple)
  window.checkLocationManual = function () {
    const input = document.getElementById("location-input");
    if (!input) return;

    const inputValue = input.value.trim().toLowerCase();

    const validStops = [
      "castillo", "plaza", "iglesia", "fuente", "ermita", "puente",
      "puente-tablas", "bodega", "humilladero", "arco", "callejon", "escortinas"
    ];

    if (validStops.includes(inputValue)) {
      setStatus("✅ Confirmación manual aceptada.");
      unlockContent();
    } else {
      setStatus("❌ Ese no es el nombre correcto. Elige entre las opciones propuestas.");
    }
  };

  function unlockContent() {
    const content = document.getElementById("game-content");
    const check = document.getElementById("location-check");
    if (content) content.style.display = "block";
    if (check) check.style.display = "none";

    const stop = getCurrentStop();
    if (stop) {
      localStorage.setItem(`${stop}-completed`, "true");
    }

    playSound("success-sound");
  }

  function setStatus(msg) {
    const el = document.getElementById("location-status");
    if (el) el.textContent = msg;
  }

  function getCurrentStop() {
    return window.location.pathname.split("/").pop().replace(".html", "");
  }

  // Sonidos
  window.playSound = function (id) {
    const el = document.getElementById(id);
    if (el) {
      el.currentTime = 0;
      el.play().catch(() => {});
    }
  };

  // QR Verificación (para explorar.html)
  window.checkQR = function () {
    const qrInput = document.getElementById("qr-input");
    const qrStatus = document.getElementById("qr-status");
    const value = qrInput.value.trim().toUpperCase();

    const validCodes = {
      "CASTILLO-1834": "castillo",
      "PLAZA-1523": "plaza",
      "IGLESIA-1300": "iglesia",
      "FUENTE-1600": "fuente",
      "ERMITA-1500": "ermita",
      "PUENTE-1400": "puente",
      "BODEGA-1600": "bodega",
      "HUMILLADERO-1512": "humilladero",
      "TABLAS-001": "puente-tablas",
      "ARCO-1420": "arco",
      "CALLEJON-1444": "callejon",
      "ESCORTINAS-1555": "escortinas"
    };

    if (validCodes[value]) {
      qrStatus.textContent = "✅ QR correcto. Parada desbloqueada.";
      localStorage.setItem(`${validCodes[value]}-discovered`, "true");
      setTimeout(() => {
        window.location.href = validCodes[value] + ".html";
      }, 1500);
    } else {
      qrStatus.textContent = "❌ Código incorrecto.";
    }
  };
});
