import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import useCharacterStore from '@/store/characterStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight, ChevronLeft, RefreshCw } from 'lucide-react';
import DiceRoller from '@/components/DiceRoller';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Step3Attributes = () => {
  const { character, updateAttributes, nextStep, prevStep } = useCharacterStore();
  const [attributes, setAttributes] = useState(character.attributes);
  const [clan, setClan] = useState(null);
  const [method, setMethod] = useState('standard');
  const [rollingFor, setRollingFor] = useState(null);
  const [standardArray] = useState([15, 14, 13, 12, 10, 8]);
  const [assignedValues, setAssignedValues] = useState({});

  useEffect(() => {
    const fetchClan = async () => {
      try {
        const response = await axios.get(`${API}/clans/${character.clan_id}`);
        setClan(response.data);
      } catch (error) {
        console.error('Erro ao buscar clã:', error);
      }
    };
    if (character.clan_id) {
      fetchClan();
    }
  }, [character.clan_id]);

  const calculateModifier = (score) => {
    return Math.floor((score - 10) / 2);
  };

  const getTotalAttribute = (attr) => {
    const base = attributes[attr] || 10;
    const clanBonus = clan?.bonuses[attr] || 0;
    return base + clanBonus;
  };

  const handleAttributeChange = (attr, value) => {
    const numValue = parseInt(value) || 0;
    setAttributes({ ...attributes, [attr]: numValue });
  };

  const handleStandardArrayAssign = (attr, value) => {
    const newAssigned = { ...assignedValues };
    
    // Remove previous assignment of this value
    Object.keys(newAssigned).forEach(key => {
      if (newAssigned[key] === value) {
        delete newAssigned[key];
      }
    });
    
    // Assign new value
    if (newAssigned[attr] !== value) {
      newAssigned[attr] = value;
    } else {
      delete newAssigned[attr];
    }
    
    setAssignedValues(newAssigned);
    
    // Update attributes
    const newAttrs = { ...attributes };
    Object.keys(newAttrs).forEach(key => {
      newAttrs[key] = newAssigned[key] || 10;
    });
    setAttributes(newAttrs);
  };

  const handleRoll = (attr, result) => {
    setAttributes({ ...attributes, [attr]: result.total });
    setRollingFor(null);
  };

  const handleNext = () => {
    updateAttributes(attributes);
    nextStep();
  };

  const attributeLabels = {
    strength: 'Força',
    dexterity: 'Destreza',
    constitution: 'Constituição',
    intelligence: 'Inteligência',
    wisdom: 'Sabedoria',
    charisma: 'Carisma'
  };

  const isValueUsed = (value) => {
    return Object.values(assignedValues).includes(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <h2 className="text-4xl font-heading font-bold text-white mb-2">
          Determine seus <span className="text-primary">Atributos</span>
        </h2>
        <p className="text-slate-400">
          Defina os valores de seus atributos usando a matriz padrão ou rolagem de dados.
        </p>
      </div>

      {/* Method Selection */}
      <div className="bg-card/40 border border-white/5 p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
          Método de Atribuição
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <Button
            data-testid="method-standard"
            variant={method === 'standard' ? 'default' : 'secondary'}
            onClick={() => {
              setMethod('standard');
              setAttributes({ strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 });
              setAssignedValues({});
            }}
          >
            Matriz Padrão
          </Button>
          <Button
            data-testid="method-roll"
            variant={method === 'roll' ? 'default' : 'secondary'}
            onClick={() => {
              setMethod('roll');
              setAttributes({ strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 });
              setAssignedValues({});
            }}
          >
            Rolar Dados (4d6)
          </Button>
        </div>
      </div>

      {method === 'standard' && (
        <div className="bg-card/40 border border-white/5 p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
            Matriz Padrão: {standardArray.join(', ')}
          </h3>
          <p className="text-sm text-slate-400 mb-4">
            Clique em um valor e depois em um atributo para atribuir
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {standardArray.map((value, index) => (
              <button
                key={index}
                onClick={() => {
                  const unusedAttr = Object.keys(attributeLabels).find(
                    attr => !assignedValues[attr]
                  );
                  if (unusedAttr && !isValueUsed(value)) {
                    handleStandardArrayAssign(unusedAttr, value);
                  }
                }}
                className={`px-4 py-2 font-mono font-bold text-lg transition-all ${
                  isValueUsed(value)
                    ? 'bg-slate-900/30 border border-slate-800 text-slate-600'
                    : 'bg-slate-900/50 border border-primary/30 text-primary hover:bg-orange-500/20 cursor-pointer'
                }`}
                disabled={isValueUsed(value)}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Attributes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.keys(attributeLabels).map((attr, index) => (
          <motion.div
            key={attr}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            data-testid={`attribute-${attr}`}
            className="bg-card/40 border border-white/5 p-6 hover:border-white/10 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-heading font-bold text-white">
                {attributeLabels[attr]}
              </h3>
              <div className="text-right">
                <p className="text-2xl font-mono font-bold text-primary">
                  {getTotalAttribute(attr)}
                </p>
                {clan && clan.bonuses[attr] > 0 && (
                  <p className="text-xs text-slate-400">
                    ({attributes[attr]} + {clan.bonuses[attr]} bônus)
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {method === 'standard' ? (
                <div className="flex flex-wrap gap-2">
                  {standardArray.map((value, i) => (
                    <button
                      key={i}
                      onClick={() => handleStandardArrayAssign(attr, value)}
                      disabled={isValueUsed(value) && assignedValues[attr] !== value}
                      className={`px-3 py-1 text-sm font-mono font-bold transition-all ${
                        assignedValues[attr] === value
                          ? 'bg-primary text-white'
                          : isValueUsed(value)
                          ? 'bg-slate-900/30 border border-slate-800 text-slate-600 cursor-not-allowed'
                          : 'bg-slate-900/50 border border-slate-800 text-slate-300 hover:border-primary/50 cursor-pointer'
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {rollingFor === attr ? (
                    <DiceRoller
                      diceType="d6"
                      count={4}
                      onRoll={(result) => {
                        const rolls = [...result.rolls].sort((a, b) => b - a);
                        const total = rolls.slice(0, 3).reduce((sum, roll) => sum + roll, 0);
                        handleRoll(attr, { total });
                      }}
                      label="Rolar"
                    />
                  ) : (
                    <Button
                      data-testid={`roll-${attr}`}
                      onClick={() => setRollingFor(attr)}
                      variant="secondary"
                      className="w-full"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Rolar 4d6 (manter 3 maiores)
                    </Button>
                  )}
                </div>
              )}

              <div className="pt-3 border-t border-slate-800 text-sm">
                <p className="text-slate-400">
                  Modificador:{' '}
                  <span className="font-mono font-bold text-white">
                    {calculateModifier(getTotalAttribute(attr)) >= 0 ? '+' : ''}
                    {calculateModifier(getTotalAttribute(attr))}
                  </span>
                </p>
              </div>
            </div>
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
          size="lg"
        >
          Próximo <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default Step3Attributes;
