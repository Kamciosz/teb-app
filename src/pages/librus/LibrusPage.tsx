import { useLibrusStore } from '../../store/librusStore';
import { LibrusLogin } from '../../components/librus/LibrusLogin';
import { GradesList } from '../../components/librus/GradesList';

export default function LibrusPage() {
  const { connected } = useLibrusStore();

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {!connected ? (
        <LibrusLogin />
      ) : (
        <GradesList />
      )}
    </div>
  );
}
