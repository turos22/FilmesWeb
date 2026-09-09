const API_URL = 'http://localhost:8080/apis/filmes';
const DEFAULT_IMAGE = 'https://via.placeholder.com/300x450?text=Sem+Capa';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch(`${API_URL}/listar`);
        if (!response.ok) throw new Error('Erro ao buscar dados do acervo');

        const filmes = await response.json();
        atualizarMétricas(filmes);
        renderizarDestaques(filmes);
    } catch (erro) {
        console.warn('API indisponível ou vazia:', erro);
    }
});

function atualizarMétricas(filmes) {
    document.getElementById('statTotalFilmes').textContent = filmes.length;

    if (filmes.length > 0) {
        const somaNotas = filmes.reduce((acc, f) => acc + (parseFloat(f.nota) || 0), 0);
        const media = (somaNotas / filmes.length).toFixed(1);
        document.getElementById('statMediaNota').textContent = media;

        const generosUnicos = new Set(filmes.map(f => f.genero).filter(Boolean));
        document.getElementById('statTotalGeneros').textContent = generosUnicos.size;
    }
}

function renderizarDestaques(filmes) {
    const grid = document.getElementById('gridDestaques');
    grid.innerHTML = '';

    const ultimosFilmes = filmes.slice(-4).reverse();

    if (ultimosFilmes.length === 0) {
        grid.innerHTML = '<p style="color: #64748b;">Nenhum filme cadastrado ainda.</p>';
        return;
    }

    ultimosFilmes.forEach(filme => {
        let urlFoto = DEFAULT_IMAGE;
        if (filme.foto) {
            urlFoto = filme.foto.startsWith('http')
                ? filme.foto
                : `http://localhost:8080/uploads/${filme.foto}`;
        }

        const card = document.createElement('div');
        card.className = 'card-filme';
        card.innerHTML = `
            <img src="${urlFoto}" alt="${filme.titulo}" class="card-capa" onerror="this.src='${DEFAULT_IMAGE}'">
            <div class="card-corpo">
                <h3 class="card-titulo">${filme.titulo}</h3>
                <div class="card-meta">
                    <span class="badge-genero">${filme.genero || 'Geral'}</span>
                    <span class="card-nota"><i class="fa-solid fa-star"></i> ${filme.nota || 'N/A'}</span>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}