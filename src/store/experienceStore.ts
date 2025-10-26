'use client';

import { create } from 'zustand';
import { Experience } from '@/lib/db';

interface ExperienceStore {
  undesignedTasks: Experience[];
  designedTasks: Experience[];
  loggedTasks: Experience[];
  loggedExperiences: Experience[];
  setUndesignedTasks: (tasks: Experience[]) => void;
  setDesignedTasks: (tasks: Experience[]) => void;
  setLoggedTasks: (tasks: Experience[]) => void;
  addTask: (title: string) => Promise<void>;
  refreshTasks: () => Promise<void>;
  refreshLoggedExperiences: () => Promise<void>;
}

export const useExperienceStore = create<ExperienceStore>((set, get) => ({
  undesignedTasks: [],
  designedTasks: [],
  loggedTasks: [],
  loggedExperiences: [],
  setUndesignedTasks: (tasks) => set({ undesignedTasks: tasks }),
  setDesignedTasks: (tasks) => set({ designedTasks: tasks }),
  setLoggedTasks: (tasks) => set({ loggedTasks: tasks }),
  
  addTask: async (title: string) => {
    const { db } = await import('@/lib/db');
    await db.experiences.add({
      title,
      status: 'undesigned',
      createdAt: new Date(),
    });
    // 移除手动调用 refreshTasks，让 DataSubscriber 自动处理
  },
  
  refreshTasks: async () => {
    const { db } = await import('@/lib/db');
    const allTasks = await db.experiences.toArray();
    
    const undesigned = allTasks.filter(task => task.status === 'undesigned');
    const designed = allTasks.filter(task => 
      task.status === 'designed' || task.status === 'played'
    );
    const logged = allTasks.filter(task => task.status === 'logged');
    
    set({
      undesignedTasks: undesigned,
      designedTasks: designed,
      loggedTasks: logged,
    });
  },
  
  refreshLoggedExperiences: async () => {
    const { db } = await import('@/lib/db');
    const loggedExperiences = await db.experiences
      .where('status')
      .equals('logged')
      .reverse()
      .sortBy('createdAt');
    
    set({ loggedExperiences });
  },
}));