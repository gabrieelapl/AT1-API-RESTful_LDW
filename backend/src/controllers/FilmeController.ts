import { Request, Response } from 'express';
import { Filme } from '../models/Filme';

export class FilmeController {
  public static async index(req: Request, res: Response): Promise<Response> {
    try {
      const filmes = await Filme.findAll({
        attributes: ['id', 'titulo', 'genero', 'ano_lancamento', 'nota', 'disponibilidade_plataforma', 'createdAt']
      });
      return res.status(200).json(filmes);
    } catch (error: any) {
      return res.status(500).json({ erro: 'Erro ao listar filmes.', detalhe: error.message });
    }
  }

  public static async show(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id as string, 10);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ erro: 'O ID informado deve ser um numero valido.' });
      }

      const filme = await Filme.findByPk(id, {
        attributes: ['id', 'titulo', 'genero', 'ano_lancamento', 'nota', 'disponibilidade_plataforma', 'createdAt']
      });

      if (!filme) {
        return res.status(404).json({ erro: 'Filme nao encontrado.' });
      }

      return res.status(200).json(filme);
    } catch (error: any) {
      return res.status(500).json({ erro: 'Erro ao buscar filme.', detalhe: error.message });
    }
  }

  public static async create(req: Request, res: Response): Promise<Response> {
    try {
      const { titulo, genero, ano_lancamento, nota, disponibilidade_plataforma } = req.body;

      if (!titulo || typeof titulo !== 'string' || titulo.trim() === '') {
        return res.status(400).json({ erro: 'O campo titulo e obrigatorio.' });
      }

      if (!genero || typeof genero !== 'string' || genero.trim() === '') {
        return res.status(400).json({ erro: 'O campo genero e obrigatorio.' });
      }

      if (ano_lancamento === undefined || typeof ano_lancamento !== 'number' || ano_lancamento < 1888) {
        return res.status(400).json({ erro: 'Informe um ano de lancamento valido.' });
      }

      if (nota === undefined || typeof nota !== 'number' || nota < 0 || nota > 10) {
        return res.status(400).json({ erro: 'A nota deve ser um numero entre 0 e 10.' });
      }

      const filmeExistente = await Filme.findOne({ where: { titulo: titulo.trim() } });
      if (filmeExistente) {
        return res.status(409).json({ erro: 'Ja existe um filme cadastrado com este titulo.' });
      }

      const novoFilme = await Filme.create({
        titulo: titulo.trim(),
        genero: genero.trim(),
        ano_lancamento,
        nota,
        disponibilidade_plataforma: disponibilidade_plataforma ?? true
      });

      return res.status(201).json(novoFilme);
    } catch (error: any) {
      return res.status(500).json({ erro: 'Erro ao cadastrar filme.', detalhe: error.message });
    }
  }

  public static async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id as string, 10);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ erro: 'O ID informado deve ser um numero valido.' });
      }

      const { titulo, genero, ano_lancamento, nota, disponibilidade_plataforma } = req.body;

      const filme = await Filme.findByPk(id);
      if (!filme) {
        return res.status(404).json({ erro: 'Filme nao encontrado para atualizacao.' });
      }

      if (titulo !== undefined) {
        if (typeof titulo !== 'string' || titulo.trim() === '') {
          return res.status(400).json({ erro: 'O campo titulo deve ser um texto valido.' });
        }

        const tituloEmUso = await Filme.findOne({ where: { titulo: titulo.trim() } });
        if (tituloEmUso && tituloEmUso.id !== id) {
          return res.status(409).json({ erro: 'Este titulo ja esta em uso por outro filme.' });
        }

        filme.titulo = titulo.trim();
      }

      if (genero !== undefined) {
        if (typeof genero !== 'string' || genero.trim() === '') {
          return res.status(400).json({ erro: 'O campo genero deve ser um texto valido.' });
        }
        filme.genero = genero.trim();
      }

      if (ano_lancamento !== undefined) {
        if (typeof ano_lancamento !== 'number' || ano_lancamento < 1888) {
          return res.status(400).json({ erro: 'Informe um ano de lancamento valido.' });
        }
        filme.ano_lancamento = ano_lancamento;
      }

      if (nota !== undefined) {
        if (typeof nota !== 'number' || nota < 0 || nota > 10) {
          return res.status(400).json({ erro: 'A nota deve ser um numero entre 0 e 10.' });
        }
        filme.nota = nota;
      }

      if (disponibilidade_plataforma !== undefined) {
        if (typeof disponibilidade_plataforma !== 'boolean') {
          return res.status(400).json({ erro: 'O campo disponibilidade_plataforma deve ser booleano (true/false).' });
        }
        filme.disponibilidade_plataforma = disponibilidade_plataforma;
      }

      await filme.save();

      return res.status(200).json(filme);
    } catch (error: any) {
      return res.status(500).json({ erro: 'Erro ao atualizar filme.', detalhe: error.message });
    }
  }

  public static async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id as string, 10);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ erro: 'O ID informado deve ser um numero valido.' });
      }

      const filme = await Filme.findByPk(id);
      if (!filme) {
        return res.status(404).json({ erro: 'Filme nao encontrado para exclusao.' });
      }

      await filme.destroy();
      return res.status(204).send();
    } catch (error: any) {
      return res.status(500).json({ erro: 'Erro ao excluir filme.', detalhe: error.message });
    }
  }
}