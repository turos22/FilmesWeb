package unoeste.fipp.filmeswebback.restcontrollers;

import jakarta.servlet.http.HttpServletRequest;
import net.coobird.thumbnailator.Thumbnails;
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
import java.io.IOException;
import java.nio.file.Files;

@CrossOrigin
@RestController
@RequestMapping(value = "/api/imagens")
@Tag(name = "Imagens dos Filmes", description = "Endpoints para upload, geração de thumbnails e vinculação de imagens aos filmes")
public class FilmesImgController {

    @Autowired
    private FilmesRepositorio filmesRepositorio;

    @Autowired
    private HttpServletRequest request;

    @Operation(summary = "Teste de conectividade", description = "Endpoint de verificação simples para checar se o serviço de imagens está ativo.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Serviço operacional")
    })
    @GetMapping(value = "test")
    public ResponseEntity<Object> test(){
        return ResponseEntity.ok().body("");
    }

    @Operation(
            summary = "Upload de imagem e geração de thumbnail",
            description = "Recebe um arquivo de imagem via multipart/form-data, gera uma thumbnail redimensionada (200x200 em JPG) e salva no servidor."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Thumbnail criada e salva com sucesso"),
            @ApiResponse(responseCode = "500", description = "Erro interno ao processar ou salvar a imagem")
    })
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadImage(
            @Parameter(description = "Arquivo de imagem a ser enviado", required = true)
            @RequestParam("file") MultipartFile file) {
        try {
            String thumbName = "thumb_" + file.getOriginalFilename();

            File outputDir = new File("src\\main\\resources\\static\\uploads");
            if (!outputDir.exists()) {
                outputDir.mkdirs();
            }

            File outputFile = new File(outputDir, thumbName);

            Thumbnails.of(file.getInputStream())
                    .size(200, 200)
                    .outputFormat("jpg")
                    .toFile(outputFile);

            return ResponseEntity.ok("Thumbnail criada: " + thumbName);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erro ao criar thumbnail: " + e.getMessage());
        }
    }

    @Operation(
            summary = "Vincular thumbnail ao filme",
            description = "Associa o nome da thumbnail gerada anteriormente ao registro do filme especificado pelo título."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Thumbnail vinculada ao filme com sucesso"),
            @ApiResponse(responseCode = "400", description = "A imagem informada não é uma thumb válida ou ocorreu erro ao associar")
    })
    @PostMapping(value = "/thumbfilme")
    public ResponseEntity<Object> uploadThumbFilme(
            @Parameter(description = "Título exato do filme registrado", example = "Matrix")
            @RequestParam("filme") String nome,
            @Parameter(description = "Nome do arquivo da thumbnail gerado no upload", example = "thumb_poster.jpg")
            @RequestParam("thumbname") String thumbname){

        if(thumbname.contains("thumb")) {
            final String UPLOAD_FOLDER = "src\\main\\resources\\static\\uploads";
            File uploadFolder = new File(UPLOAD_FOLDER);
            if (!uploadFolder.exists())
                uploadFolder.mkdir();
            try {
                Filme filme = filmesRepositorio.getFilmeTitulo(nome);
                filme.setFileName(thumbname);
                return ResponseEntity.ok(filme);
            } catch (Exception e) {
                return ResponseEntity.badRequest().body(new Erro("Problemas ao vincular a thumb"));
            }
        }
        else
            return ResponseEntity.badRequest().body(new Erro("A imagem deve ser uma thumb gerada pelo sistema"));
    }

    @Operation(
            summary = "Obter thumbnail do filme",
            description = "Busca e retorna o arquivo binário da imagem JPEG da thumbnail associada ao filme."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Imagem retornada com sucesso"),
            @ApiResponse(responseCode = "400", description = "O filme informado não possui thumbnail vinculada"),
            @ApiResponse(responseCode = "404", description = "O arquivo da imagem não foi encontrado no sistema de arquivos")
    })
    @GetMapping(value = "/getthumb")
    public ResponseEntity<Object> getThumb(
            @Parameter(description = "Título do filme para buscar a imagem", example = "Matrix")
            @RequestParam(value = "titulo") String titulo){
        Filme alvo = filmesRepositorio.getFilmeTitulo(titulo);
        if (alvo.getFileName().isEmpty()){
            return ResponseEntity.badRequest().body(new Erro("O Filme não possui Thumb"));
        }
        else{
            File file = new File("src\\main\\resources\\static\\uploads\\" + alvo.getFileName());

            if (!file.exists()) {
                return ResponseEntity.notFound().build();
            }
            byte[] imageBytes;
            try {
                imageBytes = Files.readAllBytes(file.toPath());
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(imageBytes);
        }
    }
}