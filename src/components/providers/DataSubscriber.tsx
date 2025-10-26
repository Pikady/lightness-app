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

  const logged = useLiveQuery(
    () => db.experiences.where('status').equals('logged').reverse().sortBy('createdAt'),
    [],
    []
  );

  useEffect(() => {
    if (undesigned) setUndesignedTasks(undesigned);
  }, [undesigned, setUndesignedTasks]);

  useEffect(() => {
    if (designed) setDesignedTasks(designed);
  }, [designed, setDesignedTasks]);

  useEffect(() => {
    if (logged) setLoggedTasks(logged);
  }, [logged, setLoggedTasks]);

  return null; // This component does not render anything
}