async function pesquisar() {
    const genero = document.getElementById("genero").value;
    const dados = document.getElementById("dados");

    const endpoint =
        "http://localhost:8080/apis/list-genre/" +
        encodeURIComponent(genero);

    try {
        const response = await fetch(endpoint);
        const filmes = await response.json();

        dados.innerHTML = await montarTabResultante(filmes);

    } catch (error) {
        console.log(error);
        alert("Erro!!!");
    }
}


async function palavraChave() {
    const chave = document.getElementById("chave").value;
    const dados = document.getElementById("dados");

    const endpoint =
        "http://localhost:8080/apis/list-keyword/" +
        encodeURIComponent(chave);

    try {
        const response = await fetch(endpoint);
        const filmes = await response.json();

        dados.innerHTML = await montarTabResultante(filmes);

    } catch (error) {
        console.log(error);
        alert("Erro!!!");
    }
}


async function data() {
    const dataInicio = document.getElementById("data-inicio").value;
    const dataFim = document.getElementById("data-fim").value;

    const dados = document.getElementById("dados");

    const endpoint =
        "http://localhost:8080/apis/list-year/" +
        encodeURIComponent(dataInicio) +
        "/" +
        encodeURIComponent(dataFim);

    try {
        const response = await fetch(endpoint);
        const filmes = await response.json();

        dados.innerHTML = await montarTabResultante(filmes);

    } catch (error) {
        console.log(error);
        alert("Erro!!!");
    }
}


async function montarTabResultante(json) {
    let str = "";

    for (const filme of json) {

        const endpointbase64 =
            "http://localhost:8080/api/imagens/getthumb?titulo=" +
            encodeURIComponent(filme.titulo);

        try {
            const response = await fetch(endpointbase64);

            if (!response.ok) {
                console.log(
                    "Erro ao buscar imagem de",
                    filme.titulo,
                    response.status
                );

                continue;
            }

            const base64 = await response.text();

            filme.fileName = "data:image/jpeg;base64," + base64;

            str += `
                <tr>
                    <td>${filme.titulo}</td>
                    <td>${filme.ano}</td>
                    <td>
                        <img
                            src="${filme.fileName}"
                            style="width: 100px;"
                        />
                    </td>
                </tr>
            `;

        } catch (error) {
            console.log("Erro na imagem:", error);
        }
    }

    return str;
}
