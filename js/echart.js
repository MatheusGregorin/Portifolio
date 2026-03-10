let charts = {};

const ChartThemes = {
    dark: {
        text: '#f8fafc', // slate-50 for better contrast
        axis: '#64748b', // slate-500
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4']
    },
    light: {
        text: '#0f172a', // slate-900
        axis: '#94a3b8', // slate-400
        colors: ['#2563eb', '#059669', '#d97706', '#dc2626', '#7c3aed', '#db2777', '#0891b2']
    }
};

window.PortfolioCharts = {
    async init(repositories, isDarkMode) {
        try {
            this.loadStatistics(repositories);
            this.renderCharts(repositories, isDarkMode);
        } catch (error) {
            console.error('Error initializing charts:', error);
        }
    },

    loadStatistics(repositories) {
        const stats = {
            languages: new Set(),
            stars: 0,
            projects: repositories.length,
            professional: 5
        };

        repositories.forEach(repo => {
            if (repo.language) stats.languages.add(repo.language);
            stats.stars += repo.stargazers_count;
        });

        const elements = {
            'qtdLangValue': stats.languages.size,
            'qtdStarValue': stats.stars,
            'qtdProjectsValue': stats.projects,
            'qtdMerchantsValue': stats.professional
        };

        Object.entries(elements).forEach(([id, val]) => {
            const el = document.getElementById(id);
            if (el) el.innerText = val;
        });
    },

    renderCharts(repositories, isDarkMode) {
        const theme = isDarkMode ? ChartThemes.dark : ChartThemes.light;

        // 1. Languages Pie
        const langCounter = {};
        repositories.forEach(repo => {
            const lang = repo.language || 'Others';
            langCounter[lang] = (langCounter[lang] || 0) + 1;
        });
        const pieData = Object.entries(langCounter).map(([name, value]) => ({ name, value }));

        const pieEl = document.getElementById('pie');
        if (pieEl) {
            if (charts.pie) {
                charts.pie.dispose();
            }
            const pie = echarts.init(pieEl);
            pie.setOption({
                color: theme.colors,
                title: { text: 'Languages', left: 'center', textStyle: { color: theme.text, fontFamily: 'Outfit' } },
                tooltip: { trigger: 'item', padding: 10, backgroundColor: 'rgba(15, 23, 42, 0.9)', textStyle: { color: '#fff' } },
                series: [{
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: { borderRadius: 10, borderColor: 'transparent', borderWidth: 2 },
                    label: { show: false },
                    data: pieData
                }]
            });
            charts.pie = pie;
        }

        // 2. Projects Timeline
        const timelineData = [...repositories].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        const lineEl = document.getElementById('line');
        if (lineEl) {
            if (charts.line) {
                charts.line.dispose();
            }
            const line = echarts.init(lineEl);
            line.setOption({
                color: [theme.colors[0]],
                title: { text: 'Project Timeline', left: 'center', textStyle: { color: theme.text, fontFamily: 'Outfit' } },
                xAxis: { type: 'category', data: timelineData.map(r => new Date(r.created_at).getFullYear()), axisLabel: { color: theme.text } },
                yAxis: { type: 'value', axisLabel: { color: theme.text }, splitLine: { lineStyle: { color: theme.axis, opacity: 0.2 } } },
                series: [{ data: timelineData.map((_, i) => i + 1), type: 'line', smooth: true, areaStyle: { opacity: 0.1 } }]
            });
            charts.line = line;
        }

        // 3. Stars Bar
        const barEl = document.getElementById('bar');
        if (barEl) {
            if (charts.bar) {
                charts.bar.dispose();
            }
            const bar = echarts.init(barEl);
            bar.setOption({
                color: [theme.colors[1]],
                title: { text: 'Stars per Repo', left: 'center', textStyle: { color: theme.text, fontFamily: 'Outfit' } },
                xAxis: { type: 'category', data: repositories.map(r => r.name.substring(0, 10)), axisLabel: { color: theme.text, rotate: 45 } },
                yAxis: { type: 'value', axisLabel: { color: theme.text }, splitLine: { lineStyle: { color: theme.axis, opacity: 0.2 } } },
                series: [{ data: repositories.map(r => r.stargazers_count), type: 'bar', itemStyle: { borderRadius: [5, 5, 0, 0] } }]
            });
            charts.bar = bar;
        }

        window.addEventListener('resize', () => Object.values(charts).forEach(c => c && c.resize()));
    }
};
