import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import useCharacterStore from '@/store/characterStore';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, Sword, Heart, Sparkles } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Step2Class = () => {
  const { character, updateCharacter, nextStep, prevStep } = useCharacterStore();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState(character.class_id);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(`${API}/classes`);
        setClasses(response.data);
      } catch (error) {
        console.error('Erro ao buscar classes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const handleNext = () => {
    if (selectedClass) {
      updateCharacter({ class_id: selectedClass });
      nextStep();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-400">Carregando classes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <h2 className="text-4xl font-heading font-bold text-white mb-2">
          Escolha sua <span className="text-primary">Classe</span>
        </h2>
        <p className="text-slate-400">
          Sua classe determina seu estilo de combate, habilidades e proficiências.
        </p>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {classes.map((charClass, index) => (
          <motion.div
            key={charClass.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setSelectedClass(charClass.id)}
            data-testid={`class-option-${charClass.id}`}
            className={`group cursor-pointer p-6 border transition-all ${
              selectedClass === charClass.id
                ? 'bg-slate-900/60 border-primary shadow-[0_0_20px_rgba(249,115,22,0.3)]'
                : 'bg-card/40 border-white/5 hover:border-white/10 hover:bg-slate-900/40'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xl font-heading font-bold text-white group-hover:text-primary transition-colors">
                {charClass.name}
              </h3>
              {selectedClass === charClass.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                >
                  <Sword className="w-4 h-4 text-white" />
                </motion.div>
              )}
            </div>

            <p className="text-sm text-slate-400 mb-4">
              {charClass.description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-2 bg-slate-900/50 border border-slate-800">
                <Heart className="w-4 h-4 mx-auto mb-1 text-red-400" />
                <p className="text-xs text-slate-500">HP</p>
                <p className="text-sm font-mono font-bold text-white">{charClass.hit_die}</p>
              </div>
              <div className="text-center p-2 bg-slate-900/50 border border-slate-800">
                <Sparkles className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                <p className="text-xs text-slate-500">Chakra</p>
                <p className="text-sm font-mono font-bold text-white">{charClass.chakra_die}</p>
              </div>
              <div className="text-center p-2 bg-slate-900/50 border border-slate-800">
                <Sword className="w-4 h-4 mx-auto mb-1 text-orange-400" />
                <p className="text-xs text-slate-500">Atributo</p>
                <p className="text-[10px] font-mono font-bold text-white uppercase">
                  {charClass.primary_ability.substring(0, 3)}
                </p>
              </div>
            </div>

            {/* Proficiencies */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Proficiências
              </p>
              <div className="text-xs text-slate-400">
                {charClass.proficiencies.skills.slice(0, 3).join(', ')}
              </div>
            </div>

            {/* Special Features */}
            {charClass.special_features && charClass.special_features.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-800">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Habilidades Iniciais
                </p>
                <div className="flex flex-wrap gap-1">
                  {charClass.special_features.map((feature, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-1 bg-slate-900/50 border border-slate-800 text-slate-300 uppercase tracking-wide"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-slate-800">
        <Button
          data-testid="wizard-step-prev-btn"
          onClick={prevStep}
          variant="secondary"
          size="lg"
        >
          <ChevronLeft className="mr-2 h-5 w-5" /> Anterior
        </Button>
        <Button
          data-testid="wizard-step-next-btn"
          onClick={handleNext}
          disabled={!selectedClass}
          size="lg"
        >
          Próximo <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default Step2Class;
