import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Magnet, Folder, Download, Loader, CheckCircle, AlertTriangle, X } from 'lucide-react';

const App = () => {
  const [magnetLink, setMagnetLink] = useState('');
  const [directories, setDirectories] = useState([]);
  const [selectedDir, setSelectedDir] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [loadingDirs, setLoadingDirs] = useState(true);

  const fetchDirectories = useCallback(async () => {
    setLoadingDirs(true);
    try {
      const response = await axios.get('/api/directories');
      setDirectories(response.data);
      if (response.data.length > 0) {
        setSelectedDir(response.data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch directories:', error);
      setFeedback({ type: 'error', message: error.response?.data?.message || 'Não foi possível carregar os diretórios.' });
    } finally {
      setLoadingDirs(false);
    }
  }, []);

  useEffect(() => {
    fetchDirectories();
  }, [fetchDirectories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!magnetLink || !selectedDir) {
      setFeedback({ type: 'error', message: 'Por favor, preencha o magnet link e selecione um diretório.' });
      return;
    }
    setLoading(true);
    setFeedback({ type: '', message: '' });
    try {
      const response = await axios.post('/api/add-torrent', { magnetLink, downloadDir: selectedDir });
      setFeedback({ type: 'success', message: response.data.message });
      setMagnetLink('');
    } catch (error) {
      setFeedback({ type: 'error', message: error.response?.data?.message || 'Ocorreu um erro ao adicionar o torrent.' });
    } finally {
      setLoading(false);
    }
  };

  const FeedbackMessage = () => {
    if (!feedback.message) return null;
    const isSuccess = feedback.type === 'success';
    const Icon = isSuccess ? CheckCircle : AlertTriangle;
    const color = isSuccess ? 'text-success' : 'text-error';

    return (
      <div className={`flex items-center gap-3 p-3 mt-4 rounded-md text-sm ${isSuccess ? 'bg-success/10' : 'bg-error/10'}`}>
        <Icon className={`${color} h-5 w-5`} />
        <span className="flex-1">{feedback.message}</span>
        <button onClick={() => setFeedback({ type: '', message: '' })} className="text-text-secondary hover:text-text">
          <X className="h-5 w-5" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-background text-text flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-lg">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Magneto
          </h1>
          <p className="text-text-secondary mt-2">Adicione torrents ao Transmission com um clique.</p>
        </header>

        <main className="bg-surface border border-border p-8 rounded-lg shadow-lg shadow-black/20">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Magnet Link Input */}
              <div>
                <label htmlFor="magnetLink" className="block text-sm font-medium text-text-secondary mb-2">Magnet Link</label>
                <div className="relative">
                  <Magnet className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
                  <input
                    id="magnetLink"
                    type="text"
                    value={magnetLink}
                    onChange={(e) => setMagnetLink(e.target.value)}
                    placeholder="magnet:?xt=urn:btih:..."
                    className="w-full bg-background border border-border rounded-md py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Directory Selector */}
              <div>
                <label htmlFor="directory" className="block text-sm font-medium text-text-secondary mb-2">Diretório de Destino</label>
                <div className="relative">
                  <Folder className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
                  {loadingDirs ? (
                     <div className="w-full bg-background border border-border rounded-md py-3 pl-10 pr-4 flex items-center gap-2 text-text-secondary">
                        <Loader className="h-4 w-4 animate-spin" />
                        Carregando diretórios...
                     </div>
                  ) : (
                    <select
                      id="directory"
                      value={selectedDir}
                      onChange={(e) => setSelectedDir(e.target.value)}
                      className="w-full bg-background border border-border rounded-md py-3 pl-10 pr-4 appearance-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                      required
                      disabled={directories.length === 0}
                    >
                      {directories.length > 0 ? (
                        directories.map(dir => <option key={dir} value={dir}>{dir}</option>)
                      ) : (
                        <option disabled>Nenhum diretório encontrado em /media</option>
                      )}
                    </select>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={loading || loadingDirs}
                className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 px-4 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary transition-all duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed shadow-glow-primary hover:shadow-glow-primary/80"
              >
                {loading ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    Adicionando...
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5" />
                    Adicionar Torrent
                  </>
                )}
              </button>
            </div>
          </form>
          <FeedbackMessage />
        </main>
      </div>
    </div>
  );
};

export default App;
