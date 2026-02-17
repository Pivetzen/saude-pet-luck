const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyaOyd-1YkAbmh5CBHddbeVB0Zde2evnQSLqONNfWG-7WgeKlqn-pF4rE4CbyH3-BLlbA/exec";
let DADOS = { pets: [], vacinas: [], consultas: [] };
let PET_ATUAL = "";

async function carregar() {
    try {
        const res = await fetch(SCRIPT_URL);
        DADOS = await res.json();
        renderHome();
    } catch (e) {
        console.error(e);
        document.getElementById('lista-pets-grid').innerHTML = "Erro ao carregar dados.";
    }
}

function mostrarTela(id) {
    ['tela-dashboard', 'tela-cadastro', 'tela-carteira'].forEach(t => document.getElementById(t).style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

function renderHome() {
    const grid = document.getElementById('lista-pets-grid');
    grid.innerHTML = "";
    if (!DADOS.pets || DADOS.pets.length <= 1) {
        grid.innerHTML = "<p>Nenhum pet cadastrado.</p>";
        return;
    }
    DADOS.pets.slice(1).forEach(p => {
        const btn = document.createElement('button');
        btn.className = "btn-pet-card";
        const img = p[14] ? `<img src="${p[14]}" class="pet-thumb">` : `<div class="pet-thumb" style="display:flex;align-items:center;justify-content:center;background:#eee">🐾</div>`;
        btn.innerHTML = `${img} ${p[0]}`;
        btn.onclick = () => abrirCarteira(p[0]);
        grid.appendChild(btn);
    });
}

function abrirCarteira(nome) {
    PET_ATUAL = nome;
    mostrarTela('tela-carteira');
    const p = DADOS.pets.find(x => x[0] === nome);
    
    const fotoHTML = p[14] ? `<img src="${p[14]}" class="foto-perfil">` : "";
    document.getElementById('cabecalho-pet').innerHTML = `
        ${fotoHTML}
        <h2>${p[0]}</h2>
        <p>${p[1]} | ${p[2]} | ${p[3]} anos | ${p[4]}kg | ${p[5]}</p>
    `;
    
    document.getElementById('info-alimento').innerHTML = `
        <h3>🥩 Alimentação Principal</h3>
        <p><b>Marca:</b> ${p[6]} | <b>Tipo:</b> ${p[7]}</p>
        <p><b>Quantidade:</b> ${p[8]}g | <b>Freq:</b> ${p[9]}x ao dia</p>
        <hr>
        <h3>🍪 Petiscos</h3>
        <p><b>Marca:</b> ${p[10]} | <b>Tipo:</b> ${p[11]}</p>
        <p><b>Quantidade:</b> ${p[12]}g | <b>Freq:</b> ${p[13]}x ao dia</p>
    `;
    renderHistorial();
}

function renderHistorial() {
    const lista = document.getElementById('historico-eventos');
    lista.innerHTML = "";
    
    let eventos = [
        ...DADOS.vacinas.filter(v => v[0] === PET_ATUAL).map(v => ({ tipo: 'V', data: v[2], desc: v[1], prox: v[3] })),
        ...DADOS.consultas.filter(c => c[0] === PET_ATUAL).map(c => ({ tipo: 'C', data: c[1], desc: c[2], obs: c[3] }))
    ];

    eventos.sort((a, b) => new Date(b.data) - new Date(a.data));

    eventos.forEach(e => {
        const div = document.createElement('div');
        div.className = "item-hist";
        if (e.tipo === 'V') {
            div.innerHTML = `<b>💉 Vacina:</b> ${e.desc} (Aplicada: ${e.data})`;
            if(e.prox) div.innerHTML += `<br><span class="reforco">🔔 Próximo Reforço: ${e.prox}</span>`;
        } else {
            div.innerHTML = `<b>🩺 Consulta:</b> ${e.desc} (${e.data})<br><small>Obs: ${e.obs}</small>`;
        }
        lista.appendChild(div);
    });
}

function enviar(payload) {
    fetch(SCRIPT_URL, { method: "POST", mode: "no-cors", body: JSON.stringify(payload) })
    .then(() => { alert("Dados salvos!"); location.reload(); });
}

function salvarEvento(tipo) {
    let payload = { tipoPost: tipo, nomePet: PET_ATUAL };
    if(tipo === 'NOVA_VACINA') {
        payload.vacina = document.getElementById('v_nome').value;
        payload.data = document.getElementById('v_data').value;
        payload.proximaDose = document.getElementById('v_proxima').value;
    } else {
        payload.motivo = document.getElementById('c_motivo').value;
        payload.diagnostico = document.getElementById('c_diag').value;
        payload.data = document.getElementById('c_data').value;
    }
    enviar(payload);
}

function cadastrarPet() {
    const payload = {
        tipoPost: "CADASTRO_PET",
        nome: document.getElementById('nomePet').value,
        especie: document.getElementById('especie').value,
        raca: document.getElementById('raca').value,
        idade: document.getElementById('idade').value,
        peso: document.getElementById('peso').value,
        sexo: document.getElementById('sexo').value,
        r_marca: document.getElementById('r_marca').value,
        r_tipo: document.getElementById('r_tipo').value,
        r_qtd: document.getElementById('r_qtd').value,
        r_freq: document.getElementById('r_freq').value,
        p_marca: document.getElementById('p_marca').value,
        p_tipo: document.getElementById('p_tipo').value,
        p_qtd: document.getElementById('p_qtd').value,
        p_freq: document.getElementById('p_freq').value,
        foto: document.getElementById('fotoUrl').value
    };
    enviar(payload);
}

function aba(id) {
    document.querySelectorAll('.aba-content').forEach(a => a.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

window.onload = carregar;
