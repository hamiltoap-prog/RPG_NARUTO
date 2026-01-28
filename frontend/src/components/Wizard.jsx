import React from 'react';
import useCharacterStore from '@/store/characterStore';
import WizardLayout from './WizardLayout';
import Step1Clan from './wizard/Step1Clan';
import Step2Class from './wizard/Step2Class';
import Step3Attributes from './wizard/Step3Attributes';
import Step4Description from './wizard/Step4Description';
import Step5Equipment from './wizard/Step5Equipment';
import Step6Jutsus from './wizard/Step6Jutsus';
import Step7Summary from './wizard/Step7Summary';

const Wizard = () => {
  const { currentStep } = useCharacterStore();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Clan />;
      case 2:
        return <Step2Class />;
      case 3:
        return <Step3Attributes />;
      case 4:
        return <Step4Description />;
      case 5:
        return <Step5Equipment />;
      case 6:
        return <Step6Jutsus />;
      case 7:
        return <Step7Summary />;
      default:
        return <Step1Clan />;
    }
  };

  return (
    <WizardLayout>
      {renderStep()}
    </WizardLayout>
  );
};

export default Wizard;
