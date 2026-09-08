function cadastrar() {
    const formFilme = document.getElementById("ffilme")
    const filme = new Object()
    filme.titulo = formFilme.titulo.value
    filme.ano = formFilme.ano.value
    filme.genero = formFilme.genero.value
    const jsonFilme = JSON.stringify(filme)

    const bodyparam = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: jsonFilme,
        redirect: "follow"
    }

    const endpoint = "http://localhost:8080/apis/add-movie"
    fetch(endpoint, bodyparam)
        .then(response => response.json()
            .then(filmes => {
                alert(filmes.titulo + " inserido na lista")
            }))
        .catch(error => {
            alert("Erro!!!")
        })

}

function cadastrarFilmePoster() {
    const URL = "http://localhost:8080/apis/add-movie-poster";
    var fdados = document.getElementById("ffilme");
    fetch(URL, {
        method: 'POST', body: new FormData(fdados)
    })
        .then(resp => {
            return resp.json();
        })
        .then(json => {
            alert(json.titulo + " cadastrado");
        }).catch(error => {
            console.error(error);
        });
}