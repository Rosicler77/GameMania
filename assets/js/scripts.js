//carrinho

// Adiciona produto ao carrinho
function adicionarAoCarrinho(nome, preco, imagem) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

    let produtoExistente = carrinho.find(item => item.nome === nome);
    if (produtoExistente) {
        produtoExistente.quantidade += 1;
    } else {
        carrinho.push({
            nome: nome,
            preco: preco,
            imagem: imagem,
            quantidade: 1
        });
    }

    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    window.location.href = "carrinho.html";
}

// Remove item do carrinho
function removerDoCarrinho(nome) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    carrinho = carrinho.filter(item => item.nome !== nome);
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    mostrarCarrinho();
}

// Atualiza quantidade
function atualizarQuantidade(nome, quantidade) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    let item = carrinho.find(i => i.nome === nome);
    if (item) {
        item.quantidade = parseInt(quantidade);
        if (item.quantidade <= 0) {
            carrinho = carrinho.filter(i => i.nome !== nome);
        }
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
        mostrarCarrinho();
    }
}

// Limpa carrinho
function limparCarrinho() {
    localStorage.removeItem("carrinho");
    mostrarCarrinho();
}

// Mostra o carrinho com cards
function mostrarCarrinho() {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    let container = document.getElementById("carrinho-itens");
    container.innerHTML = "";
    let total = 0;

    if (carrinho.length === 0) {
        container.innerHTML = "<p>O carrinho está vazio.</p>";
        document.getElementById("total").innerText = "Total: R$ 0,00";
        return;
    }

    carrinho.forEach(item => {
        let card = document.createElement("div");
        card.classList.add("card", "mb-3");
        card.innerHTML = `
            <div class="row g-0 align-items-center">
                <div class="col-md-2 text-center">
                    <img src="${item.imagem}" class="img-fluid rounded-start" alt="${item.nome}">
                </div>
                <div class="col-md-6">
                    <div class="card-body">
                        <h5 class="card-title">${item.nome}</h5>
                        <p class="card-text">R$ ${item.preco.toFixed(2)}</p>
                    </div>
                </div>
                <div class="col-md-2 text-center">
                    <input type="number" min="0" value="${item.quantidade}" class="form-control"
                        onchange="atualizarQuantidade('${item.nome}', this.value)">
                </div>
                <div class="col-md-2 text-center">
                    <button class="btn btn-danger" onclick="removerDoCarrinho('${item.nome}')">Remover</button>
                </div>
            </div>
        `;
        container.appendChild(card);
        total += item.preco * item.quantidade;
    });

    document.getElementById("total").innerText = `Total: R$ ${total.toFixed(2)}`;
}

// Executa ao carregar a página
window.onload = mostrarCarrinho;






function abrirPopup(titulo, descricao, imagem, preco) {

    // CONFIGURAÇÕES
    const descontoPix = 0.10;         // 10% de desconto no PIX
    const jurosMensal = 0.025;        // 2.5% ao mês no cartão
    const parcelas = 12;              // quantidade de parcelas

    // Cálculo PIX
    const valorPix = (preco * (1 - descontoPix)).toFixed(2);

    // Cálculo com juros compostos no cartão
    const valorTotalComJuros = (preco * Math.pow(1 + jurosMensal, parcelas)).toFixed(2);
    const valorParcela = (valorTotalComJuros / parcelas).toFixed(2);

    document.getElementById("popupTitulo").textContent = titulo;

    document.getElementById("popupTexto").innerHTML = `
        ${descricao}<br><br>

        <strong>💰 À vista no PIX:</strong>  
        <span style="color:green; font-size:18px;">R$ ${valorPix}</span><br><br>

        <strong>💳 No cartão (12x com juros):</strong><br>
        12x de <strong>R$ ${valorParcela}</strong><br>
        Total: <strong>R$ ${valorTotalComJuros}</strong><br><br>

        <strong>Preço original:</strong> R$ ${preco.toFixed(2)}
    `;

    document.getElementById("popupImagem").src = imagem;

    document.getElementById("popupDescricao").style.display = "flex";
}

function fecharPopup() {
    document.getElementById("popupDescricao").style.display = "none";
}


/*favoritos */

// SEMPRE carregar favoritos ao iniciar
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

// Salva no localStorage
function salvarFavoritos() {
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

function carregarFavoritos() {
    return JSON.parse(localStorage.getItem("favoritos")) || [];
}

/* ------- Alternar Favorito ------- */
function toggleFavorito(icone, nome, preco, imagem) {
    favoritos = carregarFavoritos(); // <-- GARANTE QUE ESTÁ ATUALIZADO

    const item = { nome, preco, imagem };
    const existe = favoritos.find(f => f.nome === nome);

    if (existe) {
        favoritos = favoritos.filter(f => f.nome !== nome);
        icone.classList.remove("ativo");
    } else {
        favoritos.push(item);
        icone.classList.add("ativo");
    }

    salvarFavoritos();
    atualizarContadorFavoritos();
}

/* ------- Atualizar contador ------- */
function atualizarContadorFavoritos() {
    favoritos = carregarFavoritos(); // <-- SEMPRE pega a versão correta

    const contador = document.getElementById("favCount");
    if (contador) {
        contador.textContent = favoritos.length;

        // efeito visual
        contador.classList.add("animar");
        setTimeout(() => contador.classList.remove("animar"), 300);
    }
}

/* ------- Marcar corações do produto ------- */
document.addEventListener("DOMContentLoaded", () => {
    favoritos = carregarFavoritos();
    atualizarContadorFavoritos();

    document.querySelectorAll(".favorite-icon").forEach(icon => {
        const nome = icon.getAttribute("onclick").split(",")[1].replace(/'/g, "").trim();
        if (favoritos.find(f => f.nome === nome)) {
            icon.classList.add("ativo");
        }
    });
});

