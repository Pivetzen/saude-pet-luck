const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyaOyd-1YkAbmh5CBHddbeVB0Zde2evnQSLqONNfWG-7WgeKlqn-pF4rE4CbyH3-BLlbA/exec";

function enviarDados() {
    const btn = document.getElementById('btnSalvar');
    
    // Coletando todos os dados do perfil + vacina
    const payload = {
        pet: document.getElementById('nomePet').value,
        especie: document.getElementById('especie').value,
        raca: document.getElementById('raca').value,
        idade: document.getElementById('idade').value,
        peso: document.getElementById('peso').value,
        sexo: document.getElementById('sexo').value,
        vacina: document.getElementById('vacinaNome').value,
        data: document.getElementById('vacinaData').value
    };

    if(!payload.pet || !payload.vacina) return alert("Por favor, preencha ao menos o Nome do Pet e a Vacina!");

    btn.innerText = "Salvando...";
    btn.disabled = true;

    fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(payload)
    })
    .then(() => {
        alert("Dados registrados na planilha!");
        btn.innerText = "Salvar na Planilha";
        btn.disabled = false;
        carregarVacinas();
    })
    .catch(error => {
        console.error("Erro:", error);
        alert("Erro ao salvar. Verifique a URL do Script.");
        btn.disabled = false;
    });
}

function carregarVacinas() {
    const lista = document.getElementById('listaVacinas');
    const status = document.getElementById('status');

    fetch(SCRIPT_URL)
    .then(res => res.json())
    .then(data => {
        status.style.display = 'none';
        lista.innerHTML = "";
        
        // Exibe os registros da planilha (ignorando o cabeçalho)
        data.slice(1).reverse().forEach(row => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>💉 ${row[6]}</strong> (${row[7]})<br>
                <small>🐾 <b>${row[0]}</b> | ${row[1]} | ${row[2]} | ${row[4]}kg</small>
            `;
            lista.appendChild(li);
        });
    });
}

window.onload = carregarVacinas;
