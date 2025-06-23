# 🛒 Mercadinho Online

Um sistema completo de e-commerce desenvolvido com HTML, CSS e JavaScript puro, utilizando as cores azul e roxo conforme solicitado. O projeto integra com a **FakeStoreAPI** para buscar produtos reais da internet.

## ✨ Funcionalidades

- **Sistema de Autenticação**: Login e cadastro de usuários
- **Catálogo de Produtos**: Produtos reais da FakeStoreAPI
- **Carrinho de Compras**: Adicionar, remover e alterar quantidades
- **Design Responsivo**: Funciona em desktop e mobile
- **Persistência de Dados**: Usa localStorage para salvar dados
- **Interface Moderna**: Design com gradientes azul e roxo
- **API Integration**: Produtos dinâmicos da FakeStoreAPI

## 🎨 Design

O projeto utiliza uma paleta de cores baseada em azul e roxo:
- **Azul Principal**: `#667eea`
- **Roxo Principal**: `#764ba2`
- **Gradientes**: Combinações suaves entre azul e roxo
- **Interface**: Design moderno com efeitos de glassmorphism

## 📁 Estrutura do Projeto

```
mercadinho/
├── index.html          # Página principal do mercadinho
├── login.html          # Página de login
├── cadastro.html       # Página de cadastro
├── dashboard.html      # Painel de controle
├── styles.css          # Estilos CSS
├── script.js           # JavaScript principal
├── login.js            # JavaScript do login
├── cadastro.js         # JavaScript do cadastro
└── README.md           # Este arquivo
```

## 🚀 Como Usar

1. **Abra o arquivo `index.html`** no seu navegador
2. **Cadastre-se** clicando em "Cadastro" no menu
3. **Faça login** com suas credenciais
4. **Navegue pelos produtos** e adicione ao carrinho
5. **Finalize a compra** através do carrinho

## 🛍️ Produtos Disponíveis

O sistema busca produtos dinamicamente da **FakeStoreAPI** (https://fakestoreapi.com/products), incluindo:

### Categorias Disponíveis
- **Electronics**: Smartphones, laptops, acessórios
- **Jewelery**: Joias e acessórios
- **Men's Clothing**: Roupas masculinas
- **Women's Clothing**: Roupas femininas

### Informações dos Produtos
- **Imagens reais** dos produtos
- **Preços** em dólares (convertidos para reais)
- **Descrições** detalhadas
- **Avaliações** e ratings
- **Categorias** organizadas

## 🔧 Funcionalidades Técnicas

### Sistema de Autenticação
- Cadastro de novos usuários
- Login com validação
- Logout automático
- Persistência de sessão

### Carrinho de Compras
- Adicionar produtos
- Alterar quantidades
- Remover itens
- Cálculo automático do total
- **Persistência no localStorage**

### API Integration
- **FakeStoreAPI**: Busca produtos reais da internet
- **Fallback**: Produtos locais em caso de erro de conexão
- **Loading States**: Indicadores de carregamento
- **Error Handling**: Tratamento de erros de API

### Interface
- Design responsivo
- Animações suaves
- Notificações em tempo real
- Navegação intuitiva
- Imagens otimizadas

## 🎯 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos modernos com Flexbox e Grid
- **JavaScript ES6+**: Funcionalidades interativas
- **Fetch API**: Busca de dados da FakeStoreAPI
- **LocalStorage**: Persistência de dados
- **Async/Await**: Programação assíncrona

## 📱 Responsividade

O projeto é totalmente responsivo e funciona em:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (até 767px)

## 🔒 Segurança

- Validação de formulários
- Verificação de usuário existente
- Proteção contra acesso não autorizado
- Sanitização de dados de entrada
- Tratamento seguro de dados da API

## 🌐 API Integration

### FakeStoreAPI
- **Endpoint**: `https://fakestoreapi.com/products`
- **Método**: GET
- **Resposta**: Array de produtos com imagens, preços e descrições
- **Fallback**: Produtos locais em caso de erro

### Estrutura dos Dados
```javascript
{
  id: number,
  title: string,
  price: number,
  category: string,
  image: string,
  description: string,
  rating: {
    rate: number,
    count: number
  }
}
```

## 🚀 Melhorias Futuras

- Sistema de busca de produtos
- Filtros por categoria
- Histórico de compras
- Sistema de avaliações
- Integração com APIs de pagamento
- Página de detalhes do produto
- Cache de produtos para melhor performance
- Sistema de favoritos

## 📞 Suporte

Para dúvidas ou sugestões, entre em contato através do email: contato@mercadinho.com

---

**Desenvolvido com ❤️ usando HTML, CSS e JavaScript + FakeStoreAPI** 