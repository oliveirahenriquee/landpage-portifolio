
const corpoTabela = document.getElementById('corpo-tabela');
const inputTarefa = document.getElementById('nova-tarefa-input');
const btnSalvar = document.getElementById('salvar-tarefa-btn');
  
const contadorTxt = document.createElement('p');
contadorTxt.style.fontWeight = 'bold';
contadorTxt.style.color = '#388a9e';
contadorTxt.style.marginBottom = '10px';
btnSalvar.parentNode.insertBefore(contadorTxt, inputTarefa);

const btnLimpar = document.createElement('button');
btnLimpar.textContent = "Limpar Toda a Semana";
btnLimpar.style.cssText = "background-color: #ff5252; margin-left: 10px; padding: 8px 15px; color: white; border: none; border-radius: 4px; cursor: pointer;";

btnSalvar.parentNode.appendChild(btnLimpar);

let celulaSelecionada = null;

const horarios = [
    "08:00", "09:00", "10:00", "11:00", "12:00", 
    "13:00", "14:00", "15:00", "16:00", "17:00", 
    "18:00", "19:00", "20:00", "21:00", "22:00"
];

function atualizarContador() {
    const concluidas = document.querySelectorAll('.tarefa-celula.concluida').length;
    contadorTxt.textContent = `✅ Tarefas concluídas: ${concluidas}`;
}

function gerarTabela() {
    const dadosSalvos = JSON.parse(localStorage.getItem('minhaRotina')) || {};
    const dadosChecks = JSON.parse(localStorage.getItem('checksRotina')) || {};

    horarios.forEach(horario => {
        const tr = document.createElement('tr');
        
        const tdHorario = document.createElement('td');
        tdHorario.textContent = horario;
        tr.appendChild(tdHorario);

        for (let i = 1; i <= 7; i++) {
            const tdTarefa = document.createElement('td');
            tdTarefa.classList.add('tarefa-celula');
            
            const chave = `${horario}-${i}`;
            tdTarefa.dataset.chave = chave; 
            tdTarefa.textContent = dadosSalvos[chave] || "";

            if (dadosChecks[chave]) {
                tdTarefa.classList.add('concluida');
            }

            tdTarefa.addEventListener('click', () => selecionarCelula(tdTarefa));

         
            tdTarefa.addEventListener('contextmenu', (e) => {
                e.preventDefault(); 
                tdTarefa.classList.toggle('concluida');
                
                const checksAtuais = JSON.parse(localStorage.getItem('checksRotina')) || {};
                checksAtuais[chave] = tdTarefa.classList.contains('concluida');
                localStorage.setItem('checksRotina', JSON.stringify(checksAtuais));
                
                atualizarContador();
            });

            tr.appendChild(tdTarefa);
        }
        corpoTabela.appendChild(tr);
    });
    atualizarContador(); 
}

function selecionarCelula(td) {
    if (celulaSelecionada) {
        celulaSelecionada.classList.remove('selecionada');
    }
    celulaSelecionada = td;
    celulaSelecionada.classList.add('selecionada');
    inputTarefa.value = celulaSelecionada.textContent;
    inputTarefa.focus();
}

function salvarTarefa() {
    if (!celulaSelecionada) {
        alert("Clique em uma célula primeiro!");
        return;
    }

    celulaSelecionada.textContent = inputTarefa.value;
    const dadosSalvos = JSON.parse(localStorage.getItem('minhaRotina')) || {};
    const chave = celulaSelecionada.dataset.chave;
    dadosSalvos[chave] = inputTarefa.value;

    localStorage.setItem('minhaRotina', JSON.stringify(dadosSalvos));
    
    celulaSelecionada.classList.remove('selecionada');
    celulaSelecionada = null;
    inputTarefa.value = "";
}

btnLimpar.addEventListener('click', () => {
    if (confirm("Deseja apagar toda a rotina e os progressos?")) {
        localStorage.removeItem('minhaRotina');
        localStorage.removeItem('checksRotina');
        location.reload();
    }
});

btnSalvar.addEventListener('click', salvarTarefa);
inputTarefa.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') salvarTarefa();
});

gerarTabela();