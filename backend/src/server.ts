import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './config/database';
import { Filme } from './models/Filme';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => {
  return res.status(200).json({ status: 'OK', mensagem: 'Servidor operacional.' });
});

app.post('/api/filmes', async (req: Request, res: Response) => {
  try {
    const { titulo, genero, ano_lancamento, nota, disponibilidade_plataforma } = req.body;

    if (!titulo || !genero || !ano_lancamento || nota === undefined) {
      return res.status(400).json({ 
        erro: 'Os campos titulo, genero, ano_lancamento e nota sao obrigatorios.' 
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
    return res.status(500).json({ erro: 'Erro ao cadastrar filme.', detalhe: error.message });
  }
});

app.get('/api/filmes', async (req: Request, res: Response) => {
  try {
    const filmes = await Filme.findAll();
    return res.status(200).json(filmes);
  } catch (error: any) {
    return res.status(500).json({ erro: 'Erro ao listar filmes.', detalhe: error.message });
  }
});

app.get('/api/filmes/:id', async (req: Request, res: Response) => {
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

app.put('/api/filmes/:id', async (req: Request, res: Response) => {
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

app.delete('/api/filmes/:id', async (req: Request, res: Response) => {
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

async function main() {
  try {
    await sequelize.authenticate();
    console.log('Conexao com o banco de dados estabelecida com sucesso.');

    await sequelize.sync();

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error);
  }
}

main();