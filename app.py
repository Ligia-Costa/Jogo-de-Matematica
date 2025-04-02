from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Permite requisições de outras origens (frontend)

RANKING_FILE = "ranking.txt"  # Arquivo onde o ranking será salvo

# Rota para salvar o ranking
@app.route("/salvar_ranking", methods=["POST"])
def salvar_ranking():
    data = request.json  # Recebe os dados do frontend
    ranking = data.get("ranking", [])

    with open(RANKING_FILE, "w") as file:
        for jogador in ranking:
            file.write(f"{jogador['nome']} - {jogador['pontos']}\n")

    return jsonify({"mensagem": "Ranking salvo com sucesso!"})

# Rota para limpar o ranking
@app.route("/limpar_ranking", methods=["POST"])
def limpar_ranking():
    open(RANKING_FILE, "w").close()  # Apaga o conteúdo do arquivo
    return jsonify({"mensagem": "Ranking limpo!"})

# Rota para carregar o ranking
@app.route("/carregar_ranking", methods=["GET"])
def carregar_ranking():
    ranking = []
    try:
        with open(RANKING_FILE, "r") as file:
            for linha in file:
                nome, pontos = linha.strip().split(" - ")
                ranking.append({"nome": nome, "pontos": int(pontos)})
    except FileNotFoundError:
        pass  # Se o arquivo não existir, retorna uma lista vazia

    return jsonify({"ranking": ranking})

if __name__ == "__main__":
    app.run(debug=True)  # Inicia o servidor Flask