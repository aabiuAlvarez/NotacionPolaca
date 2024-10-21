document.getElementById('notationForm').addEventListener('submit', function (e) {
    e.preventDefault();

    let expression = document.getElementById('expression').value;

    // Validar que no haya números negativos
    if (/[-]\d+/.test(expression)) {
        alert('No se permiten números negativos.');
        return;
    }

    try {
        // Convertir la expresión a notación polaca (RPN)
        let rpn = infixToRPN(expression);
        document.getElementById('result').textContent = `Notación Polaca: ${rpn}`;
    } catch (error) {
        alert('Expresión inválida. Por favor, verifica la entrada.');
    }
});

function infixToRPN(expression) {
    let outputQueue = [];
    let operatorStack = [];
    let operators = {
        '+': { precedence: 1, associativity: 'Left' },
        '-': { precedence: 1, associativity: 'Left' },
        '*': { precedence: 2, associativity: 'Left' },
        '/': { precedence: 2, associativity: 'Left' }
    };

    // Convertir la expresión en tokens (números y operadores)
    let tokens = expression.match(/\d+|[+\-*/()]/g);

    tokens.forEach(token => {
        // Si el token es un número, se agrega a la cola de salida
        if (/\d/.test(token)) {
            outputQueue.push(token);
        } 
        // Si el token es un operador
        else if (token in operators) {
            let o1 = token;
            let o2 = operatorStack[operatorStack.length - 1];
            // Apilamiento de operadores basado en precedencia y asociatividad
            while (o2 in operators && (
                (operators[o1].associativity === 'Left' && operators[o1].precedence <= operators[o2].precedence) ||
                (operators[o1].associativity === 'Right' && operators[o1].precedence < operators[o2].precedence)
            )) {
                outputQueue.push(operatorStack.pop());
                o2 = operatorStack[operatorStack.length - 1];
            }
            operatorStack.push(o1);
        } 
        // Si el token es un paréntesis de apertura
        else if (token === '(') {
            operatorStack.push(token);
        } 
        // Si el token es un paréntesis de cierre
        else if (token === ')') {
            while (operatorStack[operatorStack.length - 1] !== '(') {
                outputQueue.push(operatorStack.pop());
            }
            operatorStack.pop();
        }
    });

    // Vaciar la pila de operadores al final
    while (operatorStack.length > 0) {
        outputQueue.push(operatorStack.pop());
    }

    return outputQueue.join(' ');
}
