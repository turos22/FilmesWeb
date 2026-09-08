package unoeste.fipp.filmeswebback.entities;

public class Filme {
    private String titulo;
    private String ano;
    private Genero genero;
    private String fileName;


    public Filme(String titulo, String ano, Genero genero, String fileName) {
        this.titulo = titulo;
        this.ano = ano;
        this.fileName = fileName;
        this.genero = genero;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getAno() {
        return ano;
    }

    public void setAno(String ano) {
        this.ano = ano;
    }

    public String getGenero() {
        return genero.getNome();
    }

    public void setGenero(Genero genero) {
        this.genero = genero;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
}
