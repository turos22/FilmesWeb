const API_BASE = 'http://localhost:8080/apis';
const API_IMAGENS = 'http://localhost:8080/api/imagens';
const DEFAULT_IMAGE = 'https://via.placeholder.com/300x450?text=Sem+Capa';

let filmesRecentesExibidos = [];

document.addEventListener('DOMContentLoaded', () => {
    carregarMétricasEFilmes();
    configurarEventosModal();
});

async function carregarMétricasEFilmes() {
    try {
        const [resFilmes, resGeneros] = await Promise.all([
            fetch(`${API_BASE}/list-movies`),
            fetch(`${API_BASE}/get-generos`)
        ]);

        let filmes = [];
        let generos = [];

        if (resFilmes.ok) filmes = await resFilmes.json();
        if (resGeneros.ok) generos = await resGeneros.json();

        // 1. Atualiza os contadores
        const elTotalFilmes = document.getElementById('totalFilmes');
        const elTotalGeneros = document.getElementById('totalGeneros');

        if (elTotalFilmes) elTotalFilmes.textContent = filmes.length;
        if (elTotalGeneros) elTotalGeneros.textContent = generos.length;

        // 2. Renderiza os filmes recém-adicionados (Pega os últimos 4 cadastrados)
        exibirFilmesRecentes(filmes);

    } catch (erro) {
        console.error('Erro ao carregar dados do dashboard:', erro);
    }
}

function exibirFilmesRecentes(filmes) {
    const container = document.getElementById('gridRecentes');
    if (!container) return;

    container.innerHTML = '';

    if (!filmes || filmes.length === 0) {
        container.innerHTML = '<p style="color: #94a3b8;">Nenhum filme cadastrado até o momento.</p>';
        return;
    }

    // Pega os últimos 4 filmes cadastrados na lista
    filmesRecentesExibidos = filmes.slice(-4).reverse();

    filmesRecentesExibidos.forEach((filme, index) => {
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
            <div class="card-capa-container" style="width: 100%; height: 320px; overflow: hidden; position: relative;">
                <img src="${urlCapa}"
                     alt="${filme.titulo}"
                     class="card-capa"
                     style="width: 100%; height: 100%; object-fit: cover; cursor: pointer; display: block;"
                     title="Clique para ver os detalhes"
                     onclick="abrirModalDetalhes(${index})"
                     onerror="this.onerror=null; this.src='${DEFAULT_IMAGE}';">
            </div>
            <div class="card-corpo" style="padding: 15px; display: flex; flex-direction: column; gap: 8px;">
                <h3 class="card-titulo" style="margin: 0; font-size: 1.1rem; line-height: 1.3; cursor: pointer;" onclick="abrirModalDetalhes(${index})">${filme.titulo}</h3>
                <div class="card-meta" style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                    <span class="badge-genero">${nomeGenero}</span>
                    <span>${filme.ano || 'N/A'}</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// MODAL DE DETALHES
function abrirModalDetalhes(index) {
    const filme = filmesRecentesExibidos[index];
    if (!filme) return;

    let urlCapa = DEFAULT_IMAGE;
    if (filme.fileName && filme.fileName.trim() !== '') {
        urlCapa = `${API_IMAGENS}/getthumb?titulo=${encodeURIComponent(filme.titulo)}`;
    }

    let nomeGenero = 'Geral';
    if (filme.genero) {
        nomeGenero = typeof filme.genero === 'string' ? filme.genero : (filme.genero.descricao || filme.genero.nome || 'Geral');
    }

    const imgModal = document.getElementById('modalCapa');
    if (imgModal) {
        imgModal.onerror = function() {
            this.onerror = null;
            this.src = DEFAULT_IMAGE;
        };
        imgModal.src = urlCapa;
    }

    const modalTitulo = document.getElementById('modalTitulo');
    const modalGenero = document.getElementById('modalGenero');
    const modalAno = document.getElementById('modalAno');

    if (modalTitulo) modalTitulo.textContent = filme.titulo;
    if (modalGenero) modalGenero.textContent = nomeGenero;
    if (modalAno) modalAno.textContent = filme.ano ? `Ano de Lançamento: ${filme.ano}` : 'Ano não cadastrado';

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