const API_BASE = 'http://localhost:8080/apis';

document.addEventListener('DOMContentLoaded', () => {
    carregarGenerosFormulario();

    const form = document.getElementById('formFilme');
    const fotoInput = document.getElementById('fotoInput');
    const imagePreview = document.getElementById('imagePreview');

    // Pré-visualização da Imagem
    if (fotoInput) {
        fotoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (evt) => {
                    if (imagePreview) imagePreview.src = evt.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (form) form.addEventListener('submit', salvarNovoFilme);
});

// Carrega os gêneros cadastrados na API para popular o <select id="genero">
async function carregarGenerosFormulario() {
    try {
        const response = await fetch(`${API_BASE}/get-generos`);
        if (response.ok) {
            const generos = await response.json();
            const select = document.getElementById('genero');
            if (select) {
                select.innerHTML = '<option value="">Selecione um gênero</option>';
                generos.forEach(g => {
                    const nome = typeof g === 'string' ? g : (g.descricao || g.nome || g);
                    select.innerHTML += `<option value="${nome}">${nome}</option>`;
                });
            }
        }
    } catch (e) {
        console.warn('Erro ao carregar opções de gêneros:', e);
    }
}

// Consome: POST /apis/add-movie-poster
async function salvarNovoFilme(e) {
    e.preventDefault();

    const titulo = document.getElementById('titulo').value.trim();
    const ano = document.getElementById('ano').value.trim();
    const genero = document.getElementById('genero').value;
    const fotoFile = document.getElementById('fotoInput').files[0];

    if (!titulo || !ano || !genero) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    if (!fotoFile) {
        alert('Selecione uma imagem de pôster para o filme.');
        return;
    }

    // Validação de Extensão exigida pelo Java (.jpg ou .jpeg)
    const nomeArquivo = fotoFile.name.toLowerCase();
    if (!nomeArquivo.endsWith('.jpg') && !nomeArquivo.endsWith('.jpeg')) {
        alert('O backend aceita apenas imagens nos formatos .jpg ou .jpeg');
        return;
    }

    // Cria o FormData exatamente com os nomes dos parâmetros do Controller Java
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('ano', ano);
    formData.append('genero', genero);
    formData.append('poster', fotoFile); // Deve bater com @RequestParam("poster")

    try {
        const response = await fetch(`${API_BASE}/add-movie-poster`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Filme cadastrado com sucesso!');
            window.location.href = 'consulta.html';
        } else {
            const erroObj = await response.json().catch(() => null);
            const mensagemErro = erroObj ? erroObj.mensagem : 'Erro desconhecido no servidor.';
            alert(`Falha ao cadastrar: ${mensagemErro}`);
        }
    } catch (erro) {
        console.error('Erro na requisição POST:', erro);
        alert('Não foi possível conectar com o servidor Spring Boot.');
    }
}