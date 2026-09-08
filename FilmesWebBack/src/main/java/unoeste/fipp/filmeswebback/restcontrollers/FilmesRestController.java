package unoeste.fipp.filmeswebback.restcontrollers;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import unoeste.fipp.filmeswebback.entities.Erro;
import unoeste.fipp.filmeswebback.entities.Filme;
import unoeste.fipp.filmeswebback.repositories.FilmesRepositorio;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.io.File;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "apis")
@Tag(name = "Catálogo de Filmes", description = "Endpoints para consulta, listagem, filtragem e cadastro de filmes e gêneros")
public class FilmesRestController {

    @Autowired
    private FilmesRepositorio filmesRepositorio;

    @Autowired
    private HttpServletRequest request;

    @Operation(summary = "Teste da API", description = "Endpoint simples de verificação de disponibilidade do serviço.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Serviço disponível")
    })
    @GetMapping(value = "test")
    public ResponseEntity<Object> test(){
        return ResponseEntity.ok().body("");
    }

    @Operation(summary = "Obter filme aleatório", description = "Retorna um filme sorteado aleatoriamente do repositório.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Filme retornado com sucesso")
    })
    @GetMapping(value = "random-movie")
    public ResponseEntity<Object> randMovie(){
        return ResponseEntity.ok(filmesRepositorio.getFilmeAleatorio());
    }

    @Operation(summary = "Listar todos os filmes", description = "Retorna a lista completa de filmes cadastrados.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de filmes retornada com sucesso")
    })
    @GetMapping(value="list-movies")
    public ResponseEntity<Object> allMovies(){
        return ResponseEntity.ok(filmesRepositorio.getFilmeList());
    }

    @Operation(summary = "Buscar filme por título (Query Param)", description = "Busca um filme informando o título como parâmetro na URL (?titulo=...).")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Filme encontrado"),
            @ApiResponse(responseCode = "400", description = "Filme não encontrado")
    })
    @GetMapping(value="get-movie")
    public ResponseEntity<Object> getMovie(
            @Parameter(description = "Título exato do filme a ser buscado", example = "Inception")
            @RequestParam(value = "titulo") String titulo){
        Filme filme = filmesRepositorio.getFilmeTitulo(titulo);
        if(filme != null)
            return ResponseEntity.ok(filme);
        return ResponseEntity.badRequest().body(new Erro("filme não encontrado"));
    }

    @Operation(summary = "Buscar filme por título (Path Variable)", description = "Busca um filme informando o título diretamente no caminho da URL (/get-movie/{titulo}).")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Filme encontrado"),
            @ApiResponse(responseCode = "400", description = "Filme não encontrado")
    })
    @GetMapping(value="get-movie/{titulo}")
    public ResponseEntity<Object> getMoviePath(
            @Parameter(description = "Título exato do filme", example = "Matrix")
            @PathVariable String titulo){
        return getMovie(titulo);
    }

    @Operation(summary = "Listar filmes por gênero", description = "Retorna todos os filmes pertencentes a um gênero específico.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de filmes do gênero retornada com sucesso")
    })
    @GetMapping(value="list-genre/{genero}")
    public ResponseEntity<Object> getMovieGenre(
            @Parameter(description = "Nome do gênero para filtragem", example = "Ação")
            @PathVariable String genero){
        List<Filme> filmes = filmesRepositorio.getFilmeGenero(genero);
        return ResponseEntity.ok(filmes);
    }

    @Operation(summary = "Listar filmes por intervalo de anos", description = "Retorna os filmes lançados entre o ano inicial e o ano final especificados.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de filmes do período retornada com sucesso")
    })
    @GetMapping(value="list-year/{dt-inicio}/{dt-fim}")
    public ResponseEntity<Object> getMovieYear(
            @Parameter(description = "Ano inicial do intervalo", example = "2000")
            @PathVariable(value = "dt-inicio") int dtInicio,
            @Parameter(description = "Ano final do intervalo", example = "2020")
            @PathVariable(value = "dt-fim") int dtFim){
        List<Filme> filmes = filmesRepositorio.getFilmeAno(dtInicio, dtFim);
        return ResponseEntity.ok(filmes);
    }

    @Operation(summary = "Cadastrar novo filme (JSON)", description = "Recebe um objeto JSON com os dados do filme e adiciona ao repositório.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Filme cadastrado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Problemas ao adicionar o filme")
    })
    @PostMapping(value = "add-movie")
    public ResponseEntity<Object> addFilme(
            @Parameter(description = "Objeto JSON contendo os dados do filme")
            @RequestBody Filme novoFilme){
        if(novoFilme != null) {
            filmesRepositorio.addFilme(novoFilme);
            return ResponseEntity.ok(novoFilme);
        }
        else
            return ResponseEntity.badRequest().body(new Erro("Problemas ao adicionar o filme"));
    }

    @Operation(summary = "Cadastrar filme com envio de Pôster (Upload)", description = "Cadastra um filme e faz o upload da imagem do pôster (deve ser arquivo .jpg ou .jpeg).")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Filme e pôster cadastrados com sucesso"),
            @ApiResponse(responseCode = "400", description = "Formato de imagem inválido ou erro no cadastro")
    })
    @PostMapping(value = "add-movie-poster", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> addFilmePoster(
            @Parameter(description = "Título do filme", example = "Interstellar")
            @RequestParam("titulo") String titulo,
            @Parameter(description = "Ano de lançamento", example = "2014")
            @RequestParam("ano") String ano,
            @Parameter(description = "Gênero do filme", example = "Ficção Científica")
            @RequestParam("genero") String genero,
            @Parameter(description = "Arquivo da imagem do pôster (.jpg ou .jpeg)", required = true)
            @RequestParam("poster") MultipartFile poster)
    {
        if(poster.getOriginalFilename().toLowerCase().endsWith("jpeg") || poster.getOriginalFilename().toLowerCase().endsWith("jpg")) {
            final String UPLOAD_FOLDER = "src\\main\\resources\\static\\uploads";
            File uploadFolder = new File(UPLOAD_FOLDER);
            if (!uploadFolder.exists())
                uploadFolder.mkdir();
            try {
                String fileName = titulo + ".jpg";
                String server = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath();
                poster.transferTo(new File(uploadFolder.getAbsolutePath() + "\\" + fileName));
                Filme novoFilme = new Filme(titulo, ano, filmesRepositorio.getGenero(genero), fileName);
                filmesRepositorio.addFilme(novoFilme);
                return ResponseEntity.ok(novoFilme);
            } catch (Exception e) {
                return ResponseEntity.badRequest().body(new Erro("Problemas ao adicionar o filme"));
            }
        }
        else
            return ResponseEntity.badRequest().body(new Erro("A imagem deve ser um JPG"));
    }

    @Operation(summary = "Listar gêneros", description = "Retorna a lista de todos os gêneros de filmes cadastrados no sistema.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de gêneros retornada com sucesso")
    })
    @GetMapping(value = "get-generos")
    public ResponseEntity<Object> getGeneros(){
        return ResponseEntity.ok(filmesRepositorio.getGeneroList());
    }

    @Operation(summary = "Buscar filmes por palavra-chave", description = "Retorna uma lista de filmes cujos títulos contenham a palavra-chave informada.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Busca realizada com sucesso")
    })
    @GetMapping(value = "list-keyword/{chave}")
    public ResponseEntity<Object> getListKeyWord(
            @Parameter(description = "Palavra-chave para busca no título", example = "Star")
            @PathVariable String chave){
        return ResponseEntity.ok(filmesRepositorio.getlistKeyword(chave));
    }
}