document.getElementById("work-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const start = document.getElementById("start-time").value;
  const breakStart = document.getElementById("break-start").value;
  const breakEnd = document.getElementById("break-end").value;
  const end = document.getElementById("end-time").value;

  if (!(start && breakStart && breakEnd && end)) {
    alert("Compila tutti i campi.");
    return;
  }

  const workHours = calculateHours(start, breakStart) +
                    calculateHours(breakEnd, end);

  const overtime = Math.max(0, workHours - 8);
  const today = new Date().toISOString().split("T")[0];

  const record = {
    date: today,
    start,
    breakStart,
    breakEnd,
    end,
    workHours,
    overtime,
  };

  saveData(record);
  showSummary();
  alert("Ore salvate!");
});

function calculateHours(start, end) {
  const [h1, m1] = start.split(":").map(Number);
  const [h2, m2] = end.split(":").map(Number);
  return ((h2 * 60 + m2) - (h1 * 60 + m1)) / 60;
}
function salvaDati() {
  const data = document.getElementById("data").value;
  const ingresso = document.getElementById("ingresso").value;
  const pausa = document.getElementById("pausa").value;
  const uscita = document.getElementById("uscita").value;

  if (!data || !ingresso || !pausa || !uscita) {
    alert("Compila tutti i campi.");
    return;
  }

  const oreLavorate = calcolaOre(ingresso, pausa, uscita);

  // Mostra ore calcolate nella pagina
  document.getElementById("ore-calcolate").textContent = oreLavorate;

  const giornata = {
    data,
    ingresso,
    pausa,
    uscita,
    oreLavorate
  };

  let registro = JSON.parse(localStorage.getItem("registro")) || [];
  registro.push(giornata);
  localStorage.setItem("registro", JSON.stringify(registro));

  mostraRegistro();
  document.getElementById("form").reset();
}

  function mostraRegistro() {
  const registro = JSON.parse(localStorage.getItem("registro")) || [];
  const elenco = document.getElementById("registro");
  elenco.innerHTML = "";

  registro.forEach(g => {
    const riga = document.createElement("li");
    riga.textContent = `${g.data} - Ingresso: ${g.ingresso}, Pausa: ${g.pausa}, Uscita: ${g.uscita}, Ore: ${g.oreLavorate}`;
    elenco.appendChild(riga);
  });

  mostraTotaleMese(registro);
}
}

}

function showSummary() {
  const data = JSON.parse(localStorage.getItem("workLogs") || "[]");
  const summaryDiv = document.getElementById("summary");
  summaryDiv.innerHTML = "<h2>Riepilogo</h2>";

  data.slice(-5).reverse().forEach(r => {
    summaryDiv.innerHTML += `
      <p><strong>${r.date}</strong> — Ore: ${r.workHours.toFixed(2)} | Straordinari: ${r.overtime.toFixed(2)}</p>
    `;
  });
}

function generatePDF() {
  const data = JSON.parse(localStorage.getItem("workLogs") || "[]");
  let text = "Riepilogo Mensile Ore di Lavoro\n\n";
  let total = 0, extra = 0;

  data.forEach(r => {
    text += `${r.date}: ${r.workHours.toFixed(2)}h (Straordinari: ${r.overtime.toFixed(2)}h)\n`;
    total += r.workHours;
    extra += r.overtime;
  });

  text += `\nTotale ore: ${total.toFixed(2)}h\nStraordinari totali: ${extra.toFixed(2)}h`;

  const blob = new Blob([text], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "riepilogo-lavoro.pdf";
  link.click();
}

window.onload = showSummary;
