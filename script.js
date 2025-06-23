// Carrinho de compras
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
let produtos = [];

// Buscar produtos da API
async function buscarProdutos() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        const dados = await response.json();
        
        // Transformar os dados da API para nosso formato
        produtos = dados.map((produto, index) => ({
            id: produto.id,
            nome: produto.title,
            preco: produto.price,
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
                descricao: "Arroz integral rico em fibras"
            },
            {
                id: 2,
                nome: "Feijão Preto",
                preco: 6.80,
                categoria: "Grãos",
                imagem: "https://via.placeholder.com/300x300/667eea/ffffff?text=🫘",
                descricao: "Feijão preto de qualidade"
            }
        ];
        carregarProdutos();
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
}

// Função de logout
function logout() {
    localStorage.removeItem("usuarioLogado");
    verificarLogin();
    alert('Logout realizado com sucesso!');
}

// Carregar produtos na página
function carregarProdutos() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';

    if (produtos.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">⏳</div>
                <p>Carregando produtos...</p>
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
}

// Atualizar contador do carrinho
function atualizarContadorCarrinho() {
    const cartCount = document.getElementById('cartCount');
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    cartCount.textContent = totalItens;
}

// Mostrar notificação
function mostrarNotificacao(mensagem) {
    const notificacao = document.createElement('div');
    notificacao.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notificacao.textContent = mensagem;
    document.body.appendChild(notificacao);

    setTimeout(() => {
        notificacao.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notificacao);
        }, 300);
    }, 2000);
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
        carregarCarrinho();
    }
}

// Carregar itens do carrinho
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
            salvarCarrinho();
            atualizarContadorCarrinho();
            carregarCarrinho();
        }
    }
}

// Remover item do carrinho
function removerItem(produtoId) {
    carrinho = carrinho.filter(item => item.id !== produtoId);
    salvarCarrinho();
    atualizarContadorCarrinho();
    carregarCarrinho();
}

// Finalizar compra
function checkout() {
    if (carrinho.length === 0) {
        alert('Carrinho vazio!');
        return;
    }

    const usuario = localStorage.getItem("usuarioLogado");
    if (!usuario) {
        alert('Faça login para finalizar a compra!');
        toggleCart();
        return;
    }

    const total = carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    
    const confirmacao = confirm(`Total da compra: R$ ${total.toFixed(2)}\n\nConfirmar compra?`);
    
    if (confirmacao) {
        // Simular processamento da compra
        alert('Compra realizada com sucesso! Obrigado por escolher nosso mercadinho!');
        
        // Limpar carrinho
        carrinho = [];
        salvarCarrinho();
        atualizarContadorCarrinho();
        carregarCarrinho();
        toggleCart();
    }
}

// Scroll suave para seções
function scrollToProducts() {
    document.getElementById('produtos').scrollIntoView({
        behavior: 'smooth'
    });
}

// Adicionar animações CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Inicialização quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    verificarLogin();
    buscarProdutos(); // Buscar produtos da API
    atualizarContadorCarrinho();
    
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

// Verificar login a cada mudança de página
window.addEventListener('storage', function(e) {
    if (e.key === 'usuarioLogado') {
        verificarLogin();
    }
}); 