// script-castillo.js ✅ VERSION CORREGIDA Y COMENTADA

// Ejecutar al cargar el DOM
window.addEventListener('DOMContentLoaded', () => {
  const desbloqueada = localStorage.getItem('parada_castillo_desbloqueada');

  if (desbloqueada === 'true') {
    document.getElementById('location-check').style.display = 'none';
    document.getElementById('game-content').style.display = 'block';
  }

  // Mostrar botón si ya se completó el reto de símbolos
  const botonContinuar = document.getElementById("boton-continuar-busqueda");
  if (localStorage.getItem('reto_simbolos_completado') === 'true') {
    if (botonContinuar) {
      botonContinuar.style.display = "block";
    }
  }
});

// Verificación de ubicación por GPS
function checkLocation() {
  if (!navigator.geolocation) {
    alert("La geolocalización no está soportada por tu navegador.");
    return;
  }
  navigator.geolocation.getCurrentPosition(success, error);
}

function success(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const targetLat = 40.5495;
  const targetLon = -6.0597;
  const distance = getDistanceFromLatLonInMeters(lat, lon, targetLat, targetLon);

  if (distance <= 50) {
    document.getElementById('location-check').style.display = 'none';
    document.getElementById('game-content').style.display = 'block';
    localStorage.setItem('parada_castillo_desbloqueada', 'true');
  } else {
    document.getElementById('location-status').textContent = `Estás a ${Math.round(distance)} metros. Acércate más al castillo.`;
  }
}

function error() {
  alert("No se pudo obtener tu ubicación.");
}

// Verificación manual
function checkLocationManual() {
  const input = document.getElementById('location-input').value.trim().toLowerCase();
  if (input === 'castillo') {
    document.getElementById('location-check').style.display = 'none';
    document.getElementById('game-content').style.display = 'block';
    localStorage.setItem('parada_castillo_desbloqueada', 'true');
  } else {
    document.getElementById('location-status').textContent = "Nombre incorrecto. Intenta de nuevo.";
  }
}

// Cálculo de distancia
function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// ✅ Validación de quiz (con suma de aciertos)
function checkAnswer(respuestaSeleccionada, respuestaCorrecta, numeroPregunta) {
  const resultado = document.getElementById(`quiz-resultado-${numeroPregunta}`);
  if (respuestaSeleccionada === respuestaCorrecta) {
    resultado.textContent = "✅ ¡Correcto!";
    document.getElementById("success-sound").play();
    sumarAciertoCastillo();
  } else {
    resultado.textContent = "❌ Incorrecto. Inténtalo de nuevo.";
    document.getElementById("error-sound").play();
  }
}

// ✅ Validación del reto visual (con suma de aciertos)
function checkVisualAnswer(respuestaSeleccionada, respuestaCorrecta, numeroPregunta) {
  const resultado = document.getElementById(`visual-resultado-${numeroPregunta}`);
  if (respuestaSeleccionada === respuestaCorrecta) {
    resultado.textContent = "✅ ¡Correcto!";
    document.getElementById("coins-sound").play();
    sumarAciertoCastillo();
  } else {
    resultado.textContent = "❌ Incorrecto. Inténtalo de nuevo.";
    document.getElementById("error-sound").play();
  }
}

// ✅ Sumar aciertos al marcador del castillo
function sumarAciertoCastillo() {
  let aciertos = parseInt(localStorage.getItem("aciertos_castillo") || "0");
  localStorage.setItem("aciertos_castillo", aciertos + 1);
}
