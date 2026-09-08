function carregarSugestaoFilme() {
    const tagSugestao = document.getElementById("sugestao");
    const endpoint = "http://localhost:8080/apis/random-movie"
    fetch(endpoint)
        .then(response => {
            if (response.status == 200) {
                response.json()
                    .then(filme => {
                        tagSugestao.innerHTML = filme.titulo
                    })
            }
            else {
                alert("Erro")
            }
        })
        .catch(error => {
            alert("Erro: " + error)
        })
}