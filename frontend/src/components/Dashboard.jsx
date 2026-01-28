import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from './ui/button';
import { Plus, Trash2, Eye, Share2, Loader, Edit } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { toast } from 'sonner';
import useCharacterStore from '@/store/characterStore';
import QuickStatsControl from './QuickStatsControl';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const navigate = useNavigate();
  const { resetCharacter } = useCharacterStore();
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    try {
      const response = await axios.get(`${API}/characters`);
      setCharacters(response.data);
    } catch (error) {
      console.error('Erro ao buscar personagens:', error);
      toast.error('Erro ao carregar personagens');
    } finally {
      setLoading(false);
    }
  };

  const handleNewCharacter = () => {
    resetCharacter();
    navigate('/create');
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/characters/${id}`);
      toast.success('Personagem deletado com sucesso');
      fetchCharacters();
    } catch (error) {
      console.error('Erro ao deletar personagem:', error);
      toast.error('Erro ao deletar personagem');
    }
  };

  const handleShare = (shareId) => {
    const shareUrl = `${window.location.origin}/share/${shareId}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Link copiado para a área de transferência!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-slate-400">Carregando personagens...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-slate-800 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-heading font-bold text-white">
                Naruto <span className="text-primary">RPG</span>
              </h1>
              <p className="text-slate-400 mt-1">Criador de Personagens</p>
            </div>
            <Button
              data-testid="create-new-character-btn"
              onClick={handleNewCharacter}
              size="lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              Novo Personagem
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {characters.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="mb-6">
              <div className="w-20 h-20 bg-slate-900/50 border border-slate-800 rounded-full mx-auto flex items-center justify-center">
                <Plus className="h-10 w-10 text-slate-600" />
              </div>
            </div>
            <h2 className="text-2xl font-heading font-bold text-white mb-2">
              Nenhum personagem criado
            </h2>
            <p className="text-slate-400 mb-8">
              Comece criando seu primeiro personagem ninja!
            </p>
            <Button onClick={handleNewCharacter} size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Criar Primeiro Personagem
            </Button>
          </motion.div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-heading font-bold text-white mb-2">
                Seus Personagens
              </h2>
              <p className="text-slate-400">
                {characters.length} {characters.length === 1 ? 'personagem' : 'personagens'} criado{characters.length === 1 ? '' : 's'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {characters.map((char, index) => (
                <motion.div
                  key={char.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  data-testid={`character-card-${char.id}`}
                  className="group bg-card/40 border border-white/5 hover:border-primary/30 transition-all overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-heading font-bold text-white group-hover:text-primary transition-colors">
                          {char.name}
                        </h3>
                        <p className="text-sm text-slate-400 mt-1">
                          Nível {char.level}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Nível:</span>
                        <span className="font-mono text-white">{char.level}</span>
                      </div>
                      
                      {/* Quick Stats Control */}
                      <QuickStatsControl character={char} onUpdate={fetchCharacters} />
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">CA:</span>
                        <span className="font-mono text-white">{char.armor_class}</span>
                      </div>
                      
                      {char.condition && char.condition !== "Normal" && (
                        <div className="mt-2 px-2 py-1 bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 text-xs text-center">
                          {char.condition}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-slate-800">
                      <Button
                        data-testid={`view-character-${char.id}`}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => navigate(`/character/${char.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                      <Button
                        data-testid={`edit-character-${char.id}`}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => navigate(`/edit/${char.id}`)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        data-testid={`share-character-${char.id}`}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleShare(char.share_id)}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            data-testid={`delete-character-${char.id}`}
                            variant="destructive"
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-slate-900 border-slate-800">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">
                              Confirmar Exclusão
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-slate-400">
                              Tem certeza que deseja deletar o personagem <span className="text-primary font-semibold">{char.name}</span>? 
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-slate-800 text-white hover:bg-slate-700">
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(char.id)}
                              className="bg-red-600 text-white hover:bg-red-700"
                            >
                              Deletar Personagem
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
