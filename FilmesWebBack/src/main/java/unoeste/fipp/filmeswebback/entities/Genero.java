package unoeste.fipp.filmeswebback.entities;

import org.springframework.beans.factory.annotation.Autowired;
import unoeste.fipp.filmeswebback.repositories.FilmesRepositorio;

public class Genero {
    private int id;
    private String nome;


    public Genero(int id, String nome) {
        this.id = id;
        this.nome = nome;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}
