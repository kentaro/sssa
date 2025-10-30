import { loadSpaceSkillStandard } from '@/lib/data-loader';
import ResultsClient from './ResultsClient';

interface ResultsPageProps {
  params: Promise<{ encoded?: string[] }>;
}

// Static export用: デフォルトページ（パラメータなし）のみ生成
export function generateStaticParams() {
  return [{ encoded: undefined }];
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const resolvedParams = await params;
  const encodedParam = resolvedParams.encoded?.[0];

  const data = loadSpaceSkillStandard();

  return <ResultsClient key={encodedParam ?? 'default'} data={data} />;
}
