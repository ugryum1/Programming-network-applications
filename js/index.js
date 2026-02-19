document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');

    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('light-theme');

        if (document.body.classList.contains('light-theme')) {
            themeToggle.textContent = 'Включить тёмную тему';
        } else {
            themeToggle.textContent = 'Включить светлую тему';
        }
    })

    const themeSelect = document.getElementById('theme-select')

    if (themeSelect) {
        themeSelect.addEventListener('change', function() {
            if (this.value === 'light') {
                document.body.classList.add('light-theme');
                header.classList.add('light-theme');
            } else {
                document.body.classList.remove('light-theme');
                header.classList.remove('light-theme');
            }
        });
    }

    const backgroundSelect = document.getElementById('background-select');

    if (backgroundSelect) {
        const savedBg = localStorage.getItem('background');
        if (savedBg === 'image') {
            document.body.classList.add('bg-image');
            backgroundSelect.value = 'image';
        }

        backgroundSelect.addEventListener('change', function() {
            if (this.value === 'image') {
                document.body.classList.add('bg-image');
                localStorage.setItem('background', 'image');
            } else {
                document.body.classList.remove('bg-image');
                localStorage.setItem('background', 'solid');
            }
        });
    }
});
