'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { Button } from '@/components/atoms';
import { ArrowLeft } from 'lucide-react';

// Persona ID 到中文名称的映射
const personaNameMap: Record<string, string> = {
  collector: '收集者',
  competitor: '竞争者',
  explorer: '探索者',
  creator: '创造者',
  storyteller: '故事讲述者',
  comedian: '搞笑者',
  leader: '领导者',
  mover: '运动者'
};

// V2.0 主容器 - 移除顶栏割裂感
const PlayContainer = styled.div<{ $isSincere: boolean }>`
  min-height: 100vh;
  background: ${({ $isSincere }) => 
    $isSincere 
      ? '#B4D9D0'
      : '#FDFBF6'
  };
  transition: background 800ms ease-in-out;
  position: relative;
  overflow-x: hidden;
  padding: 2rem 1rem;
  
  /* 背景微动效 - 呼吸感 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ $isSincere }) => 
      $isSincere 
        ? 'radial-gradient(circle at 50% 50%, rgba(180, 217, 208, 0.3) 0%, transparent 70%)'
        : 'radial-gradient(circle at 50% 50%, rgba(253, 251, 246, 0.3) 0%, transparent 70%)'
    };
    animation: backgroundBreathe 12s ease-in-out infinite;
    pointer-events: none;
    z-index: 0;
  }
  
  /* 在真诚模式下增强呼吸效果 */
  ${({ $isSincere }) => $isSincere && `
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
      animation: backgroundBreathe 15s ease-in-out infinite reverse;
      pointer-events: none;
      z-index: 0;
    }
  `}
  
  /* 确保内容在背景动效之上 */
  > * {
    position: relative;
    z-index: 1;
  }
  
  @keyframes backgroundBreathe {
    0%, 100% {
      opacity: 0.5;
      transform: scale(1);
    }
    50% {
      opacity: 0.8;
      transform: scale(1.02);
    }
  }
`;

// 漂浮的返回按钮 - 胶囊形态
const FloatingBackButton = styled(motion.button)`
  position: absolute;
  top: 2rem;
  left: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: none;
  border-radius: 50px; /* 胶囊形态 */
  color: #4A443F;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

// 页面主标题区域
const PageHeader = styled(motion.div)`
  text-align: center;
  margin: 4rem 0 3rem 0;
`;

const MainTitle = styled.h1`
  font-family: 'Nunito', sans-serif;
  font-weight: bold;
  font-size: 2rem;
  color: #4A443F;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: rgba(74, 68, 63, 0.6);
  margin: 0;
`;

// V2.0 主控制卡 - 合并心境选择和游戏角色
const MainControlCard = styled(motion.div)`
  max-width: 500px;
  margin: 0 auto 3rem auto;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

// 模块一：心境选择区域
const MoodSection = styled.div`
  margin-bottom: 2.5rem;
`;

const MoodSectionTitle = styled.h3`
  font-family: 'Nunito', sans-serif;
  font-weight: 600;
  font-size: 1.1rem;
  color: #4A443F;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const MoodSwitchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

// V2.0 开关设计 - 抽象图标
const MoodSwitch = styled(motion.div)<{ $isOn: boolean }>`
  width: 120px;
  height: 60px;
  background: ${({ $isOn }) => 
    $isOn 
      ? 'linear-gradient(135deg, #B4D9D0, #A8D5CC)'
      : 'linear-gradient(135deg, #F5F3F0, #E8E6E3)'
  };
  border-radius: 30px;
  position: relative;
  cursor: pointer;
  transition: all 0.4s ease;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const MoodSwitchKnob = styled(motion.div)`
  width: 52px;
  height: 52px;
  background: white;
  border-radius: 26px;
  position: absolute;
  top: 4px;
  left: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 1.2rem;
`;

// 抽象图标组件
const FocusIcon = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid #4A443F;
  border-radius: 50%;
  border-top-color: transparent;
  opacity: 0.7;
`;

const SincereIcon = styled.div`
  width: 20px;
  height: 20px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    width: 16px;
    height: 2px;
    background: #4A443F;
    border-radius: 1px;
    top: 6px;
    left: 2px;
    transform: rotate(-15deg);
    opacity: 0.7;
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 12px;
    height: 2px;
    background: #4A443F;
    border-radius: 1px;
    top: 12px;
    left: 4px;
    transform: rotate(15deg);
    opacity: 0.7;
  }
`;

const MoodLabels = styled.div`
  display: flex;
  justify-content: space-between;
  width: 120px;
`;

const MoodLabel = styled.span<{ $active: boolean }>`
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: ${({ $active }) => $active ? '#4A443F' : 'rgba(74, 68, 63, 0.4)'};
  font-weight: ${({ $active }) => $active ? '600' : '400'};
  transition: all 0.3s ease;
`;

// 鼓励文案 - 优雅融入
const EncouragementText = styled(motion.p)`
  font-family: 'Caveat', cursive;
  font-size: 1rem;
  color: rgba(74, 68, 63, 0.7);
  text-align: center;
  margin: 1rem 0 0 0;
  font-style: italic;
`;

// 分割线
const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(74, 68, 63, 0.1), transparent);
  margin: 2rem 0;
`;

// 模块二：游戏角色详情 - 左对齐布局
const GameRoleSection = styled.div`
  text-align: left;
`;

const RoleLabel = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  color: rgba(74, 68, 63, 0.5);
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const RoleName = styled.h2`
  font-family: 'Nunito', sans-serif;
  font-weight: bold;
  font-size: 1.8rem;
  color: #F9B572;
  margin: 0 0 1rem 0;
  line-height: 1.2;
`;

const RoleQuote = styled.p`
  font-family: 'Caveat', cursive;
  font-size: 1.3rem;
  color: #4A443F;
  opacity: 0.8;
  margin: 0 0 1.5rem 0;
  font-style: italic;
  line-height: 1.3;
`;

const SideQuestsLabel = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  color: rgba(74, 68, 63, 0.5);
  margin: 0 0 0.75rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const SideQuestsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SideQuestItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.5rem 0;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: rgba(74, 68, 63, 0.7);
  line-height: 1.4;
  
  &::before {
    content: '';
    width: 6px;
    height: 6px;
    background: #F9B572;
    border-radius: 50%;
    margin-top: 0.5rem;
    flex-shrink: 0;
  }
`;

// 底部完成按钮
const CompleteButton = styled(motion.button)<{ $isSincere?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  padding: 1rem 2rem;
  background: ${({ $isSincere }) => 
    $isSincere 
      ? 'linear-gradient(135deg, #6BCF7F, #4D96FF)'
      : '#F9B572'
  };
  color: white;
  border: none;
  border-radius: 50px;
  font-family: 'Nunito', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  /* 真诚模式下的特殊效果 */
  ${({ $isSincere }) => $isSincere && `
    box-shadow: 0 4px 20px rgba(107, 207, 127, 0.3);
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      animation: shimmer 3s ease-in-out infinite;
    }
    
    @keyframes shimmer {
      0% { left: -100%; }
      50% { left: 100%; }
      100% { left: 100%; }
    }
  `}
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ $isSincere }) => 
      $isSincere 
        ? '0 8px 30px rgba(107, 207, 127, 0.4)'
        : '0 8px 25px rgba(249, 181, 114, 0.4)'
    };
  }
  
  &:active {
    transform: translateY(0);
  }
`;



export default function PlayPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);
  const [isSincere, setIsSincere] = useState(false);
  const [showEncouragement, setShowEncouragement] = useState(false);

  const experience = useLiveQuery(
    () => db.experiences.get(id),
    [id]
  );

  useEffect(() => {
    if (experience) {
      if (experience.status !== 'designed') {
        router.replace('/');
      }
    }
  }, [experience, router]);

  const handleSwitchToggle = () => {
    const newSincereState = !isSincere;
    setIsSincere(newSincereState);
    
    // 如果切换到真诚模式，显示鼓励文案
    if (newSincereState) {
      setShowEncouragement(true);
      
      // 触感反馈（如果支持）
      if (navigator.vibrate) {
        navigator.vibrate(50); // 轻微振动50ms
      }
      
      // 3秒后隐藏文案
      setTimeout(() => {
        setShowEncouragement(false);
      }, 3500);
    } else {
      setShowEncouragement(false);
    }
  };

  const handleComplete = async () => {
    if (experience) {
      try {
        await db.experiences.update(id, {
          status: 'played',
          playedAt: new Date()
        });
        
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
    return (
      <PlayContainer $isSincere={false}>
        <motion.div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            fontSize: '1.2rem',
            color: '#4A443F'
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          ⏳ 加载中...
        </motion.div>
      </PlayContainer>
    )
  }

  return (
    <PlayContainer $isSincere={isSincere}>
      {/* 漂浮的返回按钮 */}
      <FloatingBackButton
        onClick={handleBack}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft size={18} />
        返回
      </FloatingBackButton>

      {/* 页面主标题 */}
      <PageHeader
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <MainTitle>{experience.title}</MainTitle>
        <Subtitle>专注于行动本身</Subtitle>
      </PageHeader>

      {/* V2.0 主控制卡 */}
      <MainControlCard
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        {/* 模块一：心境选择 */}
        <MoodSection>
          <MoodSectionTitle>选择你的心境</MoodSectionTitle>
          <MoodSwitchContainer>
            <MoodSwitch
              $isOn={isSincere}
              onClick={handleSwitchToggle}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <MoodSwitchKnob
                animate={{ x: isSincere ? 64 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                {isSincere ? <SincereIcon /> : <FocusIcon />}
              </MoodSwitchKnob>
            </MoodSwitch>
            <MoodLabels>
              <MoodLabel $active={!isSincere}>认真</MoodLabel>
              <MoodLabel $active={isSincere}>真诚</MoodLabel>
            </MoodLabels>
          </MoodSwitchContainer>
          
          {/* 鼓励文案 - 优雅融入 */}
          <AnimatePresence>
            {showEncouragement && (
              <EncouragementText
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                深呼吸一下，继续吧。
              </EncouragementText>
            )}
          </AnimatePresence>
        </MoodSection>

        {/* 分割线 */}
        <Divider />

        {/* 模块二：游戏角色详情 */}
        {experience.design && (
          <GameRoleSection>
            <RoleLabel>今天的游戏角色</RoleLabel>
            <RoleName>{personaNameMap[experience.design.persona] || experience.design.persona}</RoleName>
            
            {experience.design.funIdea && (
              <RoleQuote>"{experience.design.funIdea}"</RoleQuote>
            )}
            
            {experience.design.sideQuests && experience.design.sideQuests.length > 0 && (
              <>
                <SideQuestsLabel>支线任务</SideQuestsLabel>
                <SideQuestsList>
                  {experience.design.sideQuests.map((quest, index) => (
                    <SideQuestItem key={index}>
                      {quest}
                    </SideQuestItem>
                  ))}
                </SideQuestsList>
              </>
            )}
          </GameRoleSection>
        )}
      </MainControlCard>

      {/* 底部完成按钮 */}
      <motion.div
        style={{ display: 'flex', justifyContent: 'center', paddingBottom: '2rem' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <CompleteButton 
          onClick={handleComplete}
          $isSincere={isSincere}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          完成游玩
        </CompleteButton>
      </motion.div>
    </PlayContainer>
  );
}