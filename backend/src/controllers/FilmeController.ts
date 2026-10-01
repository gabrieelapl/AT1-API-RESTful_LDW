import { Request, Response } from 'express';
import { Filme } from '../models/Filme';

export class FilmeController {
  public static async index(req: Request, res: Response): Promise<Response> {
    try {
      const filmes = await Filme.findAll({
        attributes: ['id', 'titulo', 'genero', 'ano_lancamento', 'nota', 'disponibilidade_plataforma', 'createdAt', 'updatedAt']
      });
      return res.status(200).json(filmes);
    } catch (error: any) {
      return res.status(500).json({ erro: 'Erro ao listar filmes.', detalhe: error.message });
    }
  }

  public static async show(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const filme = await Filme.findByPk(Number(id), {
        attributes: ['id', 'titulo', 'genero', 'ano_lancamento', 'nota', 'disponibilidade_plataforma', 'createdAt', 'updatedAt']
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

      if (!titulo || !genero || !ano_lancamento || nota === undefined) {
        return res.status(400).json({ erro: 'Os campos titulo, genero, ano_lancamento e nota sao obrigatorios.' });
      }

      const novoFilme = await Filme.create({
        titulo,
        genero,
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
      const { id } = req.params;
      const { titulo, genero, ano_lancamento, nota, disponibilidade_plataforma } = req.body;

      const filme = await Filme.findByPk(Number(id));

      if (!filme) {
        return res.status(404).json({ erro: 'Filme nao encontrado para atualizacao.' });
      }

      if (titulo !== undefined) filme.titulo = titulo;
      if (genero !== undefined) filme.genero = genero;
      if (ano_lancamento !== undefined) filme.ano_lancamento = ano_lancamento;
      if (nota !== undefined) filme.nota = nota;
      if (disponibilidade_plataforma !== undefined) filme.disponibilidade_plataforma = disponibilidade_plataforma;

      await filme.save();

      return res.status(200).json(filme);
    } catch (error: any) {
      return res.status(500).json({ erro: 'Erro ao atualizar filme.', detalhe: error.message });
    }
  }

  public static async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const filme = await Filme.findByPk(Number(id));

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