/**
 * パーマリンク生成・復元ユーティリティ
 */

import pako from 'pako';
import type { AssessmentResult } from './types';

const RESULT_VERSION = '1.0';

/**
 * 文字列をUint8Arrayに変換（ブラウザ互換）
 */
function stringToUint8Array(str: string): Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}

/**
 * Uint8Arrayを文字列に変換（ブラウザ互換）
 */
function uint8ArrayToString(uint8: Uint8Array): string {
  const decoder = new TextDecoder();
  return decoder.decode(uint8);
}

/**
 * Uint8ArrayをBase64に変換（ブラウザ互換）
 */
function uint8ArrayToBase64(uint8: Uint8Array): string {
  let binary = '';
  const len = uint8.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(uint8[i]);
  }
  return btoa(binary);
}

/**
 * Base64をUint8Arrayに変換（ブラウザ互換）
 */
function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const len = binary.length;
  const uint8 = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    uint8[i] = binary.charCodeAt(i);
  }
  return uint8;
}

/**
 * アセスメント結果をgzip圧縮してBase64エンコード
 */
export function encodeAssessmentResult(result: AssessmentResult): string {
  try {
    const json = JSON.stringify(result);
    // gzip圧縮
    const compressed = pako.gzip(stringToUint8Array(json));
    // Base64エンコード（URLセーフ）
    const base64 = uint8ArrayToBase64(compressed);
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
    // 空文字列チェック
    if (!encoded || encoded.trim() === '') {
      return null;
    }

    // URLセーフな形式から標準のBase64に戻す
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');

    // パディングを追加
    while (base64.length % 4 !== 0) {
      base64 += '=';
    }

    // Base64デコード
    const compressed = base64ToUint8Array(base64);
    // gzip解凍
    const decompressed = pako.ungzip(compressed);
    const json = uint8ArrayToString(decompressed);
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
export function createAssessmentResult(
  assessments: AssessmentResult['assessments']
): AssessmentResult {
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
  assessments: AssessmentResult['assessments']
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
    const compressedCategory: AssessmentResult['assessments'][string] = {};
    let hasData = false;

    Object.entries(categoryAssessment).forEach(([skillNumber, skillAssessment]) => {
      if (Object.keys(skillAssessment).length > 0) {
        compressedCategory[parseInt(skillNumber)] = skillAssessment;
        hasData = true;
      }
    });

    if (hasData) {
      compressed.assessments[category] = compressedCategory;
    }
  });

  return compressed;
}
