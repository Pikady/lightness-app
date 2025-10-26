'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { Button } from '@/components/atoms';
import { ArrowLeft, Play } from 'lucide-react';

const BackButton = styled(Button)`
  padding: 0.5rem;
`;

const CompleteButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
`;

const PlayContainer = styled(motion.div)<{ $isSincere: boolean }>`
  min-height: 100vh;
  background: ${({ theme, $isSincere }) => 
    $isSincere 
      ? `linear-gradient(135deg, ${theme.colors.accentGreen}15, ${theme.colors.accentGreen}25)`
      : theme.colors.background
  };
  transition: background 0.8s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
`;

const Header = styled.div`
  position: absolute;
  top: 2rem;
  left: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const TaskTitle = styled(motion.h1)`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 2.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin-bottom: 3rem;
  line-height: 1.2;
  max-width: 600px;
`;

const SwitchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  margin-bottom: 4rem;
`;

const SwitchLabel = styled.div`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.8;
`;

const Switch = styled(motion.div)<{ $isOn: boolean }>`
  width: 120px;
  height: 60px;
  background: ${({ theme, $isOn }) => 
    $isOn ? theme.colors.accentGreen : theme.colors.neutral
  };
  border-radius: 30px;
  padding: 4px;
  cursor: pointer;
  position: relative;
  transition: background-color 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
`;

const SwitchKnob = styled(motion.div)`
  width: 52px;
  height: 52px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const ModeLabels = styled.div`
  display: flex;
  justify-content: space-between;
  width: 120px;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.7;
`;

const EncouragementText = styled(motion.div)`
  font-family: ${({ theme }) => theme.fonts.handwriting};
  font-size: 1.3rem;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin-top: 2rem;
  opacity: 0.8;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 3rem;
`;

export default function PlayPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);
  const [isSincere, setIsSincere] = useState(false);

  const experience = useLiveQuery(
    () => db.experiences.get(id),
    [id]
  );

  useEffect(() => {
    if (experience) {
      if (experience.status !== 'designed') {
        // 使用 replace 而不是 push 避免导航堆栈问题
        router.replace('/');
      }
    }
  }, [experience, router]);

  const handleSwitchToggle = () => {
    setIsSincere(!isSincere);
  };

  const handleComplete = async () => {
    if (experience) {
      try {
        await db.experiences.update(id, {
          status: 'played',
          playedAt: new Date()
        });
        
        // 使用 setTimeout 确保数据更新完成后再导航
        setTimeout(() => {
          router.push(`/log/${id}`);
        }, 100);
      } catch (error) {
        console.error('Failed to complete play:', error);
      }
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (!experience) {
    return null;
  }

  return (
    <PlayContainer $isSincere={isSincere}>
      <Header>
        <BackButton
          variant="secondary"
          onClick={handleBack}
        >
          <ArrowLeft size={20} />
        </BackButton>
      </Header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center' }}
      >
        <TaskTitle
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {experience.title}
        </TaskTitle>

        <SwitchContainer>
          <SwitchLabel>选择你的心境</SwitchLabel>
          
          <div>
            <Switch
              $isOn={isSincere}
              onClick={handleSwitchToggle}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SwitchKnob
                animate={{
                  x: isSincere ? 60 : 0,
                  scale: isSincere ? [1, 1.1, 1] : 1
                }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  duration: 0.4
                }}
              >
                {isSincere ? '真诚' : '认真'}
              </SwitchKnob>
            </Switch>
            
            <ModeLabels>
              <span>认真</span>
              <span>真诚</span>
            </ModeLabels>
          </div>
        </SwitchContainer>

        <AnimatePresence>
          {isSincere && (
            <EncouragementText
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              深呼吸一下，继续吧。
            </EncouragementText>
          )}
        </AnimatePresence>

        {experience.design && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ marginTop: '2rem' }}
          >
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.8)', 
              padding: '1.5rem', 
              borderRadius: '12px',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              <div style={{ 
                marginBottom: '1rem',
                padding: '0.75rem',
                background: 'rgba(249, 181, 114, 0.2)',
                borderRadius: '8px',
                borderLeft: '3px solid #F9B572'
              }}>
                <div style={{ 
                  fontSize: '0.9rem',
                  color: 'var(--color-text)',
                  opacity: 0.7,
                  marginBottom: '0.5rem'
                }}>
                  📝 当前任务：{experience.title}
                </div>
              </div>
              
              <h3 style={{ 
                fontFamily: 'var(--font-heading)', 
                marginBottom: '1rem',
                color: 'var(--color-text)'
              }}>
                今天的游戏角色：{experience.design.persona}
              </h3>
              
              {experience.design.funIdea && (
                <p style={{ 
                  marginBottom: '1rem',
                  fontStyle: 'italic',
                  color: 'var(--color-text)',
                  opacity: 0.8
                }}>
                  &ldquo;{experience.design.funIdea}&rdquo;
                </p>
              )}
              
              {experience.design.sideQuests && experience.design.sideQuests.length > 0 && (
                <div>
                  <h4 style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>支线任务：</h4>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {experience.design.sideQuests.map((quest, index) => (
                      <li key={index} style={{ 
                        padding: '0.25rem 0',
                        fontSize: '0.9rem',
                        opacity: 0.8
                      }}>
                        • {quest}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}

        <ActionButtons>
           <CompleteButton
             onClick={handleComplete}
           >
             <Play size={18} />
             完成游玩
           </CompleteButton>
         </ActionButtons>
      </motion.div>
    </PlayContainer>
  );
}