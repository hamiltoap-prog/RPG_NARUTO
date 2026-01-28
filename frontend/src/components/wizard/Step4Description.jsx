import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useCharacterStore from '@/store/characterStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const Step4Description = () => {
  const { character, updateCharacter, updateDescription, nextStep, prevStep } = useCharacterStore();
  const [description, setDescription] = useState(character.description);
  const [name, setName] = useState(character.name || '');

  const handleChange = (field, value) => {
    setDescription({ ...description, [field]: value });
  };

  const handleNext = () => {
    updateCharacter({ name });
    updateDescription(description);
    nextStep();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <h2 className="text-4xl font-heading font-bold text-white mb-2">
          Descreva seu <span className="text-primary">Personagem</span>
        </h2>
        <p className="text-slate-400">
          Defina o nome, informações básicas e personalidade do seu shinobi.
        </p>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/40 border border-white/5 p-6"
        >
          <Label className="block text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
            Nome do Personagem *
          </Label>
          <Input
            data-testid="character-name-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Uzumaki Naruto"
            className="bg-slate-900/50 border-slate-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-white placeholder:text-slate-500 h-12 text-lg"
            required
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card/40 border border-white/5 p-6"
        >
          <Label className="block text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
            Idade
          </Label>
          <Input
            data-testid="character-age-input"
            type="number"
            value={description.age || ''}
            onChange={(e) => handleChange('age', parseInt(e.target.value) || null)}
            placeholder="Ex: 16"
            className="bg-slate-900/50 border-slate-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-white placeholder:text-slate-500 h-12"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card/40 border border-white/5 p-6"
        >
          <Label className="block text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
            Rank
          </Label>
          <Input
            data-testid="character-rank-input"
            type="text"
            value={description.rank || ''}
            onChange={(e) => handleChange('rank', e.target.value)}
            placeholder="Ex: Rank A, Rank B, Rank S"
            className="bg-slate-900/50 border-slate-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-white placeholder:text-slate-500 h-12"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card/40 border border-white/5 p-6"
        >
          <Label className="block text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
            Graduação
          </Label>
          <Input
            data-testid="character-title-input"
            type="text"
            value={description.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Ex: Genin, Chunin, Jounin"
            className="bg-slate-900/50 border-slate-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-white placeholder:text-slate-500 h-12"
          />
        </motion.div>
      </div>

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card/40 border border-white/5 p-6"
      >
        <Label className="block text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
          Aparência Física
        </Label>
        <Textarea
          data-testid="character-appearance-input"
          value={description.appearance}
          onChange={(e) => handleChange('appearance', e.target.value)}
          placeholder="Descreva a aparência física do seu personagem..."
          className="bg-slate-900/50 border-slate-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-white placeholder:text-slate-500 min-h-[100px] resize-none"
          rows={4}
        />
      </motion.div>

      {/* Personality Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card/40 border border-white/5 p-6"
        >
          <Label className="block text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
            Traços de Personalidade
          </Label>
          <Textarea
            data-testid="character-personality-input"
            value={description.personality_traits}
            onChange={(e) => handleChange('personality_traits', e.target.value)}
            placeholder="Como seu personagem se comporta?"
            className="bg-slate-900/50 border-slate-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-white placeholder:text-slate-500 min-h-[100px] resize-none"
            rows={4}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card/40 border border-white/5 p-6"
        >
          <Label className="block text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
            Ideais
          </Label>
          <Textarea
            data-testid="character-ideals-input"
            value={description.ideals}
            onChange={(e) => handleChange('ideals', e.target.value)}
            placeholder="No que seu personagem acredita?"
            className="bg-slate-900/50 border-slate-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-white placeholder:text-slate-500 min-h-[100px] resize-none"
            rows={4}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card/40 border border-white/5 p-6"
        >
          <Label className="block text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
            Vínculos
          </Label>
          <Textarea
            data-testid="character-bonds-input"
            value={description.bonds}
            onChange={(e) => handleChange('bonds', e.target.value)}
            placeholder="Quem ou o que é importante para ele?"
            className="bg-slate-900/50 border-slate-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-white placeholder:text-slate-500 min-h-[100px] resize-none"
            rows={4}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card/40 border border-white/5 p-6"
        >
          <Label className="block text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
            Falhas
          </Label>
          <Textarea
            data-testid="character-flaws-input"
            value={description.flaws}
            onChange={(e) => handleChange('flaws', e.target.value)}
            placeholder="Quais são suas fraquezas?"
            className="bg-slate-900/50 border-slate-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-white placeholder:text-slate-500 min-h-[100px] resize-none"
            rows={4}
          />
        </motion.div>
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
          disabled={!name.trim()}
          size="lg"
        >
          Próximo <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default Step4Description;
