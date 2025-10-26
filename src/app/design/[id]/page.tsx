'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { db } from '@/lib/db';

import Button from '@/components/atoms/Button';
import { StickyNote } from '@/components/molecules/StickyNote';
import { PersonaSelector } from '@/components/molecules/PersonaSelector';
import { SideQuestGenerator } from '@/components/molecules/SideQuestGenerator';

const WizardContainer = styled(motion.div)`
  min-height: 100vh;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.background} 0%, #f8f6f0 100%);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const WizardHeader = styled.div`
  width: 100%;
  max-width: 800px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 3rem;
`;

const BackButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 1rem;
  cursor: pointer;
  padding: 0.75rem 1rem;
  border-radius: 2rem;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(249, 181, 114, 0.1);
    transform: translateX(-2px);
  }
`;

const ProgressIndicator = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const ProgressDot = styled(motion.div)<{ $active: boolean; $completed: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ $active, $completed, theme }) => 
    $completed ? theme.colors.primary : 
    $active ? theme.colors.primary : 
    theme.colors.neutral};
  transition: all 0.3s ease;
`;

const ProgressLine = styled.div<{ $completed: boolean }>`
  width: 2rem;
  height: 2px;
  background: ${({ $completed, theme }) => 
    $completed ? theme.colors.primary : theme.colors.neutral};
  transition: all 0.3s ease;
`;

const StepContainer = styled(motion.div)`
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
`;

const StepTitle = styled(motion.h1)`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin-bottom: 2rem;
  line-height: 1.3;
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 3rem;
  width: 100%;
  max-width: 400px;
`;

const StyledButton = styled(Button)`
  flex: 1;
`;

const steps = [
  {
    id: 'imagination',
    title: '如果这事好玩，会是什么样子？',
    subtitle: '让我们重新想象一下这个任务'
  },
  {
    id: 'persona',
    title: '你今天想以什么人格去体验它？',
    subtitle: '选择一个让你感到有趣的角色'
  },
  {
    id: 'sidequest',
    title: '添加一些小小的冒险',
    subtitle: '让平凡的任务变得不平凡'
  }
];

export default function WizardPage() {
  const params = useParams();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [experience, setExperience] = useState<{ id: string; title: string } | null>(null);
  const [wizardData, setWizardData] = useState({
    experience: '',
    persona: '',
    sideQuests: [] as Array<{ id: string; text: string }>
  });

  useEffect(() => {
    const loadExperience = async () => {
      if (params.id) {
        const exp = await db.experiences.get(Number(params.id));
        if (exp && exp.id) {
          setExperience({ id: exp.id.toString(), title: exp.title });
        }
      }
    };
    loadExperience();
  }, [params.id]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (experience && wizardData.persona) {
      try {
        // 确保使用正确的数字ID进行数据库更新
        const experienceId = Number(experience.id);
        
        // 更新数据库
        await db.experiences.update(experienceId, {
          status: 'designed',
          design: {
            imagination: wizardData.experience,
            persona: wizardData.persona,
            sideQuests: wizardData.sideQuests.map(q => q.text),
            funIdea: wizardData.experience,
            designedAt: new Date()
          }
        });
        
        // 移除手动刷新，依赖DataSubscriber的自动同步
        // DataSubscriber会自动检测数据库变化并更新store
        
        // 增加延迟确保数据同步完成后再导航
        setTimeout(() => {
          router.push(`/play/${experience.id}`);
        }, 500);
      } catch (error) {
        console.error('Failed to complete design:', error);
      }
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return wizardData.experience.trim().length > 0;
      case 1:
        return wizardData.persona !== '';
      case 2:
        return true; // Side quest is optional
      default:
        return false;
    }
  };

  const isLastStep = currentStep === steps.length - 1;

  if (!experience) {
    return (
      <WizardContainer>
        <div>加载中...</div>
      </WizardContainer>
    );
  }

  return (
    <WizardContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <WizardHeader>
        <BackButton
          onClick={() => router.push('/')}
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowLeft size={20} />
          返回游乐场
        </BackButton>

        <ProgressIndicator>
          {steps.map((_, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
              <ProgressDot
                $active={index === currentStep}
                $completed={Boolean(index < currentStep)}
                animate={{
                  scale: index === currentStep ? 1.2 : 1,
                }}
              />
              {index < steps.length - 1 && (
                <ProgressLine $completed={Boolean(index < currentStep)} />
              )}
            </div>
          ))}
        </ProgressIndicator>
      </WizardHeader>

      <StepContainer>
        <StepTitle
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {steps[currentStep].title}
        </StepTitle>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            {currentStep === 0 && (
              <StickyNote 
                value={wizardData.experience}
                onChange={(value) => setWizardData(prev => ({ ...prev, experience: value }))}
                task={experience?.title || ''}
              />
            )}
            
            {currentStep === 1 && (
              <PersonaSelector
                selected={wizardData.persona}
                onSelect={(persona) => setWizardData(prev => ({ ...prev, persona }))}
              />
            )}
            
            {currentStep === 2 && (
              <SideQuestGenerator
                quests={wizardData.sideQuests}
                onQuestsChange={(quests) => setWizardData(prev => ({ ...prev, sideQuests: quests }))}
                taskDescription={experience?.title || ''}
                selectedPersona={wizardData.persona}
              />
            )}
          </motion.div>
        </AnimatePresence>

        <NavigationButtons>
          {currentStep > 0 ? (
            <StyledButton
              variant="secondary"
              onClick={handlePrevious}
            >
              <ArrowLeft size={16} />
              上一步
            </StyledButton>
          ) : (
            <div />
          )}
          
          <StyledButton
            onClick={isLastStep ? handleComplete : handleNext}
            disabled={!canProceed()}
          >
            {isLastStep ? '完成设计' : '下一步'}
            {!isLastStep && <ArrowRight size={16} />}
          </StyledButton>
        </NavigationButtons>
      </StepContainer>
    </WizardContainer>
  );
}