import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dices } from 'lucide-react';
import { Button } from './ui/button';

const DiceRoller = ({ diceType = 'd6', count = 1, onRoll, label = 'Rolar Dados' }) => {
  const [isRolling, setIsRolling] = useState(false);
  const [results, setResults] = useState(null);

  const rollDice = () => {
    setIsRolling(true);
    setResults(null);

    const dieValue = parseInt(diceType.substring(1));
    const rolls = Array.from({ length: count }, () => 
      Math.floor(Math.random() * dieValue) + 1
    );
    const total = rolls.reduce((sum, roll) => sum + roll, 0);

    setTimeout(() => {
      setResults({ rolls, total });
      setIsRolling(false);
      if (onRoll) {
        onRoll({ rolls, total });
      }
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Button
        data-testid="dice-roll-button"
        onClick={rollDice}
        disabled={isRolling}
        variant="secondary"
        size="lg"
        className="group"
      >
        <motion.div
          animate={isRolling ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 1, repeat: isRolling ? Infinity : 0 }}
        >
          <Dices className="mr-2 h-5 w-5" />
        </motion.div>
        {label} {count > 1 ? `${count}${diceType}` : diceType}
      </Button>

      <AnimatePresence>
        {results && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center"
            data-testid="dice-result"
          >
            <div className="flex gap-2 justify-center mb-2">
              {results.rolls.map((roll, index) => (
                <motion.div
                  key={index}
                  initial={{ rotateX: 0, rotateY: 0 }}
                  animate={{ rotateX: 720, rotateY: 720 }}
                  transition={{ duration: 1 }}
                  className="w-12 h-12 flex items-center justify-center bg-slate-900/70 border border-orange-500/30 text-orange-500 font-mono text-xl font-bold shadow-lg shadow-orange-500/20"
                >
                  {roll}
                </motion.div>
              ))}
            </div>
            <p className="text-sm text-slate-400">
              Total: <span className="text-orange-500 font-bold text-lg font-mono">{results.total}</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {isRolling && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-slate-400 animate-pulse"
        >
          Rolando dados...
        </motion.div>
      )}
    </div>
  );
};

export default DiceRoller;
