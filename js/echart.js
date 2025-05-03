document.addEventListener('DOMContentLoaded', async () => {
    const chart = echarts.init(document.getElementById('chart'));

    const resquest = await fetch('https://api.github.com/users/matheus-gregorin/repos');
    const repositories = await resquest.json();

    const counter = {};
    const languages = [];
    repositories.forEach((repository, i) => {
        const lang = repository.language || 'Outros';

        if (!counter[lang]) {
            counter[lang] = 1;
        } else {
            counter[lang] += 1;
        }
    });

    Object.entries(counter).forEach(([key, value]) => {
        languages.push({ 'name': key, 'value': value });
    });

    chart.setOption({
        title: {
            text: 'Linguagens por Repositório',
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

    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
});
