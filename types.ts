
export enum SkillLevel {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
  All = 'All Levels',
}

export enum SessionType {
  Social = 'Social',
  Training = 'Training',
  Competition = 'Competition',
  RoundRobin = 'Round Robin',
}

export interface Club {
  id: number;
  name: string;
  logo: string;
}

export interface Session {
  id: number;
  name: string;
  club: Club;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  duration: number; // in minutes
  location: string;
  description: string;
  participants: {
    current: number;
    max: number;
  };
  price: number; // in USD
  type: SessionType;
  skillLevel: SkillLevel;
  host: string;
  privacy: 'Public' | 'Private';
}
