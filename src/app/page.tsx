'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Sparkles, BookOpen } from 'lucide-react';
import { Button, Input, Card } from '@/components/atoms';
import { useExperienceStore } from '@/store/experienceStore';
import { useRouter } from 'next/navigation';

const PlaygroundContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.background} 0%, #F8F5F0 100%);
`;

const TopNavigation = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    justify-content: center;
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const PlaybookButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, #F9B572 100%);
  color: white;
  border: none;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0 ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md};
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.text}99;
  margin: 0;
`;

const InputSection = styled.div`
  width: 100%;
  max-width: 600px;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const InputContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: flex-end;
`;

const TasksSection = styled.div`
  width: 100%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

const TaskColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const ColumnHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ColumnTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const ColumnIcon = styled.div<{ $color: string }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 14px;
    height: 14px;
    color: white;
  }
`;

const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const TaskCard = styled(Card)<{ $isDesigned: boolean }>`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ $isDesigned, theme }) => 
    $isDesigned 
      ? `linear-gradient(135deg, ${theme.colors.primary}20 0%, ${theme.colors.white} 100%)`
      : theme.colors.white
  };
  border-left: 4px solid ${({ $isDesigned, theme }) => 
    $isDesigned ? theme.colors.primary : theme.colors.neutral
  };
  cursor: pointer;
`;

const TaskTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
`;

const TaskMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text}80;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text}60;
  font-style: italic;
`;

const Playground: React.FC = () => {
  const router = useRouter();
  const [newTask, setNewTask] = useState('');
  const { undesignedTasks, designedTasks, addTask, refreshTasks } = useExperienceStore();

  React.useEffect(() => {
    refreshTasks();
  }, [refreshTasks]);

  const handleAddTask = async () => {
    if (newTask.trim()) {
      await addTask(newTask.trim());
      setNewTask('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  return (
    <PlaygroundContainer>
      <TopNavigation>
        <PlaybookButton onClick={() => router.push('/playbook')}>
          <BookOpen size={16} />
          我的游玩手册
        </PlaybookButton>
      </TopNavigation>
      
      <MainContent>
        <Header>
          <Title>游乐场</Title>
          <Subtitle>在这里记录那些&ldquo;必须做&rdquo;的事，然后重新设计它们</Subtitle>
        </Header>

        <InputSection>
        <InputContainer>
          <Input
            placeholder="今天有什么&lsquo;必须&rsquo;要做的事？"
            value={newTask}
            onChange={setNewTask}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <Button onClick={handleAddTask} disabled={!newTask.trim()}>
            <Plus size={20} />
          </Button>
        </InputContainer>
      </InputSection>

      <TasksSection>
        <TaskColumn>
          <ColumnHeader>
            <ColumnIcon $color="#9CA3AF">
              <div style={{ width: '8px', height: '8px', backgroundColor: 'white', borderRadius: '50%' }} />
            </ColumnIcon>
            <ColumnTitle>游戏设计图</ColumnTitle>
          </ColumnHeader>
          <TaskList>
            <AnimatePresence>
              {undesignedTasks.length === 0 ? (
                <EmptyState>
                  还没有任务呢，先添加一个试试？
                </EmptyState>
              ) : (
                undesignedTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TaskCard 
                      $isDesigned={false}
                      onClick={() => window.location.href = `/design/${task.id}`}
                    >
                      <TaskTitle>{task.title}</TaskTitle>
                      <TaskMeta>
                        <span>等待设计</span>
                        <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                      </TaskMeta>
                    </TaskCard>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </TaskList>
        </TaskColumn>

        <TaskColumn>
          <ColumnHeader>
            <ColumnIcon $color="#F9B572">
              <Sparkles size={14} />
            </ColumnIcon>
            <ColumnTitle>今日游玩</ColumnTitle>
          </ColumnHeader>
          <TaskList>
            <AnimatePresence>
              {designedTasks.length === 0 ? (
                <EmptyState>
                  设计一些体验，让任务变得有趣起来！
                </EmptyState>
              ) : (
                designedTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TaskCard 
                      $isDesigned={true}
                      onClick={() => {
                        if (task.status === 'designed') {
                          window.location.href = `/play/${task.id}`;
                        } else if (task.status === 'played') {
                          window.location.href = `/log/${task.id}`;
                        }
                      }}
                    >
                      <TaskTitle>{task.title}</TaskTitle>
                      {task.design && (
                        <div style={{ marginBottom: '8px', fontSize: '0.875rem', color: '#F9B572' }}>
                          {task.design.persona} · {task.design.imagination}
                        </div>
                      )}
                      <TaskMeta>
                        <span>
                          {task.status === 'designed' && '准备游玩'}
                          {task.status === 'played' && '等待记录'}
                          {task.status === 'logged' && '已完成'}
                        </span>
                        <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                      </TaskMeta>
                    </TaskCard>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </TaskList>
        </TaskColumn>
      </TasksSection>
      </MainContent>
    </PlaygroundContainer>
  );
};

export default Playground;
