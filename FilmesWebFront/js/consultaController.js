const API_BASE = 'http://localhost:8080/apis';
const API_IMAGENS = 'http://localhost:8080/api/imagens';
const DEFAULT_IMAGE = 'https://via.placeholder.com/300x450?text=Sem+Capa';

let listaFilmes = [];

document.addEventListener('DOMContentLoaded', () => {
    carregarFilmes();
    carregarGenerosFiltro();
    configurarEventosModal();

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
        if (!response.ok) throw new Error('Erro ao buscar a lista de filmes');

        listaFilmes = await response.json();
        exibirCards(listaFilmes);
    } catch (erro) {
        console.error('Erro na requisição /list-movies:', erro);
        const msgVazia = document.getElementById('mensagemVazia');
        if (msgVazia) {
            msgVazia.style.display = 'block';
            msgVazia.innerHTML = `<p style="color:red;">Não foi possível carregar os filmes. Verifique o servidor em http://localhost:8080</p>`;
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

    filmes.forEach((filme, index) => {
        let urlCapa = DEFAULT_IMAGE;
        if (filme.fileName && filme.fileName.trim() !== '') {
            urlCapa = `${API_IMAGENS}/getthumb?titulo=${encodeURIComponent(filme.titulo)}`;
        }

        let nomeGenero = 'Geral';
        if (filme.genero) {
            nomeGenero = typeof filme.genero === 'string' ? filme.genero : (filme.genero.descricao || filme.genero.nome || 'Geral');
        }

        const card = document.createElement('div');
        card.className = 'card-filme';
        card.innerHTML = `
            <img src="${urlCapa}"
                 alt="${filme.titulo}"
                 class="card-capa"
                 style="cursor: pointer;"
                 title="Clique para ver os detalhes"
                 onclick="abrirModalDetalhes(${index})"
                 onerror="this.onerror=null; this.src='${DEFAULT_IMAGE}';">
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

// MODAL DE DETALHES (Somente atributos existentes no modelo Java)
function abrirModalDetalhes(index) {
    const filme = listaFilmes[index];
    if (!filme) return;

    let urlCapa = DEFAULT_IMAGE;
    if (filme.fileName && filme.fileName.trim() !== '') {
        urlCapa = `${API_IMAGENS}/getthumb?titulo=${encodeURIComponent(filme.titulo)}`;
    }

    let nomeGenero = 'Geral';
    if (filme.genero) {
        nomeGenero = typeof filme.genero === 'string' ? filme.genero : (filme.genero.descricao || filme.genero.nome || 'Geral');
    }

    // Preenche apenas titulo, genero, ano e poster na modal
    document.getElementById('modalCapa').src = urlCapa;
    document.getElementById('modalTitulo').textContent = filme.titulo;
    document.getElementById('modalGenero').textContent = nomeGenero;
    document.getElementById('modalAno').textContent = filme.ano ? `Ano de Lançamento: ${filme.ano}` : 'Ano não cadastrado';

    const modal = document.getElementById('modalDetalhes');
    if (modal) modal.style.display = 'flex';
}

function fecharModalDetalhes() {
    const modal = document.getElementById('modalDetalhes');
    if (modal) modal.style.display = 'none';
}

function configurarEventosModal() {
    const btnFechar = document.getElementById('btnFecharModal');
    const modal = document.getElementById('modalDetalhes');

    if (btnFechar) btnFechar.addEventListener('click', fecharModalDetalhes);

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) fecharModalDetalhes();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') fecharModalDetalhes();
    });
}