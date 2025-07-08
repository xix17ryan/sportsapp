
import React, { useState, useEffect, useCallback } from 'react';
import { MOCK_SESSIONS, CLUBS } from './constants';
import { Session, SkillLevel, SessionType, Club } from './types';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import SessionList from './components/SessionList';
import SessionDetailModal from './components/SessionDetailModal';
import CreateSessionModal from './components/CreateSessionModal';

type Filters = {
  location: string;
  date: string;
  time: 'Any' | 'Morning' | 'Afternoon' | 'Evening';
  sessionType: 'Any' | SessionType;
  skillLevel: 'Any' | SkillLevel;
};

const App: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>(MOCK_SESSIONS);
  const [filteredSessions, setFilteredSessions] = useState<Session[]>(sessions);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const [filters, setFilters] = useState<Filters>({
    location: '',
    date: '',
    time: 'Any',
    sessionType: 'Any',
    skillLevel: 'Any',
  });

  const handleFilterChange = useCallback((newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  useEffect(() => {
    let result = sessions;

    if (filters.location) {
      result = result.filter(s => s.location.toLowerCase().includes(filters.location.toLowerCase()));
    }
    if (filters.date) {
      result = result.filter(s => s.date === filters.date);
    }
    if (filters.time !== 'Any') {
      result = result.filter(s => {
        const hour = parseInt(s.time.split(':')[0]);
        if (filters.time === 'Morning') return hour >= 5 && hour < 12;
        if (filters.time === 'Afternoon') return hour >= 12 && hour < 18;
        if (filters.time === 'Evening') return hour >= 18 && hour < 24;
        return true;
      });
    }
    if (filters.sessionType !== 'Any') {
      result = result.filter(s => s.type === filters.sessionType);
    }
    if (filters.skillLevel !== 'Any') {
      result = result.filter(s => s.skillLevel === filters.skillLevel);
    }
    
    // Sort by date and then time
    result.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });

    setFilteredSessions(result);
  }, [filters, sessions]);

  const handleSessionClick = (session: Session) => {
    setSelectedSession(session);
    setIsDetailModalOpen(true);
  };

  const handleCreateSession = (newSessionData: Omit<Session, 'id' | 'club' | 'participants'> & { participants: { max: number } }) => {
    const newSession: Session = {
      ...newSessionData,
      id: sessions.length + 1,
      // For simplicity, assign a default club and participants
      club: CLUBS[Math.floor(Math.random() * CLUBS.length)],
      participants: { current: 1, max: newSessionData.participants.max },
    };
    setSessions(prev => [...prev, newSession]);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      <Header onNewSessionClick={() => setIsCreateModalOpen(true)} />
      
      <main className="container mx-auto p-4 md:p-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 md:p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Find a Session</h2>
            <FilterBar filters={filters} onFilterChange={handleFilterChange} />
        </div>
        
        <SessionList sessions={filteredSessions} onSessionClick={handleSessionClick} />

        {filteredSessions.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold">No Sessions Found</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your filters or check back later!</p>
          </div>
        )}
      </main>

      {isDetailModalOpen && selectedSession && (
        <SessionDetailModal
          session={selectedSession}
          onClose={() => setIsDetailModalOpen(false)}
        />
      )}

      {isCreateModalOpen && (
        <CreateSessionModal
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateSession}
        />
      )}
    </div>
  );
};

export default App;
