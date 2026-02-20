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

function fact(n) {
    let result = 1
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

window.onload = function() {
    let a = '';
    let b = '';
    let expressionResult = '';
    let selectedOperation = null;

    let memory = 0;

    const outputElement = document.getElementById("result")
    const digitButtons = document.querySelectorAll('[id ^= "btn_digit_"]')

    function onDigitButtonClicked(digit) {
        if (!selectedOperation) {
            if ((digit != '.') || (digit == '.' && !a.includes(digit))) {
                a += digit;
            }
            outputElement.innerHTML = a;
        }
        else {
            if ((digit != '.') || (digit == '.' && !b.includes(digit))) {
                b += digit;
                outputElement.innerHTML = b;
            }
        }
    }

    digitButtons.forEach(button => {
        button.onclick = function() {
            const digitValue = button.innerHTML;
            onDigitButtonClicked(digitValue);
        }
    });

    document.getElementById("btn_op_mult").onclick = function() {
        if (a === '') return;
        selectedOperation = 'x';
    }

    document.getElementById("btn_op_plus").onclick = function() {
        if (a === '') return;
        selectedOperation = '+';
    }

    document.getElementById("btn_op_minus").onclick = function() {
        if (a === '') return;
        selectedOperation = '-';
    }

    document.getElementById("btn_op_div").onclick = function() {
        if (a === '') return;
        selectedOperation = '/';
    }

    document.getElementById("btn_op_pow_y").onclick = function() {
        if (a === '') return;
        selectedOperation = '^';
    }

    document.getElementById("btn_op_sign").onclick = function() {
        if (a === '') return;
        if (b !== '') {
            b = (parseFloat(b) * -1).toString();
            outputElement.innerHTML = b;
        } else {
            a = (parseFloat(a) * -1).toString();
            outputElement.innerHTML = a;
        }
    }

    document.getElementById("btn_op_percent").onclick = function() {
        if (a === '') return;
        if (b !== '') {
            b = (parseFloat(b) / 100).toString();
            outputElement.innerHTML = b;
        } else {
            a = (parseFloat(a) / 100).toString();
            outputElement.innerHTML = a;
        }
    }

    document.getElementById("btn_op_backspace").onclick = function() {
        if (a === '') return;
        if (b !== '') {
            b = b.slice(0, -1);
            outputElement.innerHTML = b || 0;
        } else {
            a = a.slice(0, -1);
            outputElement.innerHTML = a || 0;
        }
    }

    document.getElementById("btn_op_sqrt").onclick = function() {
        if (a === '') return;
        if (b !== '') {
            b = Math.sqrt(+b).toString();
            outputElement.innerHTML = b;
        } else {
            a = Math.sqrt(+a).toString();
            outputElement.innerHTML = a;
        }
    }

    document.getElementById("btn_op_x1000").onclick = function() {
        if (a === '') return;
        if (b !== '') {
            if (!b.includes('.')) b += '000';
            outputElement.innerHTML = b;
        } else {
            if (!a.includes('.')) a += '000';
            outputElement.innerHTML = a;
        }
    }

    document.getElementById("btn_op_fact").onclick = function() {
        if (a === '') return;
        if (b !== '') {
            b = fact(Math.floor(+b)).toString();
            outputElement.innerHTML = b;
        } else {
            a = fact(Math.floor(+a)).toString();
            outputElement.innerHTML = a;
        }
    }

    document.getElementById("btn_op_pow_2").onclick = function() {
        if (a === '') return;
        if (b !== '') {
            b = Math.pow(+b, 2).toString();
            outputElement.innerHTML = b;
        } else {
            a = Math.pow(+a, 2).toString();
            outputElement.innerHTML = a;
        }
    }

    document.getElementById("btn_op_clear").onclick = function() {
        a = ''
        b = ''
        selectedOperation = ''
        expressionResult = ''
        outputElement.innerHTML = 0
    }

    document.getElementById("btn_op_equal").onclick = function() {
        if (a === '' || b === '' || !selectedOperation) return;

        switch(selectedOperation) {
            case 'x':
                expressionResult = (+a) * (+b)
                break;
            case '+':
                expressionResult = (+a) + (+b)
                break;
            case '-':
                expressionResult = (+a) - (+b)
                break;
            case '/':
                expressionResult = (+a) / (+b)
                break;
            case '^':
                expressionResult = Math.pow((+a), (+b))
                break;
            default:
                break;
        }

        a = expressionResult.toString()
        b = ''
        selectedOperation = null

        outputElement.innerHTML = a
    }

    document.getElementById("btn_mem_plus").onclick = function() {
        if (a === '') return;
        let currentVal = (b !== '') ? b : a;
        memory += parseFloat(currentVal);
    }

    document.getElementById("btn_mem_minus").onclick = function() {
        if (a === '') return;
        let currentVal = (b !== '') ? b : a;
        memory -= parseFloat(currentVal);
    }

    document.getElementById("btn_mem_recall").onclick = function() {
        if (selectedOperation) {
            b = memory.toString();
            outputElement.innerHTML = b;
        } else {
            a = memory.toString();
            outputElement.innerHTML = a;
        }
    }

    document.getElementById("change-calc-color").onclick = function() {
        document.querySelector(".calculator-container").classList.toggle("calc-alt-color");
    };

    document.getElementById("change-result-color").onclick = function() {
        document.getElementById("result").classList.toggle("res-alt-color");
    };
}
