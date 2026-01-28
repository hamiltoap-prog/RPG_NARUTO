import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useCharacterStore from '@/store/characterStore';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Save, Heart, Sparkles, Shield, Zap } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Step7EditSummary = ({ characterId }) => {
  const navigate = useNavigate();
  const { character, prevStep, resetCharacter } = useCharacterStore();
  const [clan, setClan] = useState(null);
  const [charClass, setCharClass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [calculatedStats, setCalculatedStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clanRes, classRes] = await Promise.all([
          axios.get(`${API}/clans/${character.clan_id}`),
          axios.get(`${API}/classes/${character.class_id}`)
        ]);
        setClan(clanRes.data);
        setCharClass(classRes.data);
        
        const stats = calculateStats(character, clanRes.data, classRes.data);
        setCalculatedStats(stats);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [character]);

  const calculateModifier = (score) => {
    return Math.floor((score - 10) / 2);
  };

  const calculateStats = (char, clanData, classData) => {
    const finalAttrs = {};
    Object.keys(char.attributes).forEach(attr => {
      finalAttrs[attr] = char.attributes[attr] + (clanData.bonuses[attr] || 0);
    });

    const constMod = calculateModifier(finalAttrs.constitution);
    const dexMod = calculateModifier(finalAttrs.dexterity);

    const hitDie = parseInt(classData.hit_die.split('d')[1]);
    const chakraDie = parseInt(classData.chakra_die.split('d')[1]);
    const profBonus = 3;

    return {
      attributes: finalAttrs,
      hp: Math.max(1, hitDie + constMod),
      chakra: Math.max(1, chakraDie + constMod),
      armorClass: 10 + dexMod + Math.floor(profBonus / 2),
      proficiencyBonus: profBonus
    };
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        name: character.name,
        attributes: character.attributes,
        description: character.description,
        equipment: character.equipment || [],
        armor: character.armor,
        weapons: character.weapons || [],
        jutsus: character.jutsus || []
      };

      await axios.put(`${API}/characters/${characterId}`, payload);
      
      toast.success('Personagem atualizado com sucesso!');
      resetCharacter();
      navigate(`/character/${characterId}`);
    } catch (error) {
      console.error('Erro ao atualizar personagem:', error);
      toast.error('Erro ao atualizar personagem. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-400">Calculando estatísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-6">
        <h2 className="text-4xl font-heading font-bold text-white mb-2">
          Resumo do <span className="text-primary">Personagem</span>
        </h2>
        <p className="text-slate-400">
          Revise as informações antes de salvar as alterações.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 p-8"
      >
        <h3 className="text-3xl font-heading font-bold text-white mb-2">
          {character.name}
        </h3>
        <p className="text-lg text-slate-300">
          {clan?.name} • {charClass?.name} • Nível 1
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card/40 border border-white/5 p-6 text-center"
        >
          <Heart className="w-8 h-8 mx-auto mb-2 text-red-500" />
          <p className="text-2xl font-mono font-bold text-white">{calculatedStats?.hp}</p>
          <p className="text-xs text-slate-400 uppercase tracking-wider">Pontos de Vida</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-card/40 border border-white/5 p-6 text-center"
        >
          <Sparkles className="w-8 h-8 mx-auto mb-2 text-blue-500" />
          <p className="text-2xl font-mono font-bold text-white">{calculatedStats?.chakra}</p>
          <p className="text-xs text-slate-400 uppercase tracking-wider">Pontos de Chakra</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-card/40 border border-white/5 p-6 text-center"
        >
          <Shield className="w-8 h-8 mx-auto mb-2 text-green-500" />
          <p className="text-2xl font-mono font-bold text-white">{calculatedStats?.armorClass}</p>
          <p className="text-xs text-slate-400 uppercase tracking-wider">Classe de Armadura</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-card/40 border border-white/5 p-6 text-center"
        >
          <Zap className="w-8 h-8 mx-auto mb-2 text-orange-500" />
          <p className="text-2xl font-mono font-bold text-white">+{calculatedStats?.proficiencyBonus}</p>
          <p className="text-xs text-slate-400 uppercase tracking-wider">Bônus de Proficiência</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card/40 border border-white/5 p-6"
      >
        <h3 className="text-lg font-heading font-bold text-white mb-4">Atributos</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {Object.entries(calculatedStats?.attributes || {}).map(([attr, value]) => (
            <div key={attr} className="text-center">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                {attr.substring(0, 3)}
              </p>
              <p className="text-2xl font-mono font-bold text-primary">{value}</p>
              <p className="text-xs text-slate-500 font-mono">
                ({calculateModifier(value) >= 0 ? '+' : ''}{calculateModifier(value)})
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card/40 border border-white/5 p-6"
        >
          <h3 className="text-lg font-heading font-bold text-white mb-4">Equipamentos</h3>
          <div className="space-y-2">
            {character.armor && (
              <p className="text-sm text-slate-300">• {character.armor}</p>
            )}
            {character.weapons?.map((weapon, i) => (
              <p key={i} className="text-sm text-slate-300">• {weapon}</p>
            ))}
            {character.equipment?.map((item, i) => (
              <p key={i} className="text-sm text-slate-300">• {item}</p>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card/40 border border-white/5 p-6"
        >
          <h3 className="text-lg font-heading font-bold text-white mb-4">Jutsus</h3>
          <div className="space-y-2">
            {character.jutsus?.map((jutsu, i) => (
              <p key={i} className="text-sm text-slate-300">• {jutsu}</p>
            ))}
            {(!character.jutsus || character.jutsus.length === 0) && (
              <p className="text-sm text-slate-500">Nenhum jutsu adicionado</p>
            )}
          </div>
        </motion.div>
      </div>

      <div className="flex justify-between pt-6 border-t border-slate-800">
        <Button
          data-testid="wizard-step-prev-btn"
          onClick={prevStep}
          variant="secondary"
          size="lg"
          disabled={saving}
        >
          <ChevronLeft className="mr-2 h-5 w-5" /> Anterior
        </Button>
        <Button
          data-testid="save-character-btn"
          onClick={handleSave}
          disabled={saving}
          size="lg"
        >
          {saving ? (
            <>
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              Salvando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-5 w-5" />
              Salvar Alterações
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Step7EditSummary;
