package unoeste.fipp.filmeswebback.repositories;

import org.springframework.stereotype.Repository;
import unoeste.fipp.filmeswebback.entities.Filme;
import unoeste.fipp.filmeswebback.entities.Genero;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Repository
public class FilmesRepositorio {
    private List<Filme> filmeList = new ArrayList<>();
    private List<Genero> GeneroList = new ArrayList<>();

    public FilmesRepositorio() {
       carregarGeneros();
       carregarFilmes();
    }

    private void carregarFilmes() {
        filmeList.add(new Filme("Cidadão Kane", "1941", getGenero("Drama"), ""));
        filmeList.add(new Filme("Casablanca", "1942", getGenero("Romance"), ""));
        filmeList.add(new Filme("O Poderoso Chefão", "1972", getGenero("Crime"), ""));
        filmeList.add(new Filme("Os Sete Samurais", "1954", getGenero("Ação"), ""));
        filmeList.add(new Filme("A Noviça Rebelde", "1965", getGenero("Musical"), ""));
        filmeList.add(new Filme("Psicose", "1960", getGenero("Terror"), ""));
        filmeList.add(new Filme("2001: Uma Odisseia no Espaço", "1968", getGenero("Ficção Científica"), ""));
        filmeList.add(new Filme("A Felicidade Não Se Compra", "1946", getGenero("Drama"), ""));
        filmeList.add(new Filme("O Mágico de Oz", "1939", getGenero("Fantasia"), ""));
        filmeList.add(new Filme("Laranja Mecânica", "1971", getGenero("Ficção Científica"), ""));
        filmeList.add(new Filme("Taxi Driver", "1976", getGenero("Drama"), ""));
        filmeList.add(new Filme("O Exorcista", "1973", getGenero("Terror"), ""));
        filmeList.add(new Filme("A Lista de Schindler", "1993", getGenero("Drama"), ""));
        filmeList.add(new Filme("O Silêncio dos Inocentes", "1991", getGenero("Thriller"), ""));
        filmeList.add(new Filme("Doutor Jivago", "1965", getGenero("Drama"), ""));
        filmeList.add(new Filme("Sangue Negro", "2007", getGenero("Drama"), ""));
        filmeList.add(new Filme("O Grande Lebowski", "1998", getGenero("Comédia"), ""));
        filmeList.add(new Filme("Forrest Gump", "1994", getGenero("Drama"), ""));
        filmeList.add(new Filme("Caminhos Perigosos", "1953", getGenero("Crime"), ""));
        filmeList.add(new Filme("Encontros e Desencontros", "2003", getGenero("Comédia Romance"), ""));
        filmeList.add(new Filme("A Casa monstro", "2006", getGenero("Terror"), "thumb_teste_thumb.jpg"));
    }

    private void carregarGeneros(){
        GeneroList.add(new Genero(1, "Ação"));
        GeneroList.add(new Genero(2, "Aventura"));
        GeneroList.add(new Genero(3, "Comédia"));
        GeneroList.add(new Genero(4, "Drama"));
        GeneroList.add(new Genero(5, "Terror"));
        GeneroList.add(new Genero(6, "Ficção Científica"));
        GeneroList.add(new Genero(7, "Fantasia"));
        GeneroList.add(new Genero(8, "Romance"));
        GeneroList.add(new Genero(9, "Documentário"));
        GeneroList.add(new Genero(10, "Animação"));
        GeneroList.add(new Genero(11, "Thriller"));
        GeneroList.add(new Genero(12, "Crime"));
        GeneroList.add(new Genero(13, "Comédia Romance"));
        GeneroList.add(new Genero(14, "Musical"));
    }

    public Genero getGenero(String nome) {
        for (Genero g : GeneroList) {
            if (nome.toUpperCase().equals(g.getNome().toUpperCase())) {
                return g;
            }
        }
        return new Genero(0, "");
    }

    public List<Genero> getGeneroList(){
        return GeneroList;
    }

    public Filme getFilmeAleatorio(){
        Random random=new Random();
        Filme filmeAleatorio=filmeList.get(random.nextInt(filmeList.size()));
        return filmeAleatorio;
    }
    public List<Filme> getFilmeList(){
        return filmeList;
    }
    public Filme getFilmeTitulo(String titulo){
        Filme filme=null;
        for(Filme f : filmeList){
            if(titulo.equalsIgnoreCase(f.getTitulo()))
                filme=f;
        }
        return filme;
    }

    public List <Filme> getFilmeGenero(String genero) {
        List <Filme> filmes=new ArrayList();
        for(Filme f : filmeList){
            if(genero.equalsIgnoreCase(f.getGenero()))
                filmes.add(f);
        }
        return filmes;
    }

    public List<Filme> getFilmeAno(int dtInicio, int dtFim) {
        List <Filme> filmes=new ArrayList();
        for(Filme f : filmeList){
            if(Integer.parseInt(f.getAno())>=dtInicio && Integer.parseInt(f.getAno())<=dtFim)
                filmes.add(f);
        }
        return filmes;
    }
    public boolean addFilme(Filme filme){
        return filmeList.add(filme);
    }

    public List<Filme> getlistKeyword(String chave){
        ArrayList<Filme> filmesAchados = new ArrayList<>();
        for (Filme f: filmeList){
            if (f.getTitulo().contains(chave))
                filmesAchados.add(f);
        }

        return filmesAchados;
    }


}
