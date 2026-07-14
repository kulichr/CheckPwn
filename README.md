# CheckPwn

Lokální aplikace pro penetrační testery — interaktivní checklist podle OWASP Web Security Testing Guide (WSTG v4.2), s návody, vlastními poznámkami/skripty a odkazy na materiály (YouTube, X…).

## Spuštění

```
npm install
npm run dev
```

Otevře se web na `http://localhost:5173` (frontend, Vite) a lokální API server na `http://localhost:4174` (Express), který ukládá checklisty jako JSON soubory do složky `data/`. Oba servery se spouští společně příkazem `npm run dev`.

## Funkce

- Checklist podle všech kapitol WSTG (Information Gathering, Authentication, Session Management, Input Validation, API Testing…) s krátkým popisem a doporučenými nástroji/příkazy pro každou metodu.
- U každého testu lze nastavit stav (netestováno / probíhá / OK / zranitelné / N/A), přidat vlastní poznámky, vlastní CLI příkazy a odkazy na externí materiály (YouTube náhledy, X posty, dokumentace).
- Progress bar nahoře ukazuje celkový postup, sidebar ukazuje postup po kapitolách.
- Více pojmenovaných pentestů — lze mezi nimi přepínat, každý má vlastní stav uložený zvlášť.
- Automatické ukládání do souboru (s debounce), export/import celého checklistu jako JSON.
- Světlý i tmavý režim, responsivní layout.

## Data

Checklisty se ukládají do `data/<id>.json` — tato složka je v `.gitignore`, protože může obsahovat citlivé informace o probíhajícím pentestu.
