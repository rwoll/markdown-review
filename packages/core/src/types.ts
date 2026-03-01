export interface BaseElement {
  type: string;
  content: string;
  lineStart: number;
  lineEnd: number;
}

export interface CodeElement extends BaseElement {
  type: 'code';
  lang: string;
}

export interface QuestionElement extends BaseElement {
  type: 'question';
  qtype: 'open' | 'choice' | 'checkbox';
  id: string;
  question: string;
  options?: string[];
}

export type Element = BaseElement | CodeElement | QuestionElement;
