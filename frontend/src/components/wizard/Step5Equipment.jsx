import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useCharacterStore from '@/store/characterStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight, ChevronLeft, Plus, X } from 'lucide-react';

const Step5Equipment = () => {
  const { character, updateCharacter, nextStep, prevStep } = useCharacterStore();
  const [equipment, setEquipment] = useState(character.equipment || []);
  const [armor, setArmor] = useState(character.armor || '');
  const [weapons, setWeapons] = useState(character.weapons || []);
  const [newItem, setNewItem] = useState('');
  const [newWeapon, setNewWeapon] = useState('');

  const addEquipment = () => {
    if (newItem.trim()) {
      setEquipment([...equipment, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeEquipment = (index) => {
    setEquipment(equipment.filter((_, i) => i !== index));
  };

  const addWeapon = () => {
    if (newWeapon.trim()) {
      setWeapons([...weapons, newWeapon.trim()]);
      setNewWeapon('');
    }
  };

  const removeWeapon = (index) => {
    setWeapons(weapons.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    updateCharacter({ equipment, armor, weapons });
    nextStep();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <h2 className="text-4xl font-heading font-bold text-white mb-2">
          Escolha seus <span className="text-primary">Equipamentos</span>
        </h2>
        <p className="text-slate-400">
          Selecione suas armas, armadura e equipamentos iniciais.
        </p>
      </div>

      {/* Armor */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/40 border border-white/5 p-6"
      >
        <label className="block text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
          Armadura
        </label>
        <Input
          data-testid="armor-input"
          type="text"
          value={armor}
          onChange={(e) => setArmor(e.target.value)}
          placeholder="Ex: Colete de Couro"
          className="bg-slate-900/50 border-slate-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-white placeholder:text-slate-500"
        />
      </motion.div>

      {/* Weapons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card/40 border border-white/5 p-6"
      >
        <label className="block text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
          Armas
        </label>
        <div className="flex gap-2 mb-3">
          <Input
            data-testid="weapon-input"
            type="text"
            value={newWeapon}
            onChange={(e) => setNewWeapon(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addWeapon()}
            placeholder="Ex: Kunai, Shuriken, Katana..."
            className="bg-slate-900/50 border-slate-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-white placeholder:text-slate-500"
          />
          <Button data-testid="add-weapon-btn" onClick={addWeapon} variant="secondary">
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        <div className="space-y-2">
          {weapons.map((weapon, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-slate-900/50 border border-slate-800 px-4 py-2"
              data-testid={`weapon-item-${index}`}
            >
              <span className="text-slate-300">{weapon}</span>
              <button
                onClick={() => removeWeapon(index)}
                className="text-red-400 hover:text-red-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Other Equipment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card/40 border border-white/5 p-6"
      >
        <label className="block text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
          Outros Equipamentos
        </label>
        <div className="flex gap-2 mb-3">
          <Input
            data-testid="equipment-input"
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addEquipment()}
            placeholder="Ex: Kit Médico, Papel para Selos..."
            className="bg-slate-900/50 border-slate-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-white placeholder:text-slate-500"
          />
          <Button data-testid="add-equipment-btn" onClick={addEquipment} variant="secondary">
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        <div className="space-y-2">
          {equipment.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-slate-900/50 border border-slate-800 px-4 py-2"
              data-testid={`equipment-item-${index}`}
            >
              <span className="text-slate-300">{item}</span>
              <button
                onClick={() => removeEquipment(index)}
                className="text-red-400 hover:text-red-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

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

export default Step5Equipment;
