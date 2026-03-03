import { useLibrusStore } from '../../store/librusStore';
import { Card } from '../ui/Card';

export const GradesList = () => {
  const { grades } = useLibrusStore();

  const getGradeColor = (grade: number | string) => {
    const numGrade = typeof grade === 'string' ? parseFloat(grade) : grade;
    if (numGrade >= 5) return 'text-green-600 bg-green-50';
    if (numGrade >= 4) return 'text-blue-600 bg-blue-50';
    if (numGrade >= 3) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-lg mb-4">Ostatnie Oceny</h3>
      {grades.map((grade, index) => (
        <Card key={index} padding="sm" className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">{grade.subject}</p>
            <p className="text-xs text-gray-500">{grade.date}</p>
          </div>
          <div className={`text-xl font-bold px-3 py-1 rounded-lg ${getGradeColor(grade.grade)}`}>
            {grade.grade}
          </div>
        </Card>
      ))}
    </div>
  );
};
