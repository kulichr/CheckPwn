import { useStore } from '../state/store';
import { translate, type TranslationKey } from './translations';

export function useT() {
  const language = useStore((s) => s.language);
  return (key: TranslationKey, vars?: Record<string, string | number>) => translate(language, key, vars);
}

export function useLanguage() {
  return useStore((s) => s.language);
}
