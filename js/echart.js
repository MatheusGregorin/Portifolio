async function fetchRepositories() {
    const resquest = await fetch('https://api.github.com/users/matheus-gregorin/repos');
    return await resquest.json();
}

// Função 1: Carregar o gráfico de pizza
function loadPie() {
    fetchRepositories().then(repositories => {
        const pie = echarts.init(document.getElementById('pie'));

        const counter = {};
        const languages = [];
        repositories.forEach(repository => {
            const lang = repository.language || 'Outros';
            counter[lang] = (counter[lang] || 0) + 1;
        });

        Object.entries(counter).forEach(([key, value]) => {
            languages.push({ 'name': key, 'value': value });
        });

        pie.setOption({
            title: {
                text: '',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'horizontal',
                bottom: 'bottom',
            },
            series: [{
                name: 'Linguagem',
                type: 'pie',
                radius: '40%',
                data: languages,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        });

        window.addEventListener('resize', () => chart.resize());
    });
}

// Função 2: Carregar outro gráfico ou fazer outra ação
function loadBar() {
    fetchRepositories().then(repositories => {
        const bar = echarts.init(document.getElementById('bar'));

        const names = repositories.map(repo => repo.name);
        const stars = repositories.map(repo => repo.stargazers_count);

        bar.setOption({
            title: {
                text: '',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                data: names
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: stars,
                type: 'bar'
            }]
        });

        window.addEventListener('resize', () => bar.resize());
    });
}

// Função 2: Carregar outro gráfico ou fazer outra ação
function loadLine() {
    fetchRepositories().then(repositories => {
        const line = echarts.init(document.getElementById('line'));

        const dates = repositories.map(repo => new Date(repo.created_at).toLocaleDateString());
        const names = repositories.map(repo => repo.name);

        line.setOption({
            title: {
                text: '',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                data: dates,
                axisLabel: {
                    rotate: 45, // Rotaciona as labels das datas para melhor visualização
                    interval: 0  // Exibe todas as datas
                }
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: names.map((name, index) => ({
                    name: name,
                    value: index + 1 // A posição do repositório é representada no eixo Y
                })),
                type: 'line',
                smooth: true, // Torna a linha mais suave
                itemStyle: {
                    color: 'blue'
                }
            }]
        });

        window.addEventListener('resize', () => line.resize());
    });
}

// Aguardar o carregamento da página e chamar todas as funções
document.addEventListener('DOMContentLoaded', () => {
    loadPie();  // Chama a função do gráfico de pizza
    loadBar();  // Chama a função do gráfico de barras
    loadLine(); // Chama a função do gráfico de linha
});
