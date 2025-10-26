import Dexie, { Table } from 'dexie';

export interface Experience {
  id?: number;
  title: string;
  status: 'undesigned' | 'designed' | 'played' | 'logged';
  createdAt: Date;
  playedAt?: Date;
  loggedAt?: Date;
  design?: {
    imagination: string;
    persona: string;
    sideQuests: string[];
    funIdea?: string;
    designedAt: Date;
  };
  log?: {
    reflection: string;
    emotion: string;
    emotionPolarity: 'positive' | 'negative' | 'neutral';
    followUpAnswer: string;
    loggedAt: Date;
  };
}

export class LightnessDB extends Dexie {
  experiences!: Table<Experience>;

  constructor() {
    super('LightnessAppDB');
    
    this.version(1).stores({
      experiences: [
        '++id',
        'status',
        'createdAt',
        'design.persona',
        'log.feeling'
      ].join(',')
    });
  }
}

export const db = new LightnessDB();