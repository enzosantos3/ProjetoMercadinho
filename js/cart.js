document.addEventListener("DOMContentLoaded", () => {
    const cartItemsList = document.getElementById("cart-items");
    const cartTotalSpan = document.getElementById("cart-total");
    const emptyCartMessage = document.getElementById("empty-cart-message");
    const clearCartButton = document.getElementById("clear-cart-button");
    const checkoutButton = document.getElementById("checkout-button");

    const checkoutModal = document.getElementById("checkoutModal");
    const closeButton = document.querySelector(".close-button");
    const checkoutForm = document.getElementById("checkoutForm");
    const checkoutMessage = document.getElementById("checkout-message");

    // Verifica se o usuário está logado
    const usuarioLogado = localStorage.getItem("usuarioLogado");
    if (!usuarioLogado) {
        // Se não estiver logado, redireciona para a página de login
        window.location.href = "login.html";
        return;
    }

    function getCart() {
        return JSON.parse(localStorage.getItem("cart")) || [];
    }

    function saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
    }

    function updateCartItemQuantity(productId, change) {
        let cart = getCart();
        const itemIndex = cart.findIndex(item => item.id === productId);

        if (itemIndex > -1) {
            cart[itemIndex].quantity += change;
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1); // Remove if quantity is 0 or less
            }
            saveCart(cart);
        }
    }

    function removeItemFromCart(productId) {
        let cart = getCart();
        cart = cart.filter(item => item.id !== productId);
        saveCart(cart);
    }

    function clearCart() {
        if (confirm("Tem certeza que deseja limpar todo o carrinho?")) {
            localStorage.removeItem("cart");
            renderCart();
            alert("Carrinho limpo!");
        }
    }

    function calculateCartTotal(cart) {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    function renderCart() {
        const cart = getCart();
        cartItemsList.innerHTML = ""; // Limpa a lista existente

        if (cart.length === 0) {
            emptyCartMessage.style.display = "block";
            cartTotalSpan.textContent = "0.00";
            clearCartButton.style.display = "none";
            checkoutButton.style.display = "none";
            return;
        } else {
            emptyCartMessage.style.display = "none";
            clearCartButton.style.display = "inline-block";
            checkoutButton.style.display = "inline-block";
        }

        cart.forEach(item => {
            const listItem = document.createElement("li");
            listItem.className = "cart-item";
            listItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}" />
                <div class="item-details">
                    <h3>${item.title}</h3>
                    <p>Preço unitário: R$ ${item.price.toFixed(2)}</p>
                </div>
                <div class="item-quantity">
                    <button class="quantity-btn" data-id="${item.id}" data-change="-1">-</button>
                    <input type="number" value="${item.quantity}" min="1" readonly>
                    <button class="quantity-btn" data-id="${item.id}" data-change="1">+</button>
                </div>
                <div class="item-total">
                    R$ ${(item.price * item.quantity).toFixed(2)}
                </div>
                <button class="remove-item" data-id="${item.id}">Remover</button>
            `;
            cartItemsList.appendChild(listItem);
        });

        // Adiciona event listeners para botões de quantidade
        document.querySelectorAll(".quantity-btn").forEach(button => {
            button.addEventListener("click", (e) => {
                const productId = parseInt(e.target.dataset.id);
                const change = parseInt(e.target.dataset.change);
                updateCartItemQuantity(productId, change);
            });
        });

        // Adiciona event listeners para botões de remover
        document.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", (e) => {
                const productId = parseInt(e.target.dataset.id);
                removeItemFromCart(productId);
            });
        });

        cartTotalSpan.textContent = calculateCartTotal(cart).toFixed(2);
    }

    // Event listeners para os botões principais do carrinho
    clearCartButton.addEventListener("click", clearCart);
    checkoutButton.addEventListener("click", () => {
        const cart = getCart();
        if (cart.length === 0) {
            alert("Seu carrinho está vazio. Adicione produtos antes de finalizar a compra.");
            return;
        }
        checkoutModal.style.display = "block";
        checkoutMessage.textContent = ""; // Limpa mensagens anteriores
    });

    // Event listeners para o modal de checkout
    closeButton.addEventListener("click", () => {
        checkoutModal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === checkoutModal) {
            checkoutModal.style.display = "none";
        }
    });

    checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault();
        // Aqui você faria a integração real com um backend de pagamento e entrega.
        // Por simplicidade, vamos simular um sucesso.

        const nome = document.getElementById("nome").value;
        const endereco = document.getElementById("endereco").value;
        const pagamento = document.getElementById("pagamento").value;

        if (!nome || !endereco || !pagamento) {
            checkoutMessage.style.color = "#dc3545"; // Vermelho
            checkoutMessage.textContent = "Por favor, preencha todos os campos.";
            return;
        }

        // Simula o processamento do pedido
        checkoutMessage.style.color = "#4CAF50"; // Verde
        checkoutMessage.textContent = "Processando seu pedido...";

        setTimeout(() => {
            alert("Pedido finalizado com sucesso! Obrigado por sua compra.");
            localStorage.removeItem("cart"); // Limpa o carrinho após a compra
            checkoutModal.style.display = "none";
            renderCart(); // Atualiza a visualização do carrinho
            checkoutForm.reset(); // Limpa o formulário de checkout
            window.location.href = "index.html"; // Redireciona para o catálogo
        }, 2000);
    });

    // Renderiza o carrinho ao carregar a página
    renderCart();
});