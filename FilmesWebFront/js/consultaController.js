
function pesquisar() {
    const genero = document.getElementById("genero").value
    const dados = document.getElementById("dados")

    const endpoint = "http://localhost:8080/apis/list-genre/" + genero
    fetch(endpoint)
        .then(response => response.json()
            .then(filmes => {
                dados.innerHTML = montarTabResultante(filmes);
            }))
        .catch(error => {
            alert("Erro!!!")
        })
}
function palavraChave(){
    const chave = document.getElementById("chave").value
    const dados = document.getElementById("dados")

    const endpoint = "http://localhost:8080/apis/list-keyword/" + chave
    fetch(endpoint)
        .then(response => response.json()
            .then(filmes => {
                dados.innerHTML = montarTabResultante(filmes);
            }))
        .catch(error => {
            alert("Erro!!!")
        })
}

function data(){
    const dataInicio =document.getElementById("data-inicio").value
    const dataFim = document.getElementById("data-fim").value

    const dados = document.getElementById("dados")

    const endpoint = "http://localhost:8080/apis/list-year/" + dataInicio +"/" +dataFim
    fetch(endpoint)
        .then(response => response.json()
            .then(filmes => {
                dados.innerHTML = montarTabResultante(filmes);
            }))
        .catch(error => {
            alert("Erro!!!")
        })
}


function montarTabResultante(json) {
    let str = ""
    for (filme of json)
        str += `<tr><td>${filme.titulo}</td><td>${filme.ano}</td><td><img src="${filme.fileName}"/></td></tr>`
    return str;
}
