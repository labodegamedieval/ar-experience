document.addEventListener("DOMContentLoaded", () => {
  // Ocultar nota inicialmente
  const nota = document.getElementById("nota-gonzalo");
  if (nota) {
    nota.classList.remove("visible");
    nota.style.display = "none";

    const notaContainer = document.querySelector(".pista");
    if (notaContainer) {
      notaContainer.addEventListener("click", () => {
        nota.classList.toggle("visible");
        nota.style.display = nota.classList.contains("visible") ? "block" : "none";
      });
    }
  }

  // Activar eventos en los símbolos
  const simbolos = document.querySelectorAll(".simbolo");
  simbolos.forEach((simbolo, i) => {
    simbolo.addEventListener("click", () => {
      simbolo.classList.add("activo");
      setTimeout(() => simbolo.classList.remove("activo"), 500);

      inputUsuario.push(i);
      const correcto = secuencia[inputUsuario.length - 1];

      if (i !== correcto) {
        document.getElementById("resultado-secuencia").textContent = "❌ Fallaste. Intenta de nuevo.";
        playSound("error-sound");
        inputUsuario = [];
        return;
      }

      if (inputUsuario.length === secuencia.length) {
        document.getElementById("resultado-secuencia").textContent = "✅ ¡Secuencia correcta!";
        playSound("coins-sound");
        if (!respuestasCastillo.secuencia) {
          respuestasCastillo.secuencia = true;
          aciertosCastillo++;
          mostrarBotonSiCompleto();
        }
      }
    });
  });
});

// Variables globales
let respuestasCastillo = {
  visual: false,
  quiz1: false,
  quiz2: false,
  quiz3: false,
  secuencia: false
};

let aciertosCastillo = 0;
let tiempoInicio = Date.now();
let secuencia = [0, 1, 2, 3]; // 🛡️ ⚔️ 🕯️ ✝️
let inputUsuario = [];

// Comprobación visual
function checkVisualAnswer(respuesta, correcta, id) {
  const resultado = document.getElementById("visual-resultado-" + id);
  if (respuesta === correcta) {
    resultado.textContent = "✅ ¡Correcto!";
    playSound("coins-sound");
    if (!respuestasCastillo.visual) {
      respuestasCastillo.visual = true;
      aciertosCastillo++;
      mostrarBotonSiCompleto();
    }
  } else {
    resultado.textContent = "❌ Intenta de nuevo.";
    playSound("error-sound");
  }
}

// Quiz
function checkAnswer(respuesta, correcta, id) {
  const resultado = document.getElementById("quiz-resultado-" + id);
  if (respuesta === correcta) {
    resultado.textContent = "✅ ¡Correcto!";
    playSound("coins-sound");
    if (!respuestasCastillo["quiz" + id]) {
      respuestasCastillo["quiz" + id] = true;
      aciertosCastillo++;
      mostrarBotonSiCompleto();
    }
  } else {
    resultado.textContent = "❌ Intenta de nuevo.";
    playSound("error-sound");
  }
}

// Pista de voz
function iniciarSecuencia() {
  inputUsuario = [];
  const voz = document.getElementById("voz-gonzalo");
  if (voz) voz.play().catch(() => {});
}

// Mostrar botón final
function mostrarBotonSiCompleto() {
  const total = Object.keys(respuestasCastillo).length;
  const completados = Object.values(respuestasCastillo).filter(Boolean).length;

  if (completados === total) {
    setTimeout(() => {
      document.getElementById("continue-button").style.display = "block";
      playSound("cheers-sound");
      guardarEnRanking();
    }, 1000);
  }
}

// Sonidos
function playSound(id) {
  const el = document.getElementById(id);
  if (el) {
    el.currentTime = 0;
    el.play().catch(() => {});
  }
}

// Ranking
function guardarEnRanking() {
  const tiempoTotal = Math.floor((Date.now() - tiempoInicio) / 1000);
  const nombre = localStorage.getItem("jugador") || "Aventurero";
  const parada = "castillo";

  let ranking = JSON.parse(localStorage.getItem("ranking") || "[]");
  ranking.push({ nombre, tiempo: tiempoTotal, aciertos: aciertosCastillo, parada });
  localStorage.setItem("ranking", JSON.stringify(ranking));
}
