import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import useCharacterStore from '@/store/characterStore';
import { Button } from '@/components/ui/button';
import { ChevronRight, Zap } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Step1Clan = () => {
  const { character, updateCharacter, nextStep } = useCharacterStore();
  const [clans, setClans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClan, setSelectedClan] = useState(character.clan_id);

  useEffect(() => {
    const fetchClans = async () => {
      try {
        const response = await axios.get(`${API}/clans`);
        setClans(response.data);
      } catch (error) {
        console.error('Erro ao buscar clãs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchClans();
  }, []);

  const handleNext = () => {
    if (selectedClan) {
      updateCharacter({ clan_id: selectedClan });
      nextStep();
    }
  };

  const getStatColor = (value) => {
    if (value === 0) return 'text-slate-500';
    if (value === 1) return 'text-blue-400';
    return 'text-orange-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-400">Carregando clãs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <h2 className="text-4xl font-heading font-bold text-white mb-2">
          Escolha seu <span className="text-primary">Clã</span>
        </h2>
        <p className="text-slate-400">
          Seu clã define sua linhagem, habilidades especiais e bônus de atributos iniciais.
        </p>
      </div>

      {/* Clans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clans.map((clan, index) => (
          <motion.div
            key={clan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setSelectedClan(clan.id)}
            data-testid={`clan-option-${clan.id}`}
            className={`group cursor-pointer p-6 border transition-all ${
              selectedClan === clan.id
                ? 'bg-slate-900/60 border-primary shadow-[0_0_20px_rgba(249,115,22,0.3)]'
                : 'bg-card/40 border-white/5 hover:border-white/10 hover:bg-slate-900/40'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xl font-heading font-bold text-white group-hover:text-primary transition-colors">
                {clan.name}
              </h3>
              {selectedClan === clan.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                >
                  <Zap className="w-4 h-4 text-white" />
                </motion.div>
              )}
            </div>

            <p className="text-sm text-slate-400 mb-4 line-clamp-2">
              {clan.description}
            </p>

            {/* Bonuses */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Bônus de Atributos
              </p>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(clan.bonuses).map(([stat, value]) => {
                  if (value === 0) return null;
                  return (
                    <div
                      key={stat}
                      className="text-xs font-mono flex items-center gap-1"
                    >
                      <span className="text-slate-400 uppercase text-[10px]">
                        {stat.substring(0, 3)}
                      </span>
                      <span className={`font-bold ${getStatColor(value)}`}>
                        +{value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Special Abilities */}
            {clan.special_abilities && clan.special_abilities.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-800">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Habilidades Especiais
                </p>
                <div className="flex flex-wrap gap-1">
                  {clan.special_abilities.map((ability, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-1 bg-slate-900/50 border border-slate-800 text-slate-300 uppercase tracking-wide"
                    >
                      {ability}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-end pt-6 border-t border-slate-800">
        <Button
          data-testid="wizard-step-next-btn"
          onClick={handleNext}
          disabled={!selectedClan}
          size="lg"
        >
          Próximo <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default Step1Clan;
