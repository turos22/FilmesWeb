const API_BASE = 'http://localhost:8080/apis';
const API_IMAGENS = 'http://localhost:8080/api/imagens';
const DEFAULT_IMAGE = 'https://via.placeholder.com/300x450?text=Sem+Capa';

let listaFilmes = [];

document.addEventListener('DOMContentLoaded', () => {
    carregarFilmes();
    carregarGenerosFiltro();

    const btnBuscar = document.getElementById('btnBuscar');
    const inputBusca = document.getElementById('inputBusca');
    const filtroGenero = document.getElementById('filtroGenero');

    if (btnBuscar) btnBuscar.addEventListener('click', aplicarFiltrosLocalmente);
    if (inputBusca) inputBusca.addEventListener('input', aplicarFiltrosLocalmente);
    if (filtroGenero) filtroGenero.addEventListener('change', aplicarFiltrosLocalmente);
});

// GET /apis/list-movies
async function carregarFilmes() {
    try {
        const response = await fetch(`${API_BASE}/list-movies`);
        if (!response.ok) throw new Error('Erro ao buscar lista de filmes');

        listaFilmes = await response.json();
        console.log('Filmes recebidos do backend:', listaFilmes);
        exibirCards(listaFilmes);
    } catch (erro) {
        console.error('Erro na requisição /list-movies:', erro);
        const msgVazia = document.getElementById('mensagemVazia');
        if (msgVazia) {
            msgVazia.style.display = 'block';
            msgVazia.innerHTML = `<p style="color:red;">Não foi possível carregar os filmes. Verifique se o Spring Boot está rodando em http://localhost:8080</p>`;
        }
    }
}

// GET /apis/get-generos
async function carregarGenerosFiltro() {
    try {
        const response = await fetch(`${API_BASE}/get-generos`);
        if (response.ok) {
            const generos = await response.json();
            const select = document.getElementById('filtroGenero');
            if (select) {
                select.innerHTML = '<option value="">Todos os Gêneros</option>';
                generos.forEach(g => {
                    const nome = typeof g === 'string' ? g : (g.descricao || g.nome || g);
                    select.innerHTML += `<option value="${nome}">${nome}</option>`;
                });
            }
        }
    } catch (e) {
        console.warn('Erro ao carregar lista de gêneros:', e);
    }
}

function exibirCards(filmes) {
    const grid = document.getElementById('gridFilmes');
    const msgVazia = document.getElementById('mensagemVazia');
    if (!grid) return;

    grid.innerHTML = '';

    if (!filmes || filmes.length === 0) {
        if (msgVazia) msgVazia.style.display = 'block';
        return;
    }

    if (msgVazia) msgVazia.style.display = 'none';

    filmes.forEach(filme => {
        // Se o filme tem imagem registrada no backend, carrega do /getthumb?titulo=...
        let urlCapa = DEFAULT_IMAGE;
        if (filme.fileName && filme.fileName.trim() !== '') {
            urlCapa = `${API_IMAGENS}/getthumb?titulo=${encodeURIComponent(filme.titulo)}`;
        }

        // Obtém o nome do gênero independente do formato retornado
        let nomeGenero = 'Geral';
        if (filme.genero) {
            nomeGenero = typeof filme.genero === 'string' ? filme.genero : (filme.genero.descricao || filme.genero.nome || 'Geral');
        }

        const card = document.createElement('div');
        card.className = 'card-filme';
        card.innerHTML = `
            <img src="${urlCapa}" alt="${filme.titulo}" class="card-capa" onerror="this.src='${DEFAULT_IMAGE}'">
            <div class="card-corpo">
                <h3 class="card-titulo">${filme.titulo}</h3>
                <div class="card-meta">
                    <span class="badge-genero">${nomeGenero}</span>
                    <span>${filme.ano || 'N/A'}</span>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function aplicarFiltrosLocalmente() {
    const termo = document.getElementById('inputBusca')?.value.toLowerCase().trim() || '';
    const generoSelecionado = document.getElementById('filtroGenero')?.value || '';

    const resultado = listaFilmes.filter(filme => {
        const titulo = (filme.titulo || '').toLowerCase();

        let generoFilme = '';
        if (filme.genero) {
            generoFilme = typeof filme.genero === 'string' ? filme.genero : (filme.genero.descricao || filme.genero.nome || '');
        }

        const bateTitulo = titulo.includes(termo);
        const bateGenero = generoSelecionado === '' || generoFilme === generoSelecionado;

        return bateTitulo && bateGenero;
    });

    exibirCards(resultado);
}