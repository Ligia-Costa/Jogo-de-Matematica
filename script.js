let pontuacao = 0;
let respostaCorreta;
let nomeUsuario;
let ranking = [];
let tempoRestante;
let tempoInterval;
let nivel = 1;
let meta = 10; // Pontuação necessária para subir de nível

// Evento para enviar resposta ao pressionar Enter
document.getElementById('resposta').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        verificarResposta();
    }
});

// Evento para enviar resposta ao pressionar Enter (Nome)
document.getElementById('nome-usuario').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        iniciarJogo();
    }
});

// Inicia o jogo
function iniciarJogo() {
    nomeUsuario = document.getElementById('nome-usuario').value.trim();
    if (nomeUsuario === '') {
        alert('Por favor, preencha seu nome corretamente.');
        return;
    }
    document.getElementById('tela-inicial').style.display = 'none';
    document.getElementById('container-jogo').classList.remove('hidden');
    document.getElementById('pontuacao').innerText = pontuacao;
    document.getElementById('jogador-atual').innerText = `Jogador: ${nomeUsuario}`;
    iniciarTempo();
    gerarPergunta();
    document.getElementById('resposta').focus();
};

// Inicia o cronômetro
function iniciarTempo() {
    tempoRestante = 30;
    document.getElementById('tempo').innerText = tempoRestante;
    clearInterval(tempoInterval);
    tempoInterval = setInterval(() => {
        tempoRestante--;
        document.getElementById('tempo').innerText = tempoRestante;
        if (tempoRestante <= 0) {
            clearInterval(tempoInterval);
            finalizarJogo();
        }
    }, 1000);
};

// Gera pergunta matemática com base no nível
function gerarPergunta() {
    const maxNumero = nivel * 10;
    const numero1 = Math.floor(Math.random() * maxNumero) + 1;
    const numero2 = Math.floor(Math.random() * 3) + 2; // Limita o expoente para evitar números muito grandes
    const operadores = ['+', '-', '*', '/', '√'];

    // Adiciona a operação de potência apenas a partir do nível 2
    if (nivel >= 2) {
        operadores.push('^');
    };

    const operador = operadores[Math.floor(Math.random() * operadores.length)];

    switch (operador) {
        case '+':
            respostaCorreta = numero1 + numero2;
            document.getElementById('pergunta').innerText = `${numero1} + ${numero2} = ?`;
            break;
        case '-':
            respostaCorreta = numero1 - numero2;
            document.getElementById('pergunta').innerText = `${numero1} - ${numero2} = ?`;
            break;
        case '*':
            respostaCorreta = numero1 * numero2;
            document.getElementById('pergunta').innerText = `${numero1} × ${numero2} = ?`; // Substitui * por ×
            break;
        case '/':
            respostaCorreta = apenasUmaCasaDecimal(numero1 / numero2);
            document.getElementById('pergunta').innerText = `${numero1} ÷ ${numero2} = ?`; // Substitui / por ÷
            break;
        case '√':
            const raizInteira = Math.floor(Math.random() * maxNumero) + 1;
            respostaCorreta = raizInteira;
            const numeroRaiz = raizInteira * raizInteira; // Garante que a raiz seja exata
            document.getElementById('pergunta').innerText = `√${numeroRaiz} = ?`;
            break;
        case '^':
            respostaCorreta = Math.pow(numero1, numero2);
            const expoenteSobrescrito = numero2.toString().replace(/./g, char => {
                const sobrescritos = { '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '0': '⁰' };
                return sobrescritos[char] || char;
            });
            document.getElementById('pergunta').innerText = `${numero1}${expoenteSobrescrito} = ?`; // Exibe no formato 3³
            break;
    };
};

// Função para limitar a resposta a uma casa decimal
function apenasUmaCasaDecimal(numero) {
    return Math.floor(numero * 10) / 10;
};

// Verifica a resposta do jogador
function verificarResposta() {
    const respostaUsuario = parseFloat(document.getElementById('resposta').value);
    document.getElementById('resposta').value = '';

    if (respostaUsuario === respostaCorreta) {
        pontuacao++;
        document.getElementById('pontuacao').innerText = pontuacao;
        document.getElementById('resultado').innerText = 'Correto!';
        document.getElementById('resultado').style.color = 'green';

        // Verifica se o jogador atingiu a meta para subir de nível
        if (pontuacao >= meta) {
            nivel++;
            meta += 10; // Aumenta a meta para o próximo nível
            tempoRestante += 20; // Adiciona 20 segundos ao cronômetro
            document.getElementById('tempo').innerText = tempoRestante;

            // Atualiza o badge do nível
            const nivelBadge = document.getElementById('nivel-badge');
            nivelBadge.innerText = nivel;
            nivelBadge.classList.add('bg-success'); // Adiciona uma cor de destaque temporária

            // Remove o destaque após 2 segundos
            setTimeout(() => {
                nivelBadge.classList.remove('bg-success');
                nivelBadge.classList.add('bg-primary');
            }, 2000);
        };

        gerarPergunta();
    } else {
        document.getElementById('resultado').innerText = `Errado! A resposta correta era ${respostaCorreta}.`;
        document.getElementById('resultado').style.color = 'red';
        finalizarJogo(); // Finaliza o jogo imediatamente
    };
};

// Finaliza o jogo
function finalizarJogo() {
    clearInterval(tempoInterval);
    alert(`Fim do jogo, ${nomeUsuario}! Sua pontuação foi: ${pontuacao}`);
    ranking.push({ nome: nomeUsuario, pontos: pontuacao });
    ranking.sort((a, b) => b.pontos - a.pontos);
    atualizarRanking();
    document.getElementById('container-jogo').classList.add('hidden');
    document.getElementById('ranking-container').style.display = 'block';
};

// Atualiza o ranking no DOM
function atualizarRanking() {
    const listaRanking = document.getElementById('ranking');
    listaRanking.innerHTML = '';
    const podium = ['🥇', '🥈', '🥉'];
    ranking.slice(0, 3).forEach((jogador, index) => {
        const novoItem = document.createElement('li');
        novoItem.classList.add('list-group-item', 'text-center');
        novoItem.innerHTML = `${podium[index] || ''} ${jogador.nome}: ${jogador.pontos} pontos`;
        listaRanking.appendChild(novoItem);
    });
};

// Função para salvar o ranking em um arquivo TXT
function salvarRanking() {
    if (ranking.length === 0) {
        alert("O ranking está vazio.");
        return;
    };

    let textoRanking = "Ranking do Matemáticando:\n\n";

    ranking.forEach(function(jogador, index) {
        textoRanking += `${index + 1}º Lugar: ${jogador.nome} - ${jogador.pontos} pts\n`;
    });

    const agora = new Date();
    const dataFormatada = agora.toLocaleDateString('pt-BR').replace(/\//g, '-');
    const horaFormatada = agora.toLocaleTimeString('pt-BR').replace(/:/g, '-');
    const nomeArquivo = `ranking_${dataFormatada}_${horaFormatada}.txt`;

    const blob = new Blob([textoRanking], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = nomeArquivo;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

// Função para limpar o ranking
function limparRanking() {
    localStorage.removeItem('rankingMatematicando');
    ranking = [];
    atualizarRanking();
    location.reload();
};

// Começa um novo jogo
function novoJogo() {
    nivel = 1;
    pontuacao = 0;
    meta = 10;
    document.getElementById('pontuacao').innerText = pontuacao;
    document.getElementById('tempo').innerText = 30;
    document.getElementById('resultado').innerText = '';
    document.getElementById('ranking-container').style.display = 'none';
    document.getElementById('tela-inicial').style.display = 'flex';
};