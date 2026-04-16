const charts = {
    pie: new Chart(document.getElementById('pieChart'), {
        type: 'pie',
        data: { labels: [], datasets: [{ data: [], backgroundColor: ['#060775', '#ff0000', '#ffae00', '#1eff00', '#9b59b6'] }]},
        options: { responsive: true, maintainAspectRatio: false }
    }),
    bar: new Chart(document.getElementById('barChart'), {
        type: 'bar',
        data: { labels: [], datasets: [{ label: 'Gastos por Categoria', data: [], backgroundColor: '#04d9ff' }]},
        options: { responsive: true, maintainAspectRatio: false }
    })
};

async function atualizarInterface() {
    try {
        const resp = await fetch('http://192.168.15.43:3000/dados-dashboard');
        const dadosDoBanco = await resp.json();

        let resumoCategorias = {};
        dadosDoBanco.forEach(item => {
            const catLimpa = item.categoria.trim().toLowerCase();
            if (resumoCategorias[catLimpa]) {
                resumoCategorias[catLimpa] += parseFloat(item.total);
            } else {
                resumoCategorias[catLimpa] = parseFloat(item.total);
            }
        });

        const labels = Object.keys(resumoCategorias).map(c => c.charAt(0).toUpperCase() + c.slice(1));
        const valores = Object.values(resumoCategorias);

        charts.pie.data.labels = labels;
        charts.pie.data.datasets[0].data = valores;
        charts.pie.update();

        charts.bar.data.labels = labels;
        charts.bar.data.datasets[0].data = valores;
        charts.bar.update();

        let totalGeral = valores.reduce((a, b) => a + b, 0);
        document.getElementById('gastos').textContent = `R$ ${totalGeral.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;

        const investTotal = resumoCategorias['investimentos'] || 0;
        document.getElementById('investimentos').textContent = `R$ ${investTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;

    } catch (err) {
        console.error("Erro ao conectar no servidor pelo IP:", err);
    }
}

document.getElementById('btnAtualizar').addEventListener('click', atualizarInterface);

document.getElementById('toggleSidebar').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('collapsed');
    document.getElementById('main').classList.toggle('collapsed');
    setTimeout(() => Object.values(charts).forEach(c => c.resize()), 450);
});

document.getElementById('toggleDark').addEventListener('click', () => {
    document.body.classList.toggle('dark');
});

window.addEventListener('DOMContentLoaded', atualizarInterface);