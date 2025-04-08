let pontuacao = 0;
let respostaCorreta;
let nomeUsuario;
let ranking = [];
let tempoRestante;
let tempoInterval;

// Evento para enviar resposta ao pressionar Enter
// (associado ao campo de resposta)
document.getElementById('resposta').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        verificarResposta();
    }
});

document.getElementById('nome-usuario').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        iniciarJogo();
    }
});

// Inicia o jogo: valida nome, esconde tela-incial, mostra jogo e inicializa a pontuação e tempo
function iniciarJogo() {
    nomeUsuario = document.getElementById('nome-usuario').value.trim();
    if (nomeUsuario === '') {
        alert('Por favor, preencha seu nome corretamente.');
        return;
    }
    document.getElementById('tela-inicial').style.display = 'none';
    document.getElementById('container-jogo').classList.remove('d-none');
    document.getElementById('pontuacao').innerText = pontuacao;
    document.getElementById('jogador-atual').innerText = `Jogador: ${nomeUsuario}`;
    iniciarTempo();
    gerarPergunta();
}

// Inicia o cronômetro de 30 segundos
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
}

// Gera pergunta matemática aleatória
function gerarPergunta() {
    let numero1 = Math.floor(Math.random() * 10) + 1;
    let numero2 = Math.floor(Math.random() * 10) + 1;
    let operadores = ['+', '-', '*', '/'];
    let operador = operadores[Math.floor(Math.random() * operadores.length)];
    respostaCorreta = eval(`${numero1} ${operador} ${numero2}`).toFixed(1);
    document.getElementById('pergunta').innerText = `${numero1} ${operador} ${numero2} = ?`;
}

// Verifica a resposta inserida pelo usuário
function verificarResposta() {
    let respostaUsuario = document.getElementById('resposta').value;
    document.getElementById('resposta').value = '';

    if (parseFloat(respostaUsuario) === parseFloat(respostaCorreta)) {
        pontuacao++;
        document.getElementById('pontuacao').innerText = pontuacao;
        document.getElementById('resultado').innerText = 'Correto!';
        document.getElementById('resultado').style.color = 'green';
        gerarPergunta();
    } else {
        document.getElementById('resultado').innerText = `Errado! A resposta correta era ${respostaCorreta}.`;
        document.getElementById('resultado').style.color = 'red';
        finalizarJogo();
    }
}

// Finaliza o jogo e exibe pontuação, atualiza ranking
function finalizarJogo() {
    clearInterval(tempoInterval);
    alert(`Fim do jogo, ${nomeUsuario}! Sua pontuação foi: ${pontuacao}`);
    ranking.push({ nome: nomeUsuario, pontos: pontuacao });
    ranking.sort((a, b) => b.pontos - a.pontos);
    atualizarRanking();
    document.getElementById('container-jogo').classList.add('d-none');
    document.getElementById('ranking-container').style.display = 'block';
}

// Atualiza a lista do ranking no DOM
function atualizarRanking() {
    let listaRanking = document.getElementById('ranking');
    listaRanking.innerHTML = '';
    let podium = ['🥇', '🥈', '🥉'];
    ranking.slice(0, 3).forEach((jogador, index) => {
        let novoItem = document.createElement('li');
        novoItem.classList.add('list-group-item', 'text-center');
        novoItem.innerHTML = `${podium[index] || ''} ${jogador.nome}: ${jogador.pontos} pontos`;
        listaRanking.appendChild(novoItem);
    });
}

// Função para salvar o ranking em um arquivo TXT
function salvarRanking() {
    if (ranking.length === 0) {
        alert("O ranking está vazio.");
        return;
    }

    let textoRanking = "Ranking do Matemáticando:\n\n";

    ranking.forEach(function(jogador, index) {
        const pontuacaoFormatada = jogador.pontos + " pts";
        textoRanking += obterOrdinal(index + 1) + ' Lugar: ' + jogador.nome + ' - ' + pontuacaoFormatada + '\n';
    });

    const agora = new Date();
    const dataFormatada = agora.toLocaleDateString('pt-BR').replace(/\//g, '-');
    const horaFormatada = agora.toLocaleTimeString('pt-BR').replace(/:/g, '-');
    const nomeArquivo = 'ranking_' + dataFormatada + '_' + horaFormatada + '.txt';

    const blob = new Blob([textoRanking], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = nomeArquivo;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function limparRanking() {
    localStorage.removeItem('rankingCronometro');
    ranking = [];
    atualizarRanking();
    location.reload();
}
// Função para limpar o ranking do localStorage
function limparRanking() {
    localStorage.removeItem('rankingCronometro'); // Remove o ranking do localStorage
    ranking = []; // Limpa o array do ranking
    atualizarRanking(); // Atualiza a exibição do ranking
    location.reload(); // Recarrega a página para atualizar tudo
}

// Começa um novo jogo
function novoJogo() {
    document.getElementById("tela-inicial").style.display = "flex";
    document.getElementById("container-jogo").classList.add("d-none");
    document.getElementById("ranking-container").style.display = "none";
    document.getElementById("nome-usuario").value = "";
    document.getElementById("resposta").value = "";
    document.getElementById("resultado").innerText = "";
    pontuacao = 0;
    document.getElementById("pontuacao").innerText = pontuacao;
    clearInterval(tempoInterval);
}