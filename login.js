document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const login = document.getElementById("login").value.trim();
    const senha = document.getElementById("senha").value;
    const mensagem = document.getElementById("mensagem");
  
    if (!login || !senha) {
        mensagem.textContent = "Por favor, preencha todos os campos.";
        mensagem.className = "error";
        return;
    }
  
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuario = usuarios.find(u => u.login === login && u.senha === senha);
  
    if (usuario) {
        localStorage.setItem("usuarioLogado", login);
        mensagem.textContent = "Login realizado com sucesso! Redirecionando...";
        mensagem.className = "success";
        
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500);
    } else {
        mensagem.textContent = "Usuário ou senha incorretos.";
        mensagem.className = "error";
    }
});
  