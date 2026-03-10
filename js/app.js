const { createApp, ref, onMounted, computed, nextTick } = Vue;

const DataService = {
    async fetchRepositories(username) {
        try {
            const response = await fetch(`https://api.github.com/users/${username}/repos`);
            if (!response.ok) throw new Error('Failed to fetch repositories');
            return await response.json();
        } catch (error) {
            console.error('Error fetching repositories:', error);
            return [];
        }
    },
    async fetchCommits(username, repo) {
        try {
            const response = await fetch(`https://api.github.com/repos/${username}/${repo}/commits`);
            if (!response.ok) throw new Error('Failed to fetch commits');
            const commits = await response.json();
            return Array.isArray(commits) ? commits.length : 0;
        } catch (error) {
            console.error(`Error fetching commits for ${repo}:`, error);
            return 0;
        }
    }
};

createApp({
    setup() {
        const isMenuOpen = ref(false);
        const isDarkMode = ref(true);
        const projects = ref([]);
        const projectShow = ref({});
        const showProject = ref(false);
        const qtdCommits = ref(0);
        const loading = ref(true);

        const techStack = [
            { name: 'JavaScript', icon: './assets/javascript.jpg' },
            { name: 'Node.js', icon: './assets/nodejs.jpg' },
            { name: 'Vue.js', icon: './assets/vueJs.jpg' },
            { name: 'React', icon: './assets/react.jpg' },
            { name: 'Java', icon: './assets/java.jpg' },
            { name: 'Spring', icon: './assets/spring.jpg' },
            { name: 'Python', icon: './assets/python.png' },
            { name: 'PHP', icon: './assets/php.png' },
            { name: 'Laravel', icon: './assets/laravel.png' },
            { name: 'SQLite', icon: './assets/sqlite.jpg' },
            { name: 'SOLID', icon: './assets/SOLID.png' },
            { name: 'DDD', icon: './assets/DDD.png' },
            { name: 'TDD', icon: './assets/Tdd.png' },
            { name: 'Clean Arch', icon: './assets/Clean.png' }
        ];

        const colors = [
            'bg-slate-600', 'bg-blue-600', 'bg-emerald-600', 'bg-rose-600',
            'bg-amber-600', 'bg-purple-600', 'bg-indigo-600', 'bg-cyan-600'
        ];

        const themeClasses = computed(() => ({
            bg: isDarkMode.value ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900',
            bgAlt: isDarkMode.value ? 'bg-slate-900' : 'bg-slate-100',
            text: isDarkMode.value ? 'text-slate-100' : 'text-slate-900',
            card: isDarkMode.value ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200',
            nav: isDarkMode.value ? 'bg-slate-950/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'
        }));

        const updateGlobalTheme = () => {
            const html = document.documentElement;
            const body = document.body;

            if (isDarkMode.value) {
                html.classList.add('dark');
                body.classList.remove('bg-slate-50', 'text-slate-900');
                body.classList.add('bg-slate-950', 'text-slate-100');
            } else {
                html.classList.remove('dark');
                body.classList.remove('bg-slate-950', 'text-slate-100');
                body.classList.add('bg-slate-50', 'text-slate-900');
            }
        };

        const toggleMenu = () => isMenuOpen.value = !isMenuOpen.value;
        const toggleMode = () => {
            isDarkMode.value = !isDarkMode.value;
            updateGlobalTheme();

            // Re-init charts with new theme colors
            nextTick(() => {
                if (window.PortfolioCharts) {
                    window.PortfolioCharts.renderCharts(projects.value, isDarkMode.value);
                }
            });
        };

        const toggleProject = async (index, show) => {
            if (show) {
                projectShow.value = projects.value[index];
                showProject.value = true;
                qtdCommits.value = await DataService.fetchCommits('MatheusGregorin', projectShow.value.name);
                goToSection('projects-intro');
            } else {
                showProject.value = false;
            }
        };

        const goToSection = (id) => {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        };

        const getRandomColorClass = () => colors[Math.floor(Math.random() * colors.length)];

        onMounted(async () => {
            updateGlobalTheme();

            projects.value = await DataService.fetchRepositories('MatheusGregorin');
            loading.value = false;

            // Initialize ECharts once data is loaded and DOM is ready
            nextTick(() => {
                if (window.PortfolioCharts) {
                    window.PortfolioCharts.init(projects.value, isDarkMode.value);
                }

                // Initialize animations
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('is-visible');
                        }
                    });
                }, { threshold: 0.1 });

                document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
            });
        });

        return {
            isMenuOpen, isDarkMode, projects, projectShow, showProject,
            qtdCommits, loading, themeClasses, techStack, toggleMenu, toggleMode,
            toggleProject, goToSection, getRandomColorClass
        };
    }
}).mount('#app');
