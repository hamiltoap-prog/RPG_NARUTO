import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Heart, Sparkles, Shield, Zap, Loader } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SharedCharacter = () => {
  const { shareId } = useParams();
  const [character, setCharacter] = useState(null);
  const [clan, setClan] = useState(null);
  const [charClass, setCharClass] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSharedCharacter();
  }, [shareId]);

  const fetchSharedCharacter = async () => {
    try {
      const charRes = await axios.get(`${API}/characters/share/${shareId}`);
      setCharacter(charRes.data);

      const [clanRes, classRes] = await Promise.all([
        axios.get(`${API}/clans/${charRes.data.clan_id}`),
        axios.get(`${API}/classes/${charRes.data.class_id}`)
      ]);
      setClan(clanRes.data);
      setCharClass(classRes.data);
    } catch (error) {
      console.error('Erro ao buscar personagem compartilhado:', error);
      toast.error('Personagem não encontrado');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-slate-400">Carregando personagem compartilhado...</p>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Personagem não encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-slate-800 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <h1 className="text-3xl font-heading font-bold text-white">
            Naruto <span className="text-primary">RPG</span>
          </h1>
          <p className="text-slate-400 mt-1">Ficha de Personagem Compartilhada</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Character Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 p-8 mb-8"
        >
          <h1 className="text-4xl font-heading font-bold text-white mb-2">
            {character.name}
          </h1>
          <p className="text-xl text-slate-300">
            {clan?.name} • {charClass?.name} • Nível {character.level}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card/40 border border-white/5 p-6 text-center"
          >
            <Heart className="w-10 h-10 mx-auto mb-3 text-red-500" />
            <p className="text-3xl font-mono font-bold text-white">{character.hp}</p>
            <p className="text-sm text-slate-400 uppercase tracking-wider mt-2">Pontos de Vida</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-card/40 border border-white/5 p-6 text-center"
          >
            <Sparkles className="w-10 h-10 mx-auto mb-3 text-blue-500" />
            <p className="text-3xl font-mono font-bold text-white">{character.chakra}</p>
            <p className="text-sm text-slate-400 uppercase tracking-wider mt-2">Pontos de Chakra</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-card/40 border border-white/5 p-6 text-center"
          >
            <Shield className="w-10 h-10 mx-auto mb-3 text-green-500" />
            <p className="text-3xl font-mono font-bold text-white">{character.armor_class}</p>
            <p className="text-sm text-slate-400 uppercase tracking-wider mt-2">Classe de Armadura</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-card/40 border border-white/5 p-6 text-center"
          >
            <Zap className="w-10 h-10 mx-auto mb-3 text-orange-500" />
            <p className="text-3xl font-mono font-bold text-white">+{character.proficiency_bonus}</p>
            <p className="text-sm text-slate-400 uppercase tracking-wider mt-2">Bônus de Proficiência</p>
          </motion.div>
        </div>

        {/* Attributes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card/40 border border-white/5 p-8 mb-8"
        >
          <h2 className="text-2xl font-heading font-bold text-white mb-6">Atributos</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
            {Object.entries(character.modifiers).map(([attr, modifier]) => {
              const attrLabels = {
                strength: 'FOR',
                dexterity: 'DES',
                constitution: 'CON',
                intelligence: 'INT',
                wisdom: 'SAB',
                charisma: 'CAR'
              };
              const finalValue = character.attributes[attr] + (clan?.bonuses[attr] || 0);
              
              return (
                <div key={attr} className="text-center bg-slate-900/40 border border-slate-800 p-4">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">
                    {attrLabels[attr]}
                  </p>
                  <p className="text-3xl font-mono font-bold text-primary mb-1">{finalValue}</p>
                  <p className="text-sm text-slate-500 font-mono">
                    ({modifier >= 0 ? '+' : ''}{modifier})
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Equipment & Jutsus */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card/40 border border-white/5 p-6"
          >
            <h3 className="text-xl font-heading font-bold text-white mb-4">Equipamentos</h3>
            <div className="space-y-2">
              {character.armor && (
                <p className="text-slate-300">• {character.armor}</p>
              )}
              {character.weapons?.map((weapon, i) => (
                <p key={i} className="text-slate-300">• {weapon}</p>
              ))}
              {character.equipment?.map((item, i) => (
                <p key={i} className="text-slate-300">• {item}</p>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-card/40 border border-white/5 p-6"
          >
            <h3 className="text-xl font-heading font-bold text-white mb-4">Jutsus</h3>
            <div className="space-y-2">
              {character.jutsus?.map((jutsu, i) => (
                <p key={i} className="text-slate-300">• {jutsu}</p>
              ))}
              {(!character.jutsus || character.jutsus.length === 0) && (
                <p className="text-sm text-slate-500">Nenhum jutsu</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SharedCharacter;
