"use client";

import type { Question } from "../types/questions";

const QUESTIONS_PER_PAGE = 5;

export function buildPageGroups(questions: Question[], perPage = QUESTIONS_PER_PAGE): Question[][] {
  const before: Question[] = [];
  const precomList: Question[] = [];
  const after: Question[] = [];
  let seenPrecom = false;

  for (const q of questions) {
    if (q.id.startsWith("precom_docs") || q.id.startsWith("packaging")) {
      seenPrecom = true;
      precomList.push(q);
    } else if (seenPrecom) {
      after.push(q);
    } else {
      before.push(q);
    }
  }

  if (precomList.length === 0) {
    const groups: Question[][] = [];
    let b: Question[] = [];
    for (const q of questions) {
      b.push(q);
      if (b.length >= perPage) { groups.push(b); b = []; }
    }
    if (b.length > 0) groups.push(b);
    return groups;
  }

  const groups: Question[][] = [];
  let b: Question[] = [];
  for (const q of before) {
    b.push(q);
    if (b.length >= perPage) { groups.push(b); b = []; }
  }
  const slotsLeft = b.length > 0 ? perPage - b.length : 0;
  const beforeBatch = [...b];
  b = [];

  for (const q of precomList) groups.push([q]);

  const afterWithBackfill = [...after];
  const backfillItems = afterWithBackfill.splice(0, Math.min(slotsLeft, afterWithBackfill.length));

  if (beforeBatch.length > 0 || backfillItems.length > 0) {
    groups.splice(groups.length - precomList.length, 0, [...beforeBatch, ...backfillItems]);
  }

  for (const q of afterWithBackfill) {
    b.push(q);
    if (b.length >= perPage) { groups.push(b); b = []; }
  }
  if (b.length > 0) groups.push(b);
  return groups;
}