document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach((s, i) => s.classList.toggle("active", i === index));
  }

  document.querySelector(".prev-slide")?.addEventListener("click", () => {
    currentSlide = (currentSlide > 0) ? currentSlide - 1 : slides.length - 1;
    showSlide(currentSlide);
  });

  document.querySelector(".next-slide")?.addEventListener("click", () => {
    currentSlide = (currentSlide < slides.length - 1) ? currentSlide + 1 : 0;
    showSlide(currentSlide);
  });

  showSlide(currentSlide);

  const narracion = document.getElementById("voz-gonzalo");
  window.playNarracion = function () {
    narracion.currentTime = 0;
    narracion.play();
  };

  const secuencia = [3, 2, 0, 1];
  let inputUsuario = [];
  const simbolos = document.querySelectorAll(".simbolo");

  simbolos.forEach(s => {
    s.addEventListener("click", e => {
      const id = Number(e.target.dataset.id);
      inputUsuario.push(id);

      e.target.classList.add("activo");
      setTimeout(() => e.target.classList.remove("activo"), 400);

      if (inputUsuario[inputUsuario.length - 1] !== secuencia[inputUsuario.length - 1]) {
        document.getElementById("resultado-secuencia").textContent = "❌ Fallaste. Intenta de nuevo.";
        playSound("error-sound");
        inputUsuario = [];
        return;
      }

      if (inputUsuario.length === secuencia.length) {
        document.getElementById("resultado-secuencia").textContent = "✅ ¡Secuencia correcta!";
        playSound("coins-sound");
        respuestasCastillo.secuencia = true;
        comprobarFinalCastillo();
      }
    });
  });

  window.checkVisualAnswer = function (respuesta, correcta, num) {
    const res = document.getElementById("visual-resultado-" + num);
    if (respuesta === correcta) {
      res.textContent = "✅ ¡Correcto!";
      respuestasCastillo["visual" + num] = true;
      playSound("coins-sound");
    } else {
      res.textContent = "❌ Incorrecto. Intenta de nuevo.";
      playSound("error-sound");
    }
    comprobarFinalCastillo();
  };

  window.checkAnswer = function (respuesta, correcta, num) {
    const res = document.getElementById("quiz-resultado-" + num);
    if (respuesta === correcta) {
      res.textContent = "✅ ¡Correcto!";
      respuestasCastillo["quiz" + num] = true;
      playSound("coins-sound");
    } else {
      res.textContent = "❌ Incorrecto.";
      playSound("error-sound");
    }
    comprobarFinalCastillo();
  };

  function comprobarFinalCastillo() {
    const total = Object.keys(respuestasCastillo).length;
    if (total >= 4) {
      document.getElementById("continue-button").style.display = "block";
    }
  }

  function playSound(id) {
    const el = document.getElementById(id);
    if (el) {
      el.currentTime = 0;
      el.play().catch(() => {});
    }
  }

  window.respuestasCastillo = {};
});