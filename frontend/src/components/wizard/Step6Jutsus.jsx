import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useCharacterStore from '@/store/characterStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ChevronRight, ChevronLeft, Plus, X } from 'lucide-react';

const Step6Jutsus = () => {
  const { character, updateCharacter, nextStep, prevStep } = useCharacterStore();
  const [jutsus, setJutsus] = useState(character.jutsus || []);
  const [newJutsuName, setNewJutsuName] = useState('');
  const [newJutsuDetails, setNewJutsuDetails] = useState('');

  const addJutsu = () => {
    if (newJutsuName.trim()) {
      setJutsus([...jutsus, { name: newJutsuName.trim(), details: newJutsuDetails.trim() }]);
      setNewJutsuName('');
      setNewJutsuDetails('');
    }
  };

  const removeJutsu = (index) => {
    setJutsus(jutsus.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    updateCharacter({ jutsus });
    nextStep();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <h2 className="text-4xl font-heading font-bold text-white mb-2">
          Escolha seus <span className="text-primary">Jutsus</span>
        </h2>
        <p className="text-slate-400">
          Selecione os jutsus que seu personagem conhece inicialmente e adicione detalhes sobre cada um.
        </p>
      </div>

      {/* Add Jutsu Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/40 border border-white/5 p-6"
      >
        <label className="block text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
          Adicionar Novo Jutsu
        </label>
        <div className="space-y-3">
          <Input
            type="text"
            value={newJutsuName}
            onChange={(e) => setNewJutsuName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !newJutsuDetails && addJutsu()}
            placeholder="Nome do Jutsu (ex: Kage Bunshin no Jutsu)"
            className="bg-slate-900/50 border-slate-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-white placeholder:text-slate-500"
            data-testid="new-jutsu-name"
          />
          <Textarea
            value={newJutsuDetails}
            onChange={(e) => setNewJutsuDetails(e.target.value)}
            placeholder="Detalhes do Jutsu (opcional): como funciona, efeitos, rank, etc..."
            className="bg-slate-900/50 border-slate-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-white placeholder:text-slate-500 min-h-[80px]"
            data-testid="new-jutsu-details"
          />
          <Button
            onClick={addJutsu}
            variant="secondary"
            className="w-full"
            data-testid="add-jutsu-btn"
          >
            <Plus className="mr-2 h-5 w-5" />
            Adicionar Jutsu
          </Button>
        </div>
      </motion.div>

      {/* Jutsus List */}
      <div className="space-y-3">
        {jutsus.map((jutsu, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-card/40 border border-white/5 p-4"
            data-testid={`jutsu-item-${index}`}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-heading font-bold text-white">
                {jutsu.name}
              </h3>
              <button
                onClick={() => removeJutsu(index)}
                className="text-red-400 hover:text-red-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {jutsu.details && (
              <p className="text-sm text-slate-400 whitespace-pre-wrap">
                {jutsu.details}
              </p>
            )}
          </motion.div>
        ))}
        {jutsus.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-8">
            Nenhum jutsu adicionado ainda. Adicione jutsus que seu personagem conhece.
          </p>
        )}
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
          size="lg"
        >
          Próximo <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default Step6Jutsus;
