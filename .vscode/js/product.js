document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById("product-list");
    const loadingMessage = document.getElementById("loading-message");
    const authRequired = document.getElementById("auth-required");
    const cartCountSpan = document.getElementById("cart-count");

    // Verifica se o usuário está logado
    const usuarioLogado = localStorage.getItem("usuarioLogado");

    if (!usuarioLogado) {
        // Se não estiver logado, exibe mensagem e oculta produtos
        productList.style.display = "none";
        loadingMessage.style.display = "none";
        authRequired.style.display = "block";
        return; // Sai da função
    }

    // Função para atualizar a contagem do carrinho na interface
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountSpan.textContent = totalItems;
    }

    // Chamada inicial para mostrar o número de itens no carrinho
    updateCartCount();

    // Função para adicionar produto ao carrinho
    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        alert(`${product.title} adicionado ao carrinho!`);
        updateCartCount(); // Atualiza a contagem após adicionar
    }

    // Função para buscar e exibir os produtos
    async function fetchProducts() {
        try {
            loadingMessage.textContent = "Carregando produtos...";
            const response = await fetch("https://fakestoreapi.com/products");
            const products = await response.json();

            loadingMessage.style.display = "none"; // Esconde a mensagem de carregamento

            if (products.length === 0) {
                productList.innerHTML = "<p>Nenhum produto encontrado.</p>";
                return;
            }

            productList.innerHTML = ""; // Limpa a mensagem de carregamento

            products.forEach(product => {
                const productCard = document.createElement("div");
                productCard.className = "product-card";
                productCard.innerHTML = `
                    <img src="${product.image}" alt="${product.title}" />
                    <h3>${product.title}</h3>
                    <p>${product.description}</p>
                    <div class="price">R$ ${product.price.toFixed(2)}</div>
                    <button class="add-to-cart-btn" data-product-id="${product.id}">Adicionar ao Carrinho</button>
                `;
                productList.appendChild(productCard);
            });

            // Adiciona event listeners aos botões "Adicionar ao Carrinho"
            document.querySelectorAll(".add-to-cart-btn").forEach(button => {
                button.addEventListener("click", (e) => {
                    const productId = parseInt(e.target.dataset.productId);
                    const selectedProduct = products.find(p => p.id === productId);
                    if (selectedProduct) {
                        addToCart(selectedProduct);
                    }
                });
            });

        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
            loadingMessage.textContent = "Erro ao carregar produtos. Tente novamente mais tarde.";
        }
    }

    // Chama a função para buscar produtos
    fetchProducts();
});