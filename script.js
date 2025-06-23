// Carrinho de compras
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
let produtos = [];

// Redirecionar para login
function redirectToLogin() {
    window.location.href = "login.html";
}

// Buscar produtos da API
async function buscarProdutos() {
    const productsGrid = document.getElementById('productsGrid');
    const authRequiredMessage = document.getElementById('authRequiredMessage');
    const usuario = localStorage.getItem("usuarioLogado");

    if (!usuario) {
        productsGrid.style.display = 'none';
        authRequiredMessage.style.display = 'block';
        return;
    } else {
        productsGrid.style.display = 'grid';
        authRequiredMessage.style.display = 'none';
    }

    productsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">⏳</div>
            <p>Carregando produtos...</p>
        </div>
    `;

    try {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const dados = await response.json();

        // Transformar os dados da API para nosso formato
        produtos = dados.map(produto => ({
            id: produto.id,
            nome: produto.title,
            preco: produto.price, // Preço em dólar, sem conversão para reais
            categoria: produto.category,
            imagem: produto.image,
            descricao: produto.description.substring(0, 100) + '...',
            rating: produto.rating
        }));

        carregarProdutos();
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        // Fallback para produtos locais em caso de erro
        produtos = [
            {
                id: 1,
                nome: "Arroz Integral",
                preco: 8.50,
                categoria: "Grãos",
                imagem: "https://via.placeholder.com/300x300/667eea/ffffff?text=🌾",
                descricao: "Arroz integral rico em fibras",
                rating: { rate: 4.5, count: 120 }
            },
            {
                id: 2,
                nome: "Feijão Preto",
                preco: 6.80,
                categoria: "Grãos",
                imagem: "https://via.placeholder.com/300x300/667eea/ffffff?text=🫘",
                descricao: "Feijão preto de qualidade",
                rating: { rate: 4.8, count: 200 }
            },
            {
                id: 3,
                nome: "Leite Desnatado",
                preco: 4.20,
                categoria: "Laticínios",
                imagem: "https://via.placeholder.com/300x300/667eea/ffffff?text=🥛",
                descricao: "Leite desnatado UHT",
                rating: { rate: 4.0, count: 80 }
            }
        ];
        carregarProdutos();
        mostrarNotificacao('Erro ao carregar produtos da API. Exibindo produtos de exemplo.', 'error');
    }
}

// Verificar se o usuário está logado
function verificarLogin() {
    const usuario = localStorage.getItem("usuarioLogado");
    const userInfo = document.getElementById('userInfo');
    const loginButtons = document.getElementById('loginButtons');
    const userName = document.getElementById('userName');

    if (usuario) {
        userInfo.style.display = 'flex';
        loginButtons.style.display = 'none';
        userName.textContent = `Olá, ${usuario}!`;
    } else {
        userInfo.style.display = 'none';
        loginButtons.style.display = 'flex';
    }
    // Recarregar produtos para exibir ou ocultar com base no status de login
    buscarProdutos();
}

// Função de logout
function logout() {
    localStorage.removeItem("usuarioLogado");
    localStorage.removeItem("carrinho"); // Limpa o carrinho ao fazer logout
    verificarLogin();
    atualizarContadorCarrinho();
    alert('Logout realizado com sucesso!');
    window.location.href = "index.html"; // Redireciona para a página inicial após o logout
}

// Carregar produtos na página
function carregarProdutos() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = ''; // Limpa o "Carregando produtos..."

    if (produtos.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #555;">
                <p>Nenhum produto disponível no momento.</p>
            </div>
        `;
        return;
    }

    produtos.forEach(produto => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${produto.imagem}" alt="${produto.nome}" onerror="this.src='https://via.placeholder.com/300x300/667eea/ffffff?text=📦'">
            </div>
            <div class="product-info">
                <h3>${produto.nome}</h3>
                <p class="product-category">${produto.categoria}</p>
                <p class="product-description">${produto.descricao}</p>
                <div class="product-rating">
                    ${produto.rating ? `⭐ ${produto.rating.rate} (${produto.rating.count} avaliações)` : ''}
                </div>
                <div class="product-price">R$ ${produto.preco.toFixed(2)}</div>
                <button class="add-to-cart" onclick="adicionarAoCarrinho(${produto.id})">
                    Adicionar ao Carrinho
                </button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Adicionar produto ao carrinho
function adicionarAoCarrinho(produtoId) {
    const usuario = localStorage.getItem("usuarioLogado");
    if (!usuario) {
        mostrarNotificacao('Por favor, faça login para adicionar produtos ao carrinho.', 'error');
        return;
    }

    const produto = produtos.find(p => p.id === produtoId);
    const itemExistente = carrinho.find(item => item.id === produtoId);

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            imagem: produto.imagem,
            quantidade: 1
        });
    }

    salvarCarrinho();
    atualizarContadorCarrinho();
    mostrarNotificacao(`${produto.nome} adicionado ao carrinho!`);
}

// Salvar carrinho no localStorage
function salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    carregarCarrinho(); // Atualiza a sidebar do carrinho
}

// Atualizar contador do carrinho
function atualizarContadorCarrinho() {
    const cartCount = document.getElementById('cartCount');
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    cartCount.textContent = totalItens;
}

// Mostrar notificação
function mostrarNotificacao(mensagem, tipo = 'success') {
    const notificacao = document.createElement('div');
    notificacao.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${tipo === 'success' ? 'linear-gradient(45deg, #667eea, #764ba2)' : '#dc3545'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease forwards;
        opacity: 0;
    `;
    notificacao.textContent = mensagem;
    document.body.appendChild(notificacao);

    setTimeout(() => {
        notificacao.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            document.body.removeChild(notificacao);
        }, 300);
    }, 3000); // Notificação visível por 3 segundos
}


// Toggle do carrinho
function toggleCart() {
    const cart = document.getElementById('cart');
    const overlay = document.getElementById('cartOverlay');

    if (cart.classList.contains('open')) {
        cart.classList.remove('open');
        overlay.classList.remove('show');
    } else {
        cart.classList.add('open');
        overlay.classList.add('show');
        carregarCarrinho(); // Garante que o carrinho está atualizado ao abrir
    }
}

// Carregar itens do carrinho na sidebar
function carregarCarrinho() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    cartItems.innerHTML = '';

    if (carrinho.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Carrinho vazio</p>';
        cartTotal.textContent = '0,00';
        return;
    }

    let total = 0;

    carrinho.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.imagem}" alt="${item.nome}" onerror="this.src='https://via.placeholder.com/60x60/667eea/ffffff?text=📦'">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.nome}</div>
                <div class="cart-item-price">R$ ${item.preco.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="alterarQuantidade(${item.id}, -1)">-</button>
                    <span>${item.quantidade}</span>
                    <button class="quantity-btn" onclick="alterarQuantidade(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removerItem(${item.id})">Remover</button>
        `;
        cartItems.appendChild(cartItem);

        total += item.preco * item.quantidade;
    });

    cartTotal.textContent = total.toFixed(2);
}

// Alterar quantidade de um item
function alterarQuantidade(produtoId, delta) {
    const item = carrinho.find(item => item.id === produtoId);

    if (item) {
        item.quantidade += delta;

        if (item.quantidade <= 0) {
            removerItem(produtoId);
        } else {
            salvarCarrinho(); // Salva e recarrega a sidebar
            atualizarContadorCarrinho();
        }
    }
}

// Remover item do carrinho
function removerItem(produtoId) {
    carrinho = carrinho.filter(item => item.id !== produtoId);
    salvarCarrinho(); // Salva e recarrega a sidebar
    atualizarContadorCarrinho();
}

// Redirecionar para a página de checkout (cart.html)
function goToCheckout() {
    const usuario = localStorage.getItem("usuarioLogado");
    if (!usuario) {
        mostrarNotificacao('Por favor, faça login para finalizar a compra.', 'error');
        return;
    }
    if (carrinho.length === 0) {
        mostrarNotificacao('Seu carrinho está vazio. Adicione produtos antes de finalizar a compra.', 'error');
        return;
    }
    window.location.href = "cart.html";
}


// Scroll suave para seções
function scrollToProducts() {
    document.getElementById('produtos').scrollIntoView({
        behavior: 'smooth'
    });
}

// Inicialização quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    verificarLogin(); // Verifica o login e carrega os produtos
    atualizarContadorCarrinho(); // Atualiza o contador do carrinho na barra de navegação

    // Adicionar smooth scroll para links de navegação
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Verificar login a cada mudança de storage (ex: outra aba fez login/logout)
window.addEventListener('storage', function(e) {
    if (e.key === 'usuarioLogado' || e.key === 'carrinho') {
        verificarLogin();
        atualizarContadorCarrinho();
        if (document.getElementById('cart').classList.contains('open')) {
            carregarCarrinho(); // Atualiza a sidebar se estiver aberta
        }
    }
});