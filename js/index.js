document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('light-theme');
            themeToggle.textContent = document.body.classList.contains('light-theme')
                ? 'Включить тёмную тему'
                : 'Включить светлую тему';
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

function fact(n) {
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
}

window.onload = function() {
    let a = '';
    let b = '';
    let expressionResult = '';
    let selectedOperation = null;
    let memory = 0;
    let isFinalResult = false;

    const outputElement = document.getElementById("result");
    if (!outputElement) return;

    function formatOutput(val) {
        let str = val.toString();
        if (str.length > 10) {
            let num = parseFloat(val);
            return num.toExponential(5); // 5 знаков после запятой в экспоненте
        }
        return str;
    }

    const calcContainer = document.querySelector('.calculator-container');
    if (calcContainer) {
        calcContainer.addEventListener('click', function(event) {
            let currentBtn = event.target;
            if (!currentBtn.classList.contains('my-btn')) return;

            const val = currentBtn.innerHTML;

            // 1. Backspace
            if (val === '←') {
                if (isFinalResult) {
                    a = '';
                    outputElement.innerHTML = '0';
                    isFinalResult = false;
                } else if (a !== '') {
                    a = a.slice(0, -1);
                    outputElement.innerHTML = (a === '' || a === '-') ? '0' : formatOutput(a);
                    if (a === '-') a = '';
                }
                return;
            }

            // 2. Унарный минус
            if (val === '+/-') {
                if (a !== '') {
                    a = (parseFloat(a) * -1).toString();
                    outputElement.innerHTML = formatOutput(a);
                    isFinalResult = false;
                }
                return;
            }

            // 3. Кнопка 1k
            if (val === '1k') {
                if (isFinalResult) {
                    a = '1000';
                    isFinalResult = false;
                } else {
                    if (a === '' || a === '0') a = '1000';
                    else {
                        if (a.includes('.')) a += '000';
                        else a = (BigInt(a) * 1000n).toString();
                    }
                }
                outputElement.innerHTML = formatOutput(a);
                return;
            }

            if (['+', '-', 'x', '/', 'xⁿ'].includes(val)) {
                if (a === '') return;
                b = a;
                a = '';
                selectedOperation = (val === 'xⁿ') ? '^' : val;
                outputElement.innerHTML = '0';
                isFinalResult = false;
                return;
            }

            // 5. Мгновенные операции
            if (val === 'x!') {
                if (a !== '') {
                    a = fact(parseInt(a)).toString();
                    outputElement.innerHTML = formatOutput(a);
                    isFinalResult = true;
                }
                return;
            }

            if (val === '√') {
                if (a !== '') {
                    a = Math.sqrt(parseFloat(a)).toString();
                    outputElement.innerHTML = formatOutput(a);
                    isFinalResult = true;
                }
                return;
            }

            if (['C', '=', 'M+', 'M-', 'MR'].includes(val)) return;

            // 6. Ввод цифр и точки
            if ((val >= '0' && val <= '9') || val === '.') {
                if (isFinalResult) {
                    a = (val === '.') ? '0.' : val;
                    isFinalResult = false;
                } else {
                    if (val === '.' && a.includes('.')) return;
                    // Ограничиваем ввод до 15 символов физически, но отображаем красиво
                    if (a.length >= 15) return;
                    if (a === '0' && val !== '.') a = '';
                    a += val;
                }
                outputElement.innerHTML = formatOutput(a);
            }
        });
    }

    // Кнопка очистки (C)
    document.getElementById("btn_op_clear").onclick = function() {
        a = ''; b = ''; selectedOperation = null;
        isFinalResult = false;
        outputElement.innerHTML = '0';
    };

    // Кнопка Равно (=)
    document.getElementById("btn_op_equal").onclick = function() {
        if (a === '' || b === '' || !selectedOperation) return;

        let num1 = parseFloat(b);
        let num2 = parseFloat(a);

        switch(selectedOperation) {
            case 'x': expressionResult = num1 * num2; break;
            case '+': expressionResult = num1 + num2; break;
            case '-': expressionResult = num1 - num2; break;
            case '/': expressionResult = num1 / num2; break;
            case '^': expressionResult = Math.pow(num1, num2); break;
        }

        a = expressionResult.toString();
        b = '';
        selectedOperation = null;
        isFinalResult = true;
        outputElement.innerHTML = formatOutput(a);
    };

    // Работа с памятью
    document.getElementById("btn_mem_plus").onclick = function() {
        if (a !== '') memory += parseFloat(a);
    };

    document.getElementById("btn_mem_minus").onclick = function() {
        if (a !== '') memory -= parseFloat(a);
    };

    document.getElementById("btn_mem_recall").onclick = function() {
        a = memory.toString();
        outputElement.innerHTML = formatOutput(a);
        isFinalResult = true;
    };

    document.getElementById("change-calc-color").onclick = function() {
        document.querySelector(".calculator-container").classList.toggle("calc-alt-color");
    };

    document.getElementById("change-result-color").onclick = function() {
        document.getElementById("result").classList.toggle("res-alt-color");
    };
};
