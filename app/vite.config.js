import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import Transmission from 'transmission-rpc';

// Diretório de mídia montado no container
const MEDIA_DIR = '/media';
// Diretório de download visto pelo container do Transmission
const DOWNLOAD_DIR_TRANSMISSION = '/downloads';

// Backend Express como middleware do Vite
const expressApp = express();
expressApp.use(express.json());

// Endpoint para listar os subdiretórios de mídia
expressApp.get('/api/directories', async (req, res) => {
  try {
    const entries = await fs.readdir(MEDIA_DIR, { withFileTypes: true });
    const directories = entries
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
      .sort();
    res.json(directories);
  } catch (error) {
    console.error('Erro ao listar diretórios:', error);
    res.status(500).json({ message: 'Falha ao ler o diretório de mídia. Verifique o mapeamento de volume em docker-compose.yml.' });
  }
});

// Endpoint para adicionar um novo torrent
expressApp.post('/api/add-torrent', async (req, res) => {
  const { magnetLink, downloadDir } = req.body;

  if (!magnetLink || !downloadDir) {
    return res.status(400).json({ message: 'Magnet link e diretório de destino são obrigatórios.' });
  }

  const transmission = new Transmission({
    host: 'transmission', // Nome do serviço no docker-compose
    port: 9091,
  });

  const options = {
    'download-dir': path.join(DOWNLOAD_DIR_TRANSMISSION, downloadDir),
  };

  try {
    const result = await transmission.add(magnetLink, options);
    console.log('Torrent adicionado com sucesso:', result.name);
    res.status(201).json({ message: `Torrent "${result.name}" adicionado com sucesso!` });
  } catch (error) {
    console.error('Erro ao adicionar torrent:', error);
    res.status(500).json({ message: 'Falha ao comunicar com o Transmission.' });
  }
});

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'express-middleware',
      configureServer(server) {
        server.middlewares.use(expressApp);
      },
    },
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
});
