document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("cadastroForm").addEventListener("submit", function (e) {
        e.preventDefault();

        const login = document.getElementById("login").value.trim();
        const senha = document.getElementById("senha").value;
        const mensagem = document.getElementById("mensagem");

        if (!login || !senha) {
            mensagem.textContent = "Por favor, preencha todos os campos.";
            mensagem.className = "error";
            return;
        }

        if (login.length < 3) {
            mensagem.textContent = "O usuário deve ter pelo menos 3 caracteres.";
            mensagem.className = "error";
            return;
        }

        if (senha.length < 4) {
            mensagem.textContent = "A senha deve ter pelo menos 4 caracteres.";
            mensagem.className = "error";
            return;
        }

        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        const existente = usuarios.find(u => u.login === login);

        if (existente) {
            mensagem.textContent = "Este usuário já está cadastrado.";
            mensagem.className = "error";
            return;
        }

        usuarios.push({ login, senha });
        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        mensagem.textContent = "Usuário cadastrado com sucesso! Redirecionando para login...";
        mensagem.className = "success";
        document.getElementById("cadastroForm").reset();

        setTimeout(() => {
            window.location.href = "login.html";
        }, 2000);
    });
});