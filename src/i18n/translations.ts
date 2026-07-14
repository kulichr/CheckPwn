export type Language = 'en' | 'cs';

export const translations = {
  en: {
    'app.loading': 'Loading…',
    'app.selectOrCreate': 'Select or create a pentest in the top right corner.',

    'export.title': 'Export checklist to JSON',
    'import.title': 'Import checklist from JSON',

    'theme.toLight': 'Switch to light mode',
    'theme.toDark': 'Switch to dark mode',

    'save.saving': 'Saving…',
    'save.saved': 'Saved',
    'save.error': 'Save failed',

    'status.notTested': 'Not tested',
    'status.inProgress': 'In progress',
    'status.pass': 'Pass',
    'status.fail': 'Vulnerable',
    'status.na': 'N/A',
    'status.ariaLabel': 'Test status',

    'filter.all': 'All',

    'search.placeholder': 'Search test by ID or name…',
    'search.results': 'Search results',

    'section.tools': 'Recommended tools / commands',
    'section.customCommands': 'Custom commands',
    'section.notes': 'Notes',
    'section.links': 'Links (YouTube, X, docs…)',
    'notes.placeholder': 'Notes, findings, payloads…',

    'command.copy': 'Copy',
    'command.delete': 'Delete',
    'command.removeDefault': 'Remove this default command',
    'tools.restoreHidden': '{n} hidden — restore',

    'customCommand.add': 'Add custom command',
    'customCommand.labelPlaceholder': 'Label (optional)',
    'customCommand.commandPlaceholder': 'e.g. ffuf -w list.txt -u {target}/FUZZ',

    'link.add': 'Add link',
    'link.remove': 'Remove link',
    'link.urlPlaceholder': 'https://youtube.com/... or https://x.com/...',

    'project.rename': 'Rename / edit target',
    'project.namePlaceholder': 'Pentest name',
    'project.targetPlaceholder': 'Target (domain/IP) — optional',
    'project.newNamePlaceholder': 'Pentest name (e.g. Acme Corp - Q3 2026)',
    'project.empty': 'No pentests yet',
    'project.new': 'New pentest',
    'project.none': 'No pentest',
    'project.delete': 'Delete pentest',
    'project.deleteConfirm': 'Delete "{name}"? This cannot be undone.',
    'project.targetHint': 'Used to auto-fill {target} in the default commands below',

    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.add': 'Add',
    'common.create': 'Create',
  },
  cs: {
    'app.loading': 'Načítám…',
    'app.selectOrCreate': 'Vyber nebo vytvoř pentest v pravém horním rohu.',

    'export.title': 'Exportovat checklist do JSON',
    'import.title': 'Importovat checklist z JSON',

    'theme.toLight': 'Přepnout na světlý režim',
    'theme.toDark': 'Přepnout na tmavý režim',

    'save.saving': 'Ukládám…',
    'save.saved': 'Uloženo',
    'save.error': 'Chyba ukládání',

    'status.notTested': 'Netestováno',
    'status.inProgress': 'Probíhá',
    'status.pass': 'OK',
    'status.fail': 'Zranitelné',
    'status.na': 'N/A',
    'status.ariaLabel': 'Stav testu',

    'filter.all': 'Vše',

    'search.placeholder': 'Hledat test podle ID nebo názvu…',
    'search.results': 'Výsledky hledání',

    'section.tools': 'Doporučené nástroje / příkazy',
    'section.customCommands': 'Vlastní příkazy',
    'section.notes': 'Poznámky',
    'section.links': 'Odkazy (YouTube, X, dokumentace…)',
    'notes.placeholder': 'Poznámky, nálezy, payloady…',

    'command.copy': 'Kopírovat',
    'command.delete': 'Smazat',
    'command.removeDefault': 'Odebrat tento výchozí příkaz',
    'tools.restoreHidden': '{n} skryto — obnovit',

    'customCommand.add': 'Přidat vlastní příkaz',
    'customCommand.labelPlaceholder': 'Popisek (nepovinné)',
    'customCommand.commandPlaceholder': 'např. ffuf -w list.txt -u {target}/FUZZ',

    'link.add': 'Přidat odkaz',
    'link.remove': 'Odebrat odkaz',
    'link.urlPlaceholder': 'https://youtube.com/... nebo https://x.com/...',

    'project.rename': 'Přejmenovat / upravit cíl',
    'project.namePlaceholder': 'Název pentestu',
    'project.targetPlaceholder': 'Cíl (doména/IP) — nepovinné',
    'project.newNamePlaceholder': 'Název pentestu (např. Acme Corp - Q3 2026)',
    'project.empty': 'Zatím žádné pentesty',
    'project.new': 'Nový pentest',
    'project.none': 'Žádný pentest',
    'project.delete': 'Smazat pentest',
    'project.deleteConfirm': 'Opravdu smazat "{name}"? Tuto akci nelze vrátit.',
    'project.targetHint': 'Použije se pro automatické doplnění {target} v příkazech níže',

    'common.save': 'Uložit',
    'common.cancel': 'Zrušit',
    'common.add': 'Přidat',
    'common.create': 'Vytvořit',
  },
} as const;

export type TranslationKey = keyof (typeof translations)['en'];

export function translate(language: Language, key: TranslationKey, vars?: Record<string, string | number>): string {
  let text: string = translations[language][key] ?? translations.en[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replaceAll(`{${k}}`, String(v));
    }
  }
  return text;
}
