// script-castillo-final-safe.min.js

// VARIABLES Y ESTADO LOCAL
let respuestasCastillo = {};
let aciertosCastillo = 0;
let inputUsuario = [];
let simbolos = [];
let secuencia = [2, 0, 3, 1]; // ✝️ 🛡️ ⚔️ 🕯️ (desordenado respecto a la narración)

// FUNCIONES DE INICIO
window.addEventListener("DOMContentLoaded", () => {
  simbolos = Array.from(document.querySelectorAll(".simbolo"));
  simbolos.forEach(s => s.addEventListener("click", manejarClickSimbolo));

  document.getElementById("quiz-opciones-1")?.querySelectorAll("button").forEach(btn => btn.addEventListener("click", () => checkAnswer(btn.textContent, 'XIII', 1)));
  document.getElementById("quiz-opciones-2")?.querySelectorAll("button").forEach(btn => btn.addEventListener("click", () => checkAnswer(btn.textContent, 'Cementerio', 2)));
  document.getElementById("quiz-opciones-3")?.querySelectorAll("button").forEach(btn => btn.addEventListener("click", () => checkAnswer(btn.textContent, 'Centro de Interpretación', 3)));

  document.getElementById("visual-opciones-1")?.querySelectorAll("button").forEach(btn => btn.addEventListener("click", () => checkVisualAnswer(btn.textContent, 'Rayo', 1)));

  checkMostrarBotonContinuar();
});

function checkVisualAnswer(resp, correcta, num) {
  const resEl = document.getElementById(`visual-resultado-${num}`);
  if (!resEl || respuestasCastillo[`visual${num}`]) return;
  if (resp === correcta) {
    resEl.textContent = "✅ ¡Correcto!";
    respuestasCastillo[`visual${num}`] = true;
    aciertosCastillo++;
    playSound("success-sound");
  } else {
    resEl.textContent = "❌ Inténtalo de nuevo.";
    playSound("error-sound");
  }
  checkMostrarBotonContinuar();
}

function showHint(msg) {
  alert(msg);
}

function checkAnswer(resp, correcta, num) {
  const resEl = document.getElementById(`quiz-resultado-${num}`);
  if (!resEl || respuestasCastillo[`quiz${num}`]) return;
  if (resp === correcta) {
    resEl.textContent = "✅ ¡Correcto!";
    respuestasCastillo[`quiz${num}`] = true;
    aciertosCastillo++;
    playSound("success-sound");
  } else {
    resEl.textContent = "❌ Inténtalo de nuevo.";
    playSound("error-sound");
  }
  checkMostrarBotonContinuar();
}

function manejarClickSimbolo(e) {
  const id = Number(e.target.dataset.id);
  inputUsuario.push(id);

  simbolos.forEach(el => el.classList.remove("activo"));
  e.target.classList.add("activo");

  if (inputUsuario[inputUsuario.length - 1] !== secuencia[inputUsuario.length - 1]) {
    document.getElementById("resultado-secuencia").textContent = "❌ Fallaste. Intenta de nuevo.";
    playSound("error-sound");
    inputUsuario = [];
    return;
  }

  if (inputUsuario.length === secuencia.length) {
    document.getElementById("resultado-secuencia").textContent = "✅ ¡Secuencia correcta!";
    playSound("coins-sound");
    if (!respuestasCastillo["secuencia"]) {
      respuestasCastillo["secuencia"] = true;
      aciertosCastillo++;
    }
    checkMostrarBotonContinuar();
  }
}

function playSound(id) {
  const el = document.getElementById(id);
  if (el) {
    el.currentTime = 0;
    el.play().catch(() => {});
  }
}

// BOTÓN CONTINUAR
function checkMostrarBotonContinuar() {
  const boton = document.getElementById("continue-button");
  if (!boton) return;

  const keys = Object.keys(respuestasCastillo);
  const total = ["visual1", "quiz1", "quiz2", "quiz3", "secuencia"];
  const completados = total.every(k => respuestasCastillo[k] !== undefined);

  if (completados || keys.length >= total.length) {
    boton.style.display = "block";
    guardarDatosCastillo();
  }
}

function guardarDatosCastillo() {
  const jugador = localStorage.getItem("jugador") || "Anónimo";
  const tiempoInicio = localStorage.getItem("inicio-castillo") || Date.now();
  const tiempo = Math.floor((Date.now() - tiempoInicio) / 1000);

  const datos = JSON.parse(localStorage.getItem("ranking") || "[]");
  datos.push({ nombre: jugador, parada: "castillo", tiempo, aciertos: aciertosCastillo });
  localStorage.setItem("ranking", JSON.stringify(datos));
  localStorage.setItem("castillo-completed", "true");
}

// Verificación manual para esta parada
function checkLocationManual() {
  const input = document.getElementById("location-input");
  if (!input) return;
  if (input.value.trim().toLowerCase() === "castillo") {
    document.getElementById("game-content").style.display = "block";
    document.getElementById("location-check").style.display = "none";
    localStorage.setItem("inicio-castillo", Date.now());
    playSound("success-sound");
  } else {
    document.getElementById("location-status").textContent = "❌ Nombre incorrecto.";
    playSound("error-sound");
  }
}
