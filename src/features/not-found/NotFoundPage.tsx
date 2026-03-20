import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui';

export function loader() {
  return new Response(null, { status: 404 });
}

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div>
      <div className={cn('flex h-screen flex-col items-center justify-center gap-6 text-center')}>
        <h1 className="text-4xl font-bold">404 - ページが見つかりません</h1>
        <p className="text-lg text-muted-foreground">お探しのページは存在しないか、移動した可能性があります。</p>
        <Button variant="primary" size="lg" type="button" onClick={() => navigate('/')}>
          <span>ホームに戻る</span>
        </Button>
      </div>
    </div>
  );
}
