import { loadSpaceSkillStandard } from '@/lib/data-loader';
import ResultsClient from './ResultsClient';

export default function QuickAssessmentResultsPage() {
  const data = loadSpaceSkillStandard();

  return <ResultsClient roles={data.roles} />;
}
