const API_BASE = 'http://localhost:8080/apis';

document.addEventListener('DOMContentLoaded', () => {
    carregarGenerosFormulario();

    const form = document.getElementById('formFilme');
    const fotoInput = document.getElementById('fotoInput');
    const imagePreview = document.getElementById('imagePreview');

    // Pré-visualização da imagem do Pôster
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

// GET /apis/get-generos
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

// POST /apis/add-movie-poster
async function salvarNovoFilme(e) {
    e.preventDefault();

    const titulo = document.getElementById('titulo').value.trim();
    const ano = document.getElementById('ano').value.trim();
    const genero = document.getElementById('genero').value;
    const fotoFile = document.getElementById('fotoInput').files[0];

    if (!titulo || !ano || !genero) {
        alert('Por favor, preencha todos os campos obrigatórios (Título, Ano e Gênero).');
        return;
    }

    if (!fotoFile) {
        alert('Selecione uma imagem de pôster para o filme.');
        return;
    }

    // Validação de formato (.jpg ou .jpeg) exigido pelo backend Java
    const nomeArquivo = fotoFile.name.toLowerCase();
    if (!nomeArquivo.endsWith('.jpg') && !nomeArquivo.endsWith('.jpeg')) {
        alert('O servidor aceita apenas imagens no formato .jpg ou .jpeg');
        return;
    }

    // Monta o FormData exatamente com as 4 propriedades da entidade
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('ano', ano);
    formData.append('genero', genero);
    formData.append('poster', fotoFile);

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
            const mensagemErro = erroObj ? erroObj.mensagem : 'Erro ao cadastrar o filme.';
            alert(`Falha no cadastro: ${mensagemErro}`);
        }
    } catch (erro) {
        console.error('Erro no envio do formulário:', erro);
        alert('Erro ao se conectar com o servidor Spring Boot.');
    }
}