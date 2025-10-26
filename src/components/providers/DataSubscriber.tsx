'use client';

import { useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { useExperienceStore } from '@/store/experienceStore';

export default function DataSubscriber() {
  const { setUndesignedTasks, setDesignedTasks, setLoggedTasks } = useExperienceStore();

  const undesigned = useLiveQuery(
    () => db.experiences.where('status').equals('undesigned').sortBy('createdAt'),
    [],
    []
  );

  const designed = useLiveQuery(
    () => db.experiences.where('status').equals('designed').sortBy('createdAt'),
    [],
    []
  );

  const played = useLiveQuery(
    () => db.experiences.where('status').equals('played').sortBy('createdAt'),
    [],
    []
  );

  const logged = useLiveQuery(
    () => db.experiences.where('status').equals('logged').reverse().sortBy('createdAt'),
    [],
    []
  );

  useEffect(() => {
    if (undesigned) setUndesignedTasks(undesigned);
  }, [undesigned, setUndesignedTasks]);

  useEffect(() => {
    // 合并 designed 和 played 状态的任务
    const combinedTasks = [...(designed || []), ...(played || [])];
    // 按创建时间排序
    combinedTasks.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    setDesignedTasks(combinedTasks);
  }, [designed, played, setDesignedTasks]);

  useEffect(() => {
    if (logged) setLoggedTasks(logged);
  }, [logged, setLoggedTasks]);

  return null; // This component does not render anything
}