let pontuacao = 0;
let respostaCorreta;
let nomeUsuario;
let ranking = [];
let tempoRestante;
let tempoInterval;

document.getElementById('resposta').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        verificarResposta();
    }
});

function iniciarJogo() {
    nomeUsuario = document.getElementById('nome-usuario').value.trim();
    if (nomeUsuario === '') {
        alert('Por favor, preencha seu nome corretamente.');
        return;
    }
    
    document.getElementById('nome-container').style.display = 'none';
    document.getElementById('container-jogo').classList.remove('d-none');
    document.getElementById('pontuacao').innerText = pontuacao;
    document.getElementById('jogador-atual').innerText = `Jogador: ${nomeUsuario}`;
    iniciarTempo();
    gerarPergunta();
}

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

function gerarPergunta() {
    let numero1 = Math.floor(Math.random() * 10) + 1;
    let numero2 = Math.floor(Math.random() * 10) + 1;
    let operadores = ['+', '-', '*', '/'];
    let operador = operadores[Math.floor(Math.random() * operadores.length)];
    respostaCorreta = eval(`${numero1} ${operador} ${numero2}`).toFixed(1);
    document.getElementById('pergunta').innerText = `${numero1} ${operador} ${numero2} = ?`;
}

function verificarResposta() {
    let respostaUsuario = document.getElementById('resposta').value;
    document.getElementById('resposta').value = '';

    if (parseFloat(respostaUsuario) === parseFloat(respostaCorreta)) {
        pontuacao++;
        document.getElementById('pontuacao').innerText = pontuacao;
        document.getElementById('resultado').innerText = 'Correto!';
        document.getElementById('resultado').style.color = 'green';
        
        gerarPergunta(); // Gera uma nova pergunta sem reiniciar o tempo

    } else {
        document.getElementById('resultado').innerText = `Errado! A resposta correta era ${respostaCorreta}.`;
        document.getElementById('resultado').style.color = 'red';
        finalizarJogo(); // O jogo termina imediatamente se errar
    }
}

function finalizarJogo() {
    clearInterval(tempoInterval);
    alert(`Fim do jogo, ${nomeUsuario}! Sua pontuação foi: ${pontuacao}`);
    ranking.push({ nome: nomeUsuario, pontos: pontuacao });
    ranking.sort((a, b) => b.pontos - a.pontos);
    atualizarRanking();
    document.getElementById('container-jogo').classList.add('d-none');
}

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
    document.getElementById('ranking-container').style.display = 'block';
}

// Função para salvar o ranking
async function salvarRanking() {
    try {
        const response = await fetch("http://127.0.0.1:5000/salvar_ranking", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ranking: ranking }) // ranking deve ser um array atualizado
        });

        const data = await response.json(); // Aguarda a resposta do servidor
        alert(data.mensagem); // Exibe mensagem de sucesso
    } catch (error) {
        console.error("Erro ao salvar ranking:", error);
    }
}

// Função para limpar o ranking
async function limparRanking() {
    try {
        const response = await fetch("http://127.0.0.1:5000/limpar_ranking", {
            method: "POST"
        });

        const data = await response.json(); // Aguarda a resposta do servidor
        alert(data.mensagem); // Exibe mensagem de sucesso
        location.reload(); // Recarrega a página para limpar a tela
    } catch (error) {
        console.error("Erro ao limpar ranking:", error);
    }
}

// Adicionar eventos aos botões
document.getElementById("salvarRanking").addEventListener("click", salvarRanking);
document.getElementById("limparRanking").addEventListener("click", limparRanking);

function novoJogo() {
    // Exibir o campo de inserção do nome
    document.getElementById("nome-container").style.display = "block"; 
    
    // Esconder o jogo
    document.getElementById("container-jogo").classList.add("d-none"); 
    
    // Resetar os campos do formulário
    document.getElementById("nome-usuario").value = ""; 
    document.getElementById("resposta").value = "";
    document.getElementById("resultado").innerText = "";
    
    // Restaurar o design do input de nome (caso tenha sido alterado)
    document.getElementById("nome-container").classList.remove("d-none"); 
    document.getElementById("nome-usuario").classList.remove("is-invalid"); 

    // Resetar pontuação
    pontuacao = 0;
    document.getElementById("pontuacao").innerText = pontuacao;
    
    // Parar o tempo
    clearInterval(tempoInterval);
}

// Botão de Novo Jogo
document.getElementById("novoJogo").addEventListener("click", novoJogo);