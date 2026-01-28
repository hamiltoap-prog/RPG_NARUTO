import React from 'react';
import { motion } from 'framer-motion';
import useCharacterStore from '@/store/characterStore';
import { Check } from 'lucide-react';

const WizardLayout = ({ children }) => {
  const { currentStep } = useCharacterStore();

  const steps = [
    { number: 1, title: 'Clã' },
    { number: 2, title: 'Classe' },
    { number: 3, title: 'Atributos' },
    { number: 4, title: 'Descrição' },
    { number: 5, title: 'Equipamentos' },
    { number: 6, title: 'Jutsus' },
    { number: 7, title: 'Resumo' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-slate-800 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-heading font-bold text-white">
            Criador de <span className="text-primary">Personagens</span> Naruto RPG
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar - Steps Navigation */}
          <div className="lg:col-span-3">
            <div className="sticky top-24">
              <div className="bg-card/40 backdrop-blur-sm border border-white/5 p-6">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6">
                  Progresso
                </h2>
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <motion.div
                      key={step.number}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div
                        className={`flex items-center justify-center w-10 h-10 font-mono font-bold transition-all ${
                          currentStep === step.number
                            ? 'bg-primary text-white shadow-[0_0_15px_rgba(249,115,22,0.5)]'
                            : currentStep > step.number
                            ? 'bg-accent text-white'
                            : 'bg-slate-900/50 border border-slate-800 text-slate-500'
                        }`}
                      >
                        {currentStep > step.number ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          step.number
                        )}
                      </div>
                      <div>
                        <p
                          className={`text-sm font-medium transition-colors ${
                            currentStep >= step.number
                              ? 'text-white'
                              : 'text-slate-500'
                          }`}
                        >
                          {step.title}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Progress Bar */}
                <div className="mt-8">
                  <div className="flex justify-between text-xs text-slate-400 mb-2">
                    <span>Progresso</span>
                    <span>{Math.round((currentStep / 7) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-slate-900/50 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-accent"
                      initial={{ width: 0 }}
                      animate={{ width: `${(currentStep / 7) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WizardLayout;
