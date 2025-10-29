/**
 * パーマリンク生成・復元ユーティリティ
 */

import type { AssessmentResult } from './types';

const RESULT_VERSION = '1.0';

/**
 * アセスメント結果をBase64エンコードされた文字列に変換
 */
export function encodeAssessmentResult(result: AssessmentResult): string {
  try {
    const json = JSON.stringify(result);
    // Base64エンコード（URLセーフ）
    const base64 = Buffer.from(json, 'utf8').toString('base64');
    // URLセーフな形式に変換
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  } catch (error) {
    console.error('Failed to encode assessment result:', error);
    throw new Error('エンコードに失敗しました');
  }
}

/**
 * Base64エンコードされた文字列からアセスメント結果を復元
 */
export function decodeAssessmentResult(encoded: string): AssessmentResult | null {
  try {
    // URLセーフな形式から標準のBase64に戻す
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');

    // パディングを追加
    while (base64.length % 4 !== 0) {
      base64 += '=';
    }

    const json = Buffer.from(base64, 'base64').toString('utf8');
    const result = JSON.parse(json) as AssessmentResult;

    // バージョンチェック
    if (!result.version) {
      console.warn('Version information missing in assessment result');
    }

    return result;
  } catch (error) {
    console.error('Failed to decode assessment result:', error);
    return null;
  }
}

/**
 * 現在のアセスメントデータからAssessmentResultを作成
 */
export function createAssessmentResult(assessments: {
  [category: string]: any;
}): AssessmentResult {
  return {
    version: RESULT_VERSION,
    timestamp: new Date().toISOString(),
    assessments,
  };
}

/**
 * パーマリンクURLを生成
 * GitHub Pages対応: ハッシュフラグメントを使用
 */
export function generatePermalinkUrl(
  baseUrl: string,
  assessments: { [category: string]: any }
): string {
  const result = createAssessmentResult(assessments);
  const encoded = encodeAssessmentResult(result);
  // GitHub Pagesでも動作するようハッシュフラグメントを使用
  return `${baseUrl}/results#${encoded}`;
}

/**
 * アセスメント結果のサイズを取得（KB単位）
 */
export function getResultSize(result: AssessmentResult): number {
  const json = JSON.stringify(result);
  return Math.round((json.length / 1024) * 100) / 100;
}

/**
 * アセスメント結果を圧縮（空の評価を削除）
 */
export function compressAssessmentResult(result: AssessmentResult): AssessmentResult {
  const compressed: AssessmentResult = {
    version: result.version,
    timestamp: result.timestamp,
    assessments: {},
  };

  Object.entries(result.assessments).forEach(([category, categoryAssessment]) => {
    const compressedCategory: any = {};
    let hasData = false;

    Object.entries(categoryAssessment).forEach(([skillNumber, skillAssessment]) => {
      if (Object.keys(skillAssessment).length > 0) {
        compressedCategory[skillNumber] = skillAssessment;
        hasData = true;
      }
    });

    if (hasData) {
      compressed.assessments[category] = compressedCategory;
    }
  });

  return compressed;
}
