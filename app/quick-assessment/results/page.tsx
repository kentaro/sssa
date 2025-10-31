import { loadSpaceSkillStandard } from '@/lib/data-loader';
import { loadKidsSpaceContent } from '@/lib/kids-data-loader';
import ResultsClient from './ResultsClient';

export default function QuickAssessmentResultsPage() {
  const data = loadSpaceSkillStandard();
  const kidsContent = loadKidsSpaceContent();

  return <ResultsClient roles={data.roles} kidsContent={kidsContent} />;
}
