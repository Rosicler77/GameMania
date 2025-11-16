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
