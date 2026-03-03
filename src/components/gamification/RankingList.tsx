import { Card } from '../ui/Card';
import type { UserProfile } from '../../types';
import { Trophy, Medal, Award } from 'lucide-react';

interface RankingListProps {
  users: UserProfile[];
}

export const RankingList = ({ users }: RankingListProps) => {
  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Trophy className="text-yellow-500" />;
      case 1: return <Medal className="text-gray-400" />;
      case 2: return <Award className="text-orange-500" />;
      default: return <span className="font-bold text-gray-500 w-6 text-center">{index + 1}</span>;
    }
  };

  return (
    <Card className="w-full">
      <h3 className="font-bold text-lg mb-4 flex items-center">
        <Trophy className="mr-2 text-purple-600" />
        Ranking TebGąbki
      </h3>
      <div className="space-y-2">
        {users.map((user, index) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 flex justify-center">
                {getRankIcon(index)}
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">
                    {user.full_name?.charAt(0)}
                  </div>
                )}
              </div>
              <span className="font-medium text-gray-900">{user.full_name}</span>
            </div>
            <span className="font-bold text-purple-600">{user.points} pkt</span>
          </div>
        ))}
      </div>
    </Card>
  );
};
