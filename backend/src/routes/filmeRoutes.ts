import { Router, Request, Response } from 'express';
import { Filme } from '../models/Filme';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const filmes = await Filme.findAll();
    return res.status(200).json(filmes);
  } catch (error: any) {
    return res.status(500).json({ erro: 'Erro ao listar filmes.', detalhe: error.message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const filme = await Filme.findByPk(Number(id));

    if (!filme) {
      return res.status(404).json({ erro: 'Filme nao encontrado.' });
    }

    return res.status(200).json(filme);
  } catch (error: any) {
    return res.status(500).json({ erro: 'Erro ao buscar filme.', detalhe: error.message });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { titulo, genero, ano_lancamento, nota, disponibilidade_plataforma } = req.body;

    if (!titulo || !genero || !ano_lancamento || nota === undefined) {
      return res.status(400).json({ 
        erro: 'titulo, genero, ano_lancamento e nota sao obrigatorios.' 
      });
    }

    const novoFilme = await Filme.create({
      titulo,
      genero,
      ano_lancamento,
      nota,
      disponibilidade_plataforma: disponibilidade_plataforma ?? true,
    });

    return res.status(201).json(novoFilme);
  } catch (error: any) {
    return res.status(500).json({ erro: 'Erro ao criar filme.', detalhe: error.message });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { titulo, genero, ano_lancamento, nota, disponibilidade_plataforma } = req.body;

    const filme = await Filme.findByPk(Number(id));

    if (!filme) {
      return res.status(404).json({ erro: 'Filme nao encontrado.' });
    }

    await filme.update({
      titulo,
      genero,
      ano_lancamento,
      nota,
      disponibilidade_plataforma,
    });

    return res.status(200).json(filme);
  } catch (error: any) {
    return res.status(500).json({ erro: 'Erro ao atualizar filme.', detalhe: error.message });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const filme = await Filme.findByPk(Number(id));

    if (!filme) {
      return res.status(404).json({ erro: 'Filme nao encontrado.' });
    }

    await filme.destroy();
    return res.status(200).json({ mensagem: 'Filme removido com sucesso.' });
  } catch (error: any) {
    return res.status(500).json({ erro: 'Erro ao remover filme.', detalhe: error.message });
  }
});

export { router as filmeRoutes };