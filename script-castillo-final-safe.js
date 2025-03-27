(function () {
  const stop = "castillo";
  let respuestasCastillo = {
    visual: false,
    quiz: 0,
    secuencia: false,
  };
  let aciertos = 0;

  // Activar contenido al verificar ubicación
  window.unlockContent = function () {
    document.getElementById("game-content").style.display = "block";
    document.getElementById("location-check").style.display = "none";
    localStorage.setItem(`${stop}-completed`, "true");
    playSound("success-sound");
  };

  // Visual Challenge
  window.checkVisualAnswer = function (respuesta, correcta, n) {
    const resultado = document.getElementById(`visual-resultado-${n}`);
    if (respuesta === correcta) {
      resultado.textContent = "✅ ¡Correcto!";
      if (!respuestasCastillo.visual) {
        respuestasCastillo.visual = true;
        aciertos++;
        verificarTodoCompleto();
      }
    } else {
      resultado.textContent = "❌ Incorrecto. Intenta de nuevo.";
      playSound("error-sound");
    }
  };

  window.showHint = function (texto) {
    alert(`💡 Pista: ${texto}`);
  };

  // Quiz Challenge
  window.checkAnswer = function (respuesta, correcta, n) {
    const resultado = document.getElementById(`quiz-resultado-${n}`);
    if (respuesta === correcta) {
      resultado.textContent = "✅ ¡Correcto!";
      respuestasCastillo.quiz++;
      aciertos++;
    } else {
      resultado.textContent = "❌ Incorrecto.";
      playSound("error-sound");
    }
    verificarTodoCompleto();
  };

  // Secuencia de símbolos
  let inputUsuario = [];
  const secuenciaCorrecta = [3, 2, 0, 1];
  const simbolos = document.querySelectorAll(".simbolo");

  simbolos.forEach(s => {
    s.addEventListener("click", e => {
      const id = Number(e.target.dataset.id);
      inputUsuario.push(id);
      e.target.classList.add("activo");
      setTimeout(() => e.target.classList.remove("activo"), 500);

      if (inputUsuario[inputUsuario.length - 1] !== secuenciaCorrecta[inputUsuario.length - 1]) {
        document.getElementById("resultado-secuencia").textContent = "❌ Fallaste. Intenta de nuevo.";
        playSound("error-sound");
        inputUsuario = [];
        return;
      }

      if (inputUsuario.length === secuenciaCorrecta.length) {
        document.getElementById("resultado-secuencia").textContent = "✅ ¡Secuencia correcta!";
        playSound("coins-sound");
        if (!respuestasCastillo.secuencia) {
          respuestasCastillo.secuencia = true;
          aciertos++;
          verificarTodoCompleto();
        }
      }
    });
  });

  window.iniciarSecuencia = function () {
    inputUsuario = [];
    playSound("voz-gonzalo");
  };

  // Verificación
  window.checkLocation = function () {
    if (!navigator.geolocation) {
      setStatus("⚠️ Geolocalización no disponible.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const destino = { lat: 40.520512, lng: -6.063541 };
        const dist = getDistanceFromLatLonInMeters(lat, lng, destino.lat, destino.lng);
        if (dist <= 25) {
          setStatus("✅ Ubicación verificada.");
          unlockContent();
        } else {
          setStatus(`📍 Estás a ${Math.round(dist)} m del lugar. Acércate.`);
        }
      },
      () => setStatus("⚠️ Error al obtener tu posición."),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  window.checkLocationManual = function () {
    const input = document.getElementById("location-input").value.trim().toLowerCase();
    if (input.includes("castillo")) {
      setStatus("✅ Confirmación manual aceptada.");
      unlockContent();
    } else {
      setStatus("❌ Ese no es el nombre correcto.");
    }
  };

  function setStatus(msg) {
    const el = document.getElementById("location-status");
    if (el) el.textContent = msg;
  }

  function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Sonidos
  window.playSound = function (id) {
    const el = document.getElementById(id);
    if (el) {
      el.currentTime = 0;
      el.play().catch(() => {});
    }
  };

  function verificarTodoCompleto() {
    if (respuestasCastillo.quiz >= 3 && respuestasCastillo.visual && respuestasCastillo.secuencia) {
      document.getElementById("continue-button").style.display = "block";
      const tiempo = Math.floor(performance.now() / 1000);
      const nombre = localStorage.getItem("jugador") || "aventurer@";
      const ranking = JSON.parse(localStorage.getItem("ranking") || "[]");
      ranking.push({ nombre, tiempo, aciertos });
      localStorage.setItem("ranking", JSON.stringify(ranking));
    }
  }
})();
