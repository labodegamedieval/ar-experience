window.checkLocationManual = function () {
  const input = document.getElementById("location-input");
  if (!input) return;
  const valor = input.value.trim().toLowerCase();
  const paradasValidas = [
    "castillo", "plaza", "iglesia", "fuente", "ermita", "puente",
    "puente-tablas", "bodega", "humilladero", "arco", "callejon", "escortinas"
  ];
  if (paradasValidas.includes(valor)) {
    setStatus("✅ Confirmación manual aceptada.");
    unlockContent(valor);
  } else {
    setStatus("❌ Ese no es el nombre correcto. Elige entre las opciones propuestas.");
  }
};

window.checkLocation = function () {
  if (!navigator.geolocation) return setStatus("⚠️ Geolocalización no disponible.");

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const stop = getCurrentStop();
      const ref = locations[stop];
      const distancia = getDistance(pos.coords.latitude, pos.coords.longitude, ref.lat, ref.lng);
      if (distancia <= 25) {
        setStatus("✅ Ubicación verificada.");
        unlockContent();
      } else {
        setStatus(`📍 Estás a ${Math.round(distancia)} m del lugar. Acércate.`);
      }
    },
    () => setStatus("⚠️ Error al obtener tu posición."),
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
};

window.checkQR = function () {
  const input = document.getElementById("qr-input");
  const status = document.getElementById("qr-status");
  const valor = input.value.trim().toUpperCase();
  const codigos = {
    "CASTILLO-1834": "castillo", "PLAZA-1523": "plaza", "IGLESIA-1300": "iglesia",
    "FUENTE-1600": "fuente", "ERMITA-1500": "ermita", "PUENTE-1400": "puente",
    "BODEGA-1600": "bodega", "HUMILLADERO-1512": "humilladero", "TABLAS-001": "puente-tablas",
    "ARCO-1420": "arco", "CALLEJON-1444": "callejon", "ESCORTINAS-1555": "escortinas"
  };

  if (codigos[valor]) {
    status.textContent = "✅ QR correcto. Parada desbloqueada.";
    localStorage.setItem(`${codigos[valor]}-discovered`, "true");
    setTimeout(() => window.location.href = codigos[valor] + ".html", 1500);
  } else {
    status.textContent = "❌ Código incorrecto.";
  }
};

window.showHint = function (msg) {
  alert("💡 Pista: " + msg);
};

window.playSound = function (id) {
  const el = document.getElementById(id);
  if (el) {
    el.currentTime = 0;
    el.play().catch(() => {});
  }
};

function getCurrentStop() {
  return window.location.pathname.split("/").pop().replace(".html", "");
}

function setStatus(msg) {
  const el = document.getElementById("location-status");
  if (el) el.textContent = msg;
}

function unlockContent(nombre = null) {
  const content = document.getElementById("game-content");
  const check = document.getElementById("location-check");
  if (content) content.style.display = "block";
  if (check) check.style.display = "none";

  const stop = nombre || getCurrentStop();
  if (stop) localStorage.setItem(`${stop}-completed`, "true");

  playSound("success-sound");
}

// Función para actualizar el progreso de las paradas completadas
function actualizarProgreso() {
  const paradasCompletadas = Object.keys(localStorage).filter(key => key.includes('-completed') && localStorage.getItem(key) === 'true').length;
  const totalParadas = 7; // número total de paradas
  const porcentaje = (paradasCompletadas / totalParadas) * 100;

  const progreso = document.getElementById("progress-fill");
  const progresoTexto = document.getElementById("progress-text");

  progreso.style.width = `${porcentaje}%`;
  progresoTexto.textContent = `${paradasCompletadas} de ${totalParadas} paradas completadas`;
}

// Función para mostrar las paradas desbloqueadas
function mostrarParadasDesbloqueadas() {
  const paradas = ["castillo", "plaza", "iglesia", "fuente", "ermita", "puente", "bodega"];
  paradas.forEach(parada => {
    if (localStorage.getItem(`${parada}-completed`) === "true") {
      document.getElementById(`${parada}-btn`).style.display = "inline-block";
    } else {
      document.getElementById(`${parada}-btn`).style.display = "none"; // Si no está desbloqueada, ocultarla
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  mostrarParadasDesbloqueadas();
  actualizarProgreso();
});
