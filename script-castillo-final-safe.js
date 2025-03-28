// Variables para seguimiento del juego en la parada castillo
let respuestasCastillo = {
  visual: false,
  quiz1: false,
  quiz2: false,
  quiz3: false,
  secuencia: false
};
let aciertosCastillo = 0;
let tiempoInicio = Date.now();

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

function showHint(texto) {
  alert("💡 Pista: " + texto);
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

// Juego de símbolos
let secuencia = [3, 2, 0, 1]; // ⚔️ ✝️ 🛡️ 🕯️
let inputUsuario = [];

function iniciarSecuencia() {
  inputUsuario = [];
  document.getElementById("voz-gonzalo").play().catch(() => {});
}

const simbolos = document.querySelectorAll(".simbolo");
simbolos.forEach((s, i) => {
  s.addEventListener("click", () => {
    s.classList.add("activo");
    setTimeout(() => s.classList.remove("activo"), 500);

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

// Mostrar botón si se ha completado todo
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

function playSound(id) {
  const el = document.getElementById(id);
  if (el) {
    el.currentTime = 0;
    el.play().catch(() => {});
  }
}

// Guardar resultados en ranking
function guardarEnRanking() {
  const tiempoTotal = Math.floor((Date.now() - tiempoInicio) / 1000);
  const nombre = localStorage.getItem("jugador") || "Aventurero";
  const parada = "castillo";

  let ranking = JSON.parse(localStorage.getItem("ranking") || "[]");
  ranking.push({ nombre, tiempo: tiempoTotal, aciertos: aciertosCastillo, parada });
  localStorage.setItem("ranking", JSON.stringify(ranking));
}
