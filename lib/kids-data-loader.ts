/**
 * キッズモード用データのロードとユーティリティ
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

import type { KidsSpaceContent } from './types';

let cachedKidsContent: KidsSpaceContent | null = null;

const KIDS_DATA_FILENAME = 'space_skill_standard_kids.yaml';

export function loadKidsSpaceContent(): KidsSpaceContent {
  if (cachedKidsContent) {
    return cachedKidsContent;
  }

  const dataPath = path.join(process.cwd(), 'data', KIDS_DATA_FILENAME);
  const fileContents = fs.readFileSync(dataPath, 'utf8');
  const content = yaml.load(fileContents) as KidsSpaceContent;

  cachedKidsContent = content;
  return content;
}
