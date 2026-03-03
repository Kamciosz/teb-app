import { useEffect } from 'react';
import { useGamificationStore } from '../../store/gamificationStore';
import { RankingList } from '../../components/gamification/RankingList';
import { Card } from '../../components/ui/Card';
import { Star } from 'lucide-react';

export default function GamificationPage() {
  const { ranking, currentUser, fetchRanking, fetchCurrentUser } = useGamificationStore();

  useEffect(() => {
    fetchRanking();
    fetchCurrentUser();
  }, [fetchRanking, fetchCurrentUser]);

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6">
      {currentUser && (
        <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
              {currentUser.avatar_url ? (
                <img src={currentUser.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                currentUser.full_name?.charAt(0)
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold">{currentUser.full_name}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <Star className="text-yellow-400 fill-current" size={20} />
                <span className="text-2xl font-bold">{currentUser.points}</span>
                <span className="text-sm opacity-90">TebGąbek</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      <RankingList users={ranking} />
    </div>
  );
}
