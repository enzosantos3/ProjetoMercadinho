document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("loginForm").addEventListener("submit", function (e) {
        e.preventDefault();

        const loginInput = document.getElementById("login").value.trim();
        const senhaInput = document.getElementById("senha").value;
        const mensagem = document.getElementById("mensagem");

        if (!loginInput || !senhaInput) {
            mensagem.textContent = "Por favor, preencha todos os campos.";
            mensagem.style.color = "#d8000c"; // Red
            return;
        }

        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        const usuarioEncontrado = usuarios.find(u => u.login === loginInput && u.senha === senhaInput);

        if (usuarioEncontrado) {
            localStorage.setItem("usuarioLogado", usuarioEncontrado.login); // Armazena o login do usuário
            mensagem.textContent = "Login bem-sucedido! Redirecionando...";
            mensagem.style.color = "green"; // Green
            document.getElementById("loginForm").reset();

            setTimeout(() => {
                window.location.href = "index.html"; // Redireciona para a página principal
            }, 1000);
        } else {
            mensagem.textContent = "Credenciais inválidas. Tente novamente.";
            mensagem.style.color = "#d8000c"; // Red
        }
    });
});