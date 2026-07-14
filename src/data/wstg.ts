// OWASP Web Security Testing Guide (WSTG) v4.2 — bilingual reference checklist data.
// Source structure: https://owasp.org/www-project-web-security-testing-guide/

import type { Language } from '../i18n/translations';

export interface LocalizedText {
  en: string;
  cs: string;
}

export interface LocalizedList {
  en: string[];
  cs: string[];
}

export interface WstgTest {
  id: string;
  title: LocalizedText;
  summary: LocalizedText;
  tools: LocalizedList;
  reference: string;
}

export interface WstgCategory {
  id: string;
  code: string;
  title: LocalizedText;
  tests: WstgTest[];
}

export function getTitle(x: { title: LocalizedText }, lang: Language): string {
  return x.title[lang];
}

export function getSummary(x: { summary: LocalizedText }, lang: Language): string {
  return x.summary[lang];
}

export function getTools(x: { tools: LocalizedList }, lang: Language): string[] {
  return x.tools[lang];
}

export const WSTG_CATEGORIES: WstgCategory[] = [
  {
    id: 'INFO',
    code: 'WSTG-INFO',
    title: { en: 'Information Gathering', cs: 'Sběr informací' },
    tests: [
      {
        id: 'INFO-01',
        title: { en: 'Conduct Search Engine Discovery Reconnaissance', cs: 'Průzkum přes vyhledávače' },
        summary: {
          en: 'Use search engines and public archives to find leaked info about the target (indexed paths, cached credentials, error messages, source code, employee data).',
          cs: 'Pomocí vyhledávačů a veřejných archivů najít uniklé informace o cíli (indexované cesty, cachované přihlašovací údaje, chybové hlášky, zdrojový kód, údaje o zaměstnancích).',
        },
        tools: {
          en: [
            'google dorks: site:target.com filetype:pdf | intitle:"index of"',
            'https://www.shodan.io and https://search.marginalia.nu as alternatives',
            'waybackurls target.com | grep -i "admin\\|api\\|backup"',
          ],
          cs: [
            'google dorks: site:target.com filetype:pdf | intitle:"index of"',
            'https://www.shodan.io a https://search.marginalia.nu jako alternativy',
            'waybackurls target.com | grep -i "admin\\|api\\|backup"',
          ],
        },
        reference: 'WSTG-INFO-01',
      },
      {
        id: 'INFO-02',
        title: { en: 'Fingerprint Web Server', cs: 'Fingerprint webového serveru' },
        summary: {
          en: 'Identify web server software, version and configuration to map known vulnerabilities.',
          cs: 'Identifikovat software webového serveru, verzi a konfiguraci pro mapování známých zranitelností.',
        },
        tools: {
          en: [
            'whatweb -a 3 https://target.com',
            'curl -I https://target.com',
            'nmap -sV -p80,443 --script=http-server-header target.com',
          ],
          cs: [
            'whatweb -a 3 https://target.com',
            'curl -I https://target.com',
            'nmap -sV -p80,443 --script=http-server-header target.com',
          ],
        },
        reference: 'WSTG-INFO-02',
      },
      {
        id: 'INFO-03',
        title: { en: 'Review Webserver Metafiles for Information Leakage', cs: 'Kontrola metasouborů webserveru' },
        summary: {
          en: 'Check robots.txt, sitemap.xml, humans.txt, .well-known/ for hidden paths and disclosed structure.',
          cs: 'Zkontrolovat robots.txt, sitemap.xml, humans.txt, .well-known/ kvůli skrytým cestám a odhalené struktuře aplikace.',
        },
        tools: {
          en: [
            'curl https://target.com/robots.txt https://target.com/sitemap.xml',
            'curl https://target.com/.well-known/security.txt',
          ],
          cs: [
            'curl https://target.com/robots.txt https://target.com/sitemap.xml',
            'curl https://target.com/.well-known/security.txt',
          ],
        },
        reference: 'WSTG-INFO-03',
      },
      {
        id: 'INFO-04',
        title: { en: 'Enumerate Applications on Webserver', cs: 'Enumerace aplikací na webserveru' },
        summary: {
          en: 'Discover all applications/vhosts hosted on the same IP or infrastructure (subdomains, virtual hosts, ports).',
          cs: 'Zjistit všechny aplikace/vhosty hostované na stejné IP nebo infrastruktuře (subdomény, virtuální hosty, porty).',
        },
        tools: {
          en: [
            'subfinder -d target.com | httpx -silent',
            'ffuf -w vhosts.txt -H "Host: FUZZ.target.com" -u https://target.com',
            'nmap -p- --min-rate 5000 target.com',
          ],
          cs: [
            'subfinder -d target.com | httpx -silent',
            'ffuf -w vhosts.txt -H "Host: FUZZ.target.com" -u https://target.com',
            'nmap -p- --min-rate 5000 target.com',
          ],
        },
        reference: 'WSTG-INFO-04',
      },
      {
        id: 'INFO-05',
        title: { en: 'Review Webpage Content for Information Leakage', cs: 'Kontrola obsahu stránek kvůli úniku informací' },
        summary: {
          en: 'Inspect HTML/JS comments, metadata, hidden fields and client-side code for secrets, internal paths or debug info.',
          cs: 'Prohlédnout HTML/JS komentáře, metadata, skrytá pole a klientský kód kvůli tajným klíčům, interním cestám nebo ladicím informacím.',
        },
        tools: {
          en: [
            'view-source + grep -i "api_key\\|secret\\|todo\\|password"',
            'trufflehog filesystem ./downloaded_js --json',
            'linkfinder.py -i https://target.com/app.js -o cli',
          ],
          cs: [
            'view-source + grep -i "api_key\\|secret\\|todo\\|password"',
            'trufflehog filesystem ./downloaded_js --json',
            'linkfinder.py -i https://target.com/app.js -o cli',
          ],
        },
        reference: 'WSTG-INFO-05',
      },
      {
        id: 'INFO-06',
        title: { en: 'Identify Application Entry Points', cs: 'Identifikace vstupních bodů aplikace' },
        summary: {
          en: 'Map every place user input enters the app: params, headers, cookies, file uploads, APIs.',
          cs: 'Zmapovat každé místo, kudy do aplikace vstupuje uživatelský vstup: parametry, hlavičky, cookies, nahrávání souborů, API.',
        },
        tools: {
          en: [
            'Burp Suite proxy + Target > Site map',
            'ffuf/katana for crawling: katana -u https://target.com -jc -kf all',
          ],
          cs: [
            'Burp Suite proxy + Target > Site map',
            'ffuf/katana pro procházení: katana -u https://target.com -jc -kf all',
          ],
        },
        reference: 'WSTG-INFO-06',
      },
      {
        id: 'INFO-07',
        title: { en: 'Map Execution Paths Through Application', cs: 'Mapování průchodu aplikací' },
        summary: {
          en: 'Understand application workflows/state machine (multi-step forms, checkout, auth flows) to find logic testing targets.',
          cs: 'Pochopit workflow/stavový automat aplikace (vícekrokové formuláře, checkout, přihlašovací procesy) pro nalezení cílů testování business logiky.',
        },
        tools: {
          en: [
            'Manual walkthrough + Burp Suite proxy history',
            'Create a flow diagram (draw.io) of the business logic',
          ],
          cs: [
            'Ruční procházení + Burp Suite proxy history',
            'Vytvořit diagram toků (draw.io) pro business logiku',
          ],
        },
        reference: 'WSTG-INFO-07',
      },
      {
        id: 'INFO-08',
        title: { en: 'Fingerprint Web Application Framework', cs: 'Fingerprint frameworku aplikace' },
        summary: {
          en: 'Identify frontend/backend framework versions via headers, error pages, cookies, static file paths.',
          cs: 'Identifikovat verze frontend/backend frameworku přes hlavičky, chybové stránky, cookies, cesty ke statickým souborům.',
        },
        tools: {
          en: [
            'whatweb -a 3 https://target.com',
            'wappalyzer (browser extension) or httpx -tech-detect',
          ],
          cs: [
            'whatweb -a 3 https://target.com',
            'wappalyzer (rozšíření prohlížeče) nebo httpx -tech-detect',
          ],
        },
        reference: 'WSTG-INFO-08',
      },
      {
        id: 'INFO-09',
        title: { en: 'Fingerprint Web Application', cs: 'Fingerprint webové aplikace' },
        summary: {
          en: 'Identify the specific CMS/application and version (WordPress, Drupal, custom app) for known-CVE lookup.',
          cs: 'Identifikovat konkrétní CMS/aplikaci a verzi (WordPress, Drupal, vlastní aplikace) pro vyhledání známých CVE.',
        },
        tools: {
          en: ['cmseek.py -u https://target.com', 'wpscan --url https://target.com --enumerate vp,vt,u'],
          cs: ['cmseek.py -u https://target.com', 'wpscan --url https://target.com --enumerate vp,vt,u'],
        },
        reference: 'WSTG-INFO-09',
      },
      {
        id: 'INFO-10',
        title: { en: 'Map Application Architecture', cs: 'Mapování architektury aplikace' },
        summary: {
          en: 'Determine overall architecture: CDN, WAF, load balancer, backend services, microservices boundaries.',
          cs: 'Zjistit celkovou architekturu: CDN, WAF, load balancer, backend služby, hranice mikroslužeb.',
        },
        tools: {
          en: ['wafw00f https://target.com', 'nslookup / dig + https://crt.sh/?q=target.com for infrastructure'],
          cs: ['wafw00f https://target.com', 'nslookup / dig + https://crt.sh/?q=target.com pro infrastrukturu'],
        },
        reference: 'WSTG-INFO-10',
      },
    ],
  },
  {
    id: 'CONF',
    code: 'WSTG-CONF',
    title: { en: 'Configuration and Deployment Management Testing', cs: 'Testování konfigurace a nasazení' },
    tests: [
      {
        id: 'CONF-01',
        title: { en: 'Test Network Infrastructure Configuration', cs: 'Test konfigurace síťové infrastruktury' },
        summary: {
          en: 'Review network-level configuration around the app: open ports, unnecessary services, TLS termination points.',
          cs: 'Zkontrolovat síťovou konfiguraci kolem aplikace: otevřené porty, nepotřebné služby, místa terminace TLS.',
        },
        tools: {
          en: ['nmap -sV -sC -p- target.com', 'testssl.sh target.com'],
          cs: ['nmap -sV -sC -p- target.com', 'testssl.sh target.com'],
        },
        reference: 'WSTG-CONF-01',
      },
      {
        id: 'CONF-02',
        title: { en: 'Test Application Platform Configuration', cs: 'Test konfigurace aplikační platformy' },
        summary: {
          en: 'Check for default install pages, sample apps, verbose error pages, directory listing, misconfigured server settings.',
          cs: 'Zkontrolovat výchozí instalační stránky, ukázkové aplikace, podrobné chybové stránky, výpis adresářů, špatně nastavený server.',
        },
        tools: {
          en: ['nikto -h https://target.com', 'ffuf -w common.txt -u https://target.com/FUZZ -mc all -fc 404'],
          cs: ['nikto -h https://target.com', 'ffuf -w common.txt -u https://target.com/FUZZ -mc all -fc 404'],
        },
        reference: 'WSTG-CONF-02',
      },
      {
        id: 'CONF-03',
        title: { en: 'Test File Extensions Handling for Sensitive Information', cs: 'Test zpracování přípon souborů' },
        summary: {
          en: 'Check whether backup/source/config extensions (.bak, .old, .swp, .env, .git) are served by the webserver.',
          cs: 'Zkontrolovat, zda webserver neservíruje zálohovací/zdrojové/konfigurační přípony (.bak, .old, .swp, .env, .git).',
        },
        tools: {
          en: ['ffuf -w wordlist.txt -u https://target.com/FUZZ.bak', 'curl https://target.com/.env https://target.com/.git/config'],
          cs: ['ffuf -w wordlist.txt -u https://target.com/FUZZ.bak', 'curl https://target.com/.env https://target.com/.git/config'],
        },
        reference: 'WSTG-CONF-03',
      },
      {
        id: 'CONF-04',
        title: { en: 'Review Old Backup and Unreferenced Files for Sensitive Information', cs: 'Kontrola starých záloh a nenavázaných souborů' },
        summary: {
          en: 'Search for forgotten backup/dev/test files left on the server that are not linked from the app.',
          cs: 'Hledat zapomenuté zálohovací/vývojové/testovací soubory ponechané na serveru, na které aplikace neodkazuje.',
        },
        tools: {
          en: ['ffuf -w raft-large-files.txt -u https://target.com/FUZZ', 'gau target.com | grep -iE "\\.(zip|sql|bak|old|tar)"'],
          cs: ['ffuf -w raft-large-files.txt -u https://target.com/FUZZ', 'gau target.com | grep -iE "\\.(zip|sql|bak|old|tar)"'],
        },
        reference: 'WSTG-CONF-04',
      },
      {
        id: 'CONF-05',
        title: { en: 'Enumerate Infrastructure and Application Admin Interfaces', cs: 'Enumerace administrátorských rozhraní' },
        summary: {
          en: 'Find admin panels, management consoles, CI/CD dashboards exposed to the internet.',
          cs: 'Najít administrátorské panely, správcovské konzole, CI/CD dashboardy vystavené do internetu.',
        },
        tools: {
          en: ['ffuf -w admin-panels.txt -u https://target.com/FUZZ', 'shodan search "target.com" http.title:"login"'],
          cs: ['ffuf -w admin-panels.txt -u https://target.com/FUZZ', 'shodan search "target.com" http.title:"login"'],
        },
        reference: 'WSTG-CONF-05',
      },
      {
        id: 'CONF-06',
        title: { en: 'Test HTTP Methods', cs: 'Test HTTP metod' },
        summary: {
          en: 'Check allowed HTTP methods (PUT, DELETE, TRACE, OPTIONS) and whether they are exploitable (WebDAV, XST).',
          cs: 'Zkontrolovat povolené HTTP metody (PUT, DELETE, TRACE, OPTIONS) a jejich zneužitelnost (WebDAV, XST).',
        },
        tools: {
          en: ['curl -X OPTIONS -i https://target.com', 'nmap --script http-methods target.com'],
          cs: ['curl -X OPTIONS -i https://target.com', 'nmap --script http-methods target.com'],
        },
        reference: 'WSTG-CONF-06',
      },
      {
        id: 'CONF-07',
        title: { en: 'Test HTTP Strict Transport Security', cs: 'Test HTTP Strict Transport Security' },
        summary: {
          en: 'Verify HSTS header presence, max-age, includeSubDomains and preload settings.',
          cs: 'Ověřit přítomnost HSTS hlavičky, max-age, includeSubDomains a nastavení preload.',
        },
        tools: {
          en: ['curl -sI https://target.com | grep -i strict-transport-security', 'https://hstspreload.org/?domain=target.com'],
          cs: ['curl -sI https://target.com | grep -i strict-transport-security', 'https://hstspreload.org/?domain=target.com'],
        },
        reference: 'WSTG-CONF-07',
      },
      {
        id: 'CONF-08',
        title: { en: 'Test RIA Cross Domain Policy', cs: 'Test cross-domain politiky RIA' },
        summary: {
          en: 'Review crossdomain.xml / clientaccesspolicy.xml for overly permissive Flash/Silverlight cross-domain rules.',
          cs: 'Zkontrolovat crossdomain.xml / clientaccesspolicy.xml kvůli příliš benevolentním cross-domain pravidlům pro Flash/Silverlight.',
        },
        tools: {
          en: ['curl https://target.com/crossdomain.xml https://target.com/clientaccesspolicy.xml'],
          cs: ['curl https://target.com/crossdomain.xml https://target.com/clientaccesspolicy.xml'],
        },
        reference: 'WSTG-CONF-08',
      },
      {
        id: 'CONF-09',
        title: { en: 'Test File Permission', cs: 'Test oprávnění souborů' },
        summary: {
          en: 'Check for improperly configured file/dir permissions exposing source or config via the webserver (on infra you have access to).',
          cs: 'Zkontrolovat špatně nastavená oprávnění souborů/adresářů, která přes webserver odhalují zdrojový kód nebo konfiguraci (na infrastruktuře, ke které máš přístup).',
        },
        tools: {
          en: ['find / -perm -o+w -type f 2>/dev/null (on server, with consent)', 'ls -la on key configuration files'],
          cs: ['find / -perm -o+w -type f 2>/dev/null (na serveru se souhlasem)', 'ls -la na klíčové konfigurační soubory'],
        },
        reference: 'WSTG-CONF-09',
      },
      {
        id: 'CONF-10',
        title: { en: 'Test for Subdomain Takeover', cs: 'Test na převzetí subdomény' },
        summary: {
          en: 'Find dangling DNS records (CNAME to unclaimed cloud service) that allow subdomain hijack.',
          cs: 'Najít visící DNS záznamy (CNAME na nezaregistrovanou cloudovou službu), které umožňují únos subdomény.',
        },
        tools: {
          en: ['subfinder -d target.com | dnsx -silent | httpx -silent', 'subjack -w subs.txt -t 100 -o results.txt -ssl'],
          cs: ['subfinder -d target.com | dnsx -silent | httpx -silent', 'subjack -w subs.txt -t 100 -o results.txt -ssl'],
        },
        reference: 'WSTG-CONF-10',
      },
      {
        id: 'CONF-11',
        title: { en: 'Test Cloud Storage', cs: 'Test cloudového úložiště' },
        summary: {
          en: 'Check for misconfigured/public cloud storage buckets (S3, GCS, Azure Blob) tied to the target.',
          cs: 'Zkontrolovat špatně nastavené/veřejné cloudové úložiště (S3, GCS, Azure Blob) spojené s cílem.',
        },
        tools: {
          en: ['s3scanner scan --bucket-file buckets.txt', 'grayhatwarfare.com search for open buckets'],
          cs: ['s3scanner scan --bucket-file buckets.txt', 'grayhatwarfare.com hledání otevřených bucketů'],
        },
        reference: 'WSTG-CONF-11',
      },
    ],
  },
  {
    id: 'IDNT',
    code: 'WSTG-IDNT',
    title: { en: 'Identity Management Testing', cs: 'Testování správy identit' },
    tests: [
      {
        id: 'IDNT-01',
        title: { en: 'Test Role Definitions', cs: 'Test definic rolí' },
        summary: {
          en: 'Review defined roles/privilege levels and confirm they map to a documented least-privilege model.',
          cs: 'Zkontrolovat definované role/úrovně oprávnění a ověřit, že odpovídají zdokumentovanému modelu nejmenších oprávnění.',
        },
        tools: {
          en: ['Build a role x function matrix and test every account combination'],
          cs: ['Vytvořit matici rolí x funkcí a testovat každou kombinaci účtů'],
        },
        reference: 'WSTG-IDNT-01',
      },
      {
        id: 'IDNT-02',
        title: { en: 'Test User Registration Process', cs: 'Test procesu registrace uživatele' },
        summary: {
          en: 'Check identity verification, duplicate account prevention and data validation during signup.',
          cs: 'Zkontrolovat ověření identity, prevenci duplicitních účtů a validaci dat při registraci.',
        },
        tools: {
          en: ['Register with forged/duplicate data, Burp Repeater against the signup endpoint'],
          cs: ['Registrace s podvrženými/duplicitními údaji, burp repeater na signup endpoint'],
        },
        reference: 'WSTG-IDNT-02',
      },
      {
        id: 'IDNT-03',
        title: { en: 'Test Account Provisioning Process', cs: 'Test procesu zakládání účtů' },
        summary: {
          en: 'Verify who can provision accounts for others and whether authorization is enforced.',
          cs: 'Ověřit, kdo může zakládat účty pro ostatní a zda je vynucena autorizace.',
        },
        tools: {
          en: ['Test provisioning endpoints with lower privileges'],
          cs: ['Testovat provisioning endpointy s nižšími privilegii'],
        },
        reference: 'WSTG-IDNT-03',
      },
      {
        id: 'IDNT-04',
        title: { en: 'Testing for Account Enumeration and Guessable User Account', cs: 'Test enumerace účtů a uhodnutelných uživatelů' },
        summary: {
          en: 'Check whether login/registration/password-reset responses reveal valid vs invalid usernames.',
          cs: 'Zkontrolovat, zda odpovědi u loginu/registrace/resetu hesla neprozrazují platná vs. neplatná uživatelská jména.',
        },
        tools: {
          en: [
            'ffuf -w users.txt -X POST -d "user=FUZZ&pass=x" -u https://target.com/login -fc 200',
            'Compare timing/response diff between a valid and invalid account',
          ],
          cs: [
            'ffuf -w users.txt -X POST -d "user=FUZZ&pass=x" -u https://target.com/login -fc 200',
            'Porovnat timing/response diff mezi platným a neplatným účtem',
          ],
        },
        reference: 'WSTG-IDNT-04',
      },
      {
        id: 'IDNT-05',
        title: { en: 'Testing for Weak or Unenforced Username Policy', cs: 'Test slabé nebo nevynucené politiky uživatelských jmen' },
        summary: {
          en: 'Check if usernames are predictable (sequential IDs, email-based) and if policy prevents weak/guessable names.',
          cs: 'Zkontrolovat, zda jsou uživatelská jména předvídatelná (sekvenční ID, e-mail) a zda politika zabraňuje slabým/uhodnutelným jménům.',
        },
        tools: {
          en: ['Try sequential/enumerable username formats'],
          cs: ['Zkusit sekvenční/enumerovatelné username formáty'],
        },
        reference: 'WSTG-IDNT-05',
      },
    ],
  },
  {
    id: 'ATHN',
    code: 'WSTG-ATHN',
    title: { en: 'Authentication Testing', cs: 'Testování autentizace' },
    tests: [
      {
        id: 'ATHN-01',
        title: { en: 'Testing for Credentials Transported over an Encrypted Channel', cs: 'Test přenosu přihlašovacích údajů přes šifrovaný kanál' },
        summary: {
          en: 'Verify all authentication traffic is sent over TLS only, no HTTP fallback or mixed content.',
          cs: 'Ověřit, že veškerý autentizační provoz jde pouze přes TLS, bez fallbacku na HTTP nebo smíšeného obsahu.',
        },
        tools: {
          en: ['testssl.sh target.com', 'Burp: check whether the login form ever submits over plain HTTP'],
          cs: ['testssl.sh target.com', 'Burp: sledovat, zda login form neposílá přes HTTP'],
        },
        reference: 'WSTG-ATHN-01',
      },
      {
        id: 'ATHN-02',
        title: { en: 'Testing for Default Credentials', cs: 'Test výchozích přihlašovacích údajů' },
        summary: {
          en: 'Try common default/vendor credentials on login forms and admin panels.',
          cs: 'Vyzkoušet běžné výchozí/výrobcem nastavené přihlašovací údaje na loginech a admin panelech.',
        },
        tools: {
          en: ['seclists Default-Credentials + Burp Intruder', 'hydra -L users.txt -P passwords.txt target.com http-post-form'],
          cs: ['seclists Default-Credentials + Burp Intruder', 'hydra -L users.txt -P passwords.txt target.com http-post-form'],
        },
        reference: 'WSTG-ATHN-02',
      },
      {
        id: 'ATHN-03',
        title: { en: 'Testing for Weak Lock Out Mechanism', cs: 'Test slabého mechanismu zamykání účtu' },
        summary: {
          en: 'Test account lockout / rate limiting behaviour and whether it can be bypassed (IP rotation, race conditions).',
          cs: 'Otestovat chování zamykání účtu / rate limitingu a možnost jeho obejití (rotace IP, race condition).',
        },
        tools: {
          en: [
            'ffuf -w passwords.txt -X POST -d "user=admin&pass=FUZZ" -u https://target.com/login',
            'Test X-Forwarded-For rotation to bypass rate limiting',
          ],
          cs: [
            'ffuf -w passwords.txt -X POST -d "user=admin&pass=FUZZ" -u https://target.com/login',
            'Testovat X-Forwarded-For rotaci pro obejití rate limitu',
          ],
        },
        reference: 'WSTG-ATHN-03',
      },
      {
        id: 'ATHN-04',
        title: { en: 'Testing for Bypassing Authentication Schema', cs: 'Test obejití autentizačního schématu' },
        summary: {
          en: 'Try to access protected resources directly, via parameter tampering, forced browsing or SQLi in login.',
          cs: 'Zkusit přistoupit k chráněným zdrojům přímo, manipulací parametrů, forced browsing nebo SQLi v loginu.',
        },
        tools: {
          en: ['Forced browsing to a protected URL without a session', "SQLi test in the login form: ' OR '1'='1"],
          cs: ['Forced browsing na chráněné URL bez session', "SQLi test v login form: ' OR '1'='1"],
        },
        reference: 'WSTG-ATHN-04',
      },
      {
        id: 'ATHN-05',
        title: { en: 'Testing for Vulnerable Remember Password', cs: 'Test zranitelné funkce zapamatování hesla' },
        summary: {
          en: 'Check how "remember me" tokens are generated, stored and whether they are predictable or persist insecurely.',
          cs: 'Zkontrolovat, jak se generují a ukládají "remember me" tokeny a zda nejsou předvídatelné nebo nebezpečně perzistentní.',
        },
        tools: {
          en: ['Analyze the remember-me cookie (entropy, expiry) in Burp Decoder'],
          cs: ['Analyzovat remember-me cookie (entropie, expirace) v Burp Decoder'],
        },
        reference: 'WSTG-ATHN-05',
      },
      {
        id: 'ATHN-06',
        title: { en: 'Testing for Browser Cache Weaknesses', cs: 'Test slabin v cache prohlížeče' },
        summary: {
          en: 'Verify Cache-Control/Pragma headers prevent sensitive pages from being cached locally after logout.',
          cs: 'Ověřit, že hlavičky Cache-Control/Pragma zabraňují lokálnímu cachování citlivých stránek po odhlášení.',
        },
        tools: {
          en: ['curl -sI https://target.com/account | grep -i cache-control'],
          cs: ['curl -sI https://target.com/account | grep -i cache-control'],
        },
        reference: 'WSTG-ATHN-06',
      },
      {
        id: 'ATHN-07',
        title: { en: 'Testing for Weak Password Policy', cs: 'Test slabé politiky hesel' },
        summary: {
          en: 'Check minimum length/complexity requirements and whether common/breached passwords are rejected.',
          cs: 'Zkontrolovat minimální délku/složitost hesel a zda jsou odmítána běžná/uniklá hesla.',
        },
        tools: {
          en: [
            'Try registering with "123456", "password", an empty password',
            'Check against a HaveIBeenPwned/rockyou.txt list',
          ],
          cs: [
            'Zkusit registraci s "123456", "password", prázdným heslem',
            'Ověřit proti seznamu HaveIBeenPwned/rockyou.txt',
          ],
        },
        reference: 'WSTG-ATHN-07',
      },
      {
        id: 'ATHN-08',
        title: { en: 'Testing for Weak Security Question Answer', cs: 'Test slabé bezpečnostní otázky' },
        summary: {
          en: 'Check whether security questions are guessable, OSINT-derivable, or brute-forceable.',
          cs: 'Zkontrolovat, zda jsou bezpečnostní otázky uhodnutelné, zjistitelné přes OSINT nebo prolomitelné hrubou silou.',
        },
        tools: {
          en: ['OSINT on the target user (LinkedIn, social media)'],
          cs: ['OSINT na cílového uživatele (LinkedIn, sociální sítě)'],
        },
        reference: 'WSTG-ATHN-08',
      },
      {
        id: 'ATHN-09',
        title: { en: 'Testing for Weak Password Change or Reset Functionalities', cs: 'Test slabé funkce změny/resetu hesla' },
        summary: {
          en: 'Test password reset token entropy/expiry, host header injection in reset links, IDOR in reset flow.',
          cs: 'Otestovat entropii/expiraci resetovacího tokenu, host header injection v resetovacích odkazech, IDOR v procesu resetu.',
        },
        tools: {
          en: [
            'Analyze the reset token in Burp (entropy, repeatability)',
            'Host header injection test: Host: attacker.com in the password reset request',
          ],
          cs: [
            'Analyzovat reset token v Burp (entropie, opakovatelnost)',
            'Host header injection test: Host: attacker.com při password reset requestu',
          ],
        },
        reference: 'WSTG-ATHN-09',
      },
      {
        id: 'ATHN-10',
        title: { en: 'Testing for Weaker Authentication in Alternative Channel', cs: 'Test slabší autentizace v alternativním kanálu' },
        summary: {
          en: 'Check if mobile/API/legacy channels enforce weaker auth than the main web app (e.g. no MFA, no lockout).',
          cs: 'Zkontrolovat, zda mobilní/API/legacy kanály nemají slabší autentizaci než hlavní webová aplikace (např. bez MFA, bez zamykání).',
        },
        tools: {
          en: ['Compare the web auth flow vs. mobile API (Burp + proxy on the mobile app)'],
          cs: ['Porovnat auth flow webu vs. mobilní API (Burp + proxy na mobilní app)'],
        },
        reference: 'WSTG-ATHN-10',
      },
    ],
  },
  {
    id: 'ATHZ',
    code: 'WSTG-ATHZ',
    title: { en: 'Authorization Testing', cs: 'Testování autorizace' },
    tests: [
      {
        id: 'ATHZ-01',
        title: { en: 'Testing Directory Traversal File Include', cs: 'Test Directory Traversal a File Include' },
        summary: {
          en: 'Test parameters that reference files/paths for path traversal and local/remote file inclusion.',
          cs: 'Otestovat parametry odkazující na soubory/cesty kvůli path traversal a local/remote file inclusion.',
        },
        tools: {
          en: [
            'ffuf -w traversal.txt -u "https://target.com/file?path=FUZZ"',
            '../../../../etc/passwd, php://filter/convert.base64-encode/resource=',
          ],
          cs: [
            'ffuf -w traversal.txt -u "https://target.com/file?path=FUZZ"',
            '../../../../etc/passwd, php://filter/convert.base64-encode/resource=',
          ],
        },
        reference: 'WSTG-ATHZ-01',
      },
      {
        id: 'ATHZ-02',
        title: { en: 'Testing for Bypassing Authorization Schema', cs: 'Test obejití autorizačního schématu' },
        summary: {
          en: 'Try to access endpoints/actions reserved for higher-privileged roles by manipulating requests.',
          cs: 'Zkusit přistoupit k endpointům/akcím vyhrazeným pro vyšší role manipulací requestů.',
        },
        tools: {
          en: [
            'Burp: replay a request with lower privileges, change role/params',
            'autorize (Burp extension) for automated detection',
          ],
          cs: [
            'Burp: opakovat request s nižšími právy, měnit role/params',
            'autorize (Burp extension) pro automatizovanou detekci',
          ],
        },
        reference: 'WSTG-ATHZ-02',
      },
      {
        id: 'ATHZ-03',
        title: { en: 'Testing for Privilege Escalation', cs: 'Test eskalace oprávnění' },
        summary: {
          en: 'Check for vertical (user→admin) and horizontal (user A→user B) privilege escalation paths.',
          cs: 'Zkontrolovat vertikální (user→admin) a horizontální (uživatel A→uživatel B) cesty k eskalaci oprávnění.',
        },
        tools: {
          en: ['Test changing role/ID parameters in requests between two test accounts'],
          cs: ['Testovat změnu role/ID parametru v requestech mezi dvěma test účty'],
        },
        reference: 'WSTG-ATHZ-03',
      },
      {
        id: 'ATHZ-04',
        title: { en: 'Testing for Insecure Direct Object References', cs: 'Test nezabezpečených přímých odkazů na objekty (IDOR)' },
        summary: {
          en: 'Test if object identifiers (IDs, filenames, keys) can be manipulated to access unauthorized data (IDOR/BOLA).',
          cs: 'Otestovat, zda lze manipulací identifikátorů objektů (ID, jména souborů, klíče) získat přístup k neautorizovaným datům (IDOR/BOLA).',
        },
        tools: {
          en: [
            'Sequentially change IDs in the URL/JSON body and compare responses between accounts',
            'ffuf -w ids.txt -u "https://target.com/api/orders/FUZZ" -H "Cookie: session=..."',
          ],
          cs: [
            'Sekvenčně měnit ID v URL/JSON body a sledovat odpovědi mezi účty',
            'ffuf -w ids.txt -u "https://target.com/api/orders/FUZZ" -H "Cookie: session=..."',
          ],
        },
        reference: 'WSTG-ATHZ-04',
      },
    ],
  },
  {
    id: 'SESS',
    code: 'WSTG-SESS',
    title: { en: 'Session Management Testing', cs: 'Testování správy relací' },
    tests: [
      {
        id: 'SESS-01',
        title: { en: 'Testing for Session Management Schema', cs: 'Test schématu správy relací' },
        summary: {
          en: 'Analyze session token generation, structure and randomness (entropy, predictability).',
          cs: 'Analyzovat generování, strukturu a náhodnost session tokenu (entropie, předvídatelnost).',
        },
        tools: {
          en: ['Burp Sequencer on the session token', 'jwt_tool token.jwt (if JWT)'],
          cs: ['Burp Sequencer na session token', 'jwt_tool token.jwt (pokud JWT)'],
        },
        reference: 'WSTG-SESS-01',
      },
      {
        id: 'SESS-02',
        title: { en: 'Testing for Cookies Attributes', cs: 'Test atributů cookies' },
        summary: {
          en: 'Verify Secure, HttpOnly, SameSite attributes on session/sensitive cookies.',
          cs: 'Ověřit atributy Secure, HttpOnly, SameSite u session/citlivých cookies.',
        },
        tools: {
          en: ['curl -sI https://target.com | grep -i set-cookie', 'DevTools > Application > Cookies'],
          cs: ['curl -sI https://target.com | grep -i set-cookie', 'DevTools > Application > Cookies'],
        },
        reference: 'WSTG-SESS-02',
      },
      {
        id: 'SESS-03',
        title: { en: 'Testing for Session Fixation', cs: 'Test session fixation' },
        summary: {
          en: 'Check whether session ID stays the same before/after login (allows attacker-supplied session hijack).',
          cs: 'Zkontrolovat, zda se session ID nemění před/po přihlášení (umožňuje únos session útočníkem podvrženým ID).',
        },
        tools: {
          en: ['Record the session cookie before and after login, compare values'],
          cs: ['Zaznamenat session cookie před a po přihlášení, porovnat hodnoty'],
        },
        reference: 'WSTG-SESS-03',
      },
      {
        id: 'SESS-04',
        title: { en: 'Testing for Exposed Session Variables', cs: 'Test exponovaných proměnných relace' },
        summary: {
          en: 'Check if session tokens leak via URL, Referer header, logs, browser history or GET params.',
          cs: 'Zkontrolovat, zda session tokeny neunikají přes URL, Referer hlavičku, logy, historii prohlížeče nebo GET parametry.',
        },
        tools: {
          en: ['Monitor the Referer header on outgoing requests from an authenticated page'],
          cs: ['Sledovat Referer header při odchozích requestech z autentizované stránky'],
        },
        reference: 'WSTG-SESS-04',
      },
      {
        id: 'SESS-05',
        title: { en: 'Testing for Cross Site Request Forgery', cs: 'Test Cross Site Request Forgery (CSRF)' },
        summary: {
          en: 'Check state-changing requests for CSRF tokens and their validation (presence, binding to session, SameSite).',
          cs: 'Zkontrolovat, zda mají stav měnící requesty CSRF token a jak je validován (přítomnost, vazba na session, SameSite).',
        },
        tools: {
          en: [
            'Remove/change the CSRF token in Burp Repeater and resend the request',
            'Build a PoC HTML form with auto-submit',
          ],
          cs: [
            'Odstranit/změnit CSRF token v Burp Repeateru a zopakovat request',
            'Vytvořit PoC HTML formulář s auto-submitem',
          ],
        },
        reference: 'WSTG-SESS-05',
      },
      {
        id: 'SESS-06',
        title: { en: 'Testing for Logout Functionality', cs: 'Test funkce odhlášení' },
        summary: {
          en: 'Verify logout properly invalidates session server-side (not just client cookie deletion).',
          cs: 'Ověřit, že odhlášení skutečně invaliduje session na serveru (nejen smaže cookie na klientovi).',
        },
        tools: {
          en: ['Log out, then replay the old session token in Burp Repeater'],
          cs: ['Odhlásit se, poté replay starého session tokenu v Burp Repeateru'],
        },
        reference: 'WSTG-SESS-06',
      },
      {
        id: 'SESS-07',
        title: { en: 'Testing Session Timeout', cs: 'Test timeoutu relace' },
        summary: {
          en: 'Verify idle/absolute session timeout is enforced server-side within a reasonable window.',
          cs: 'Ověřit, že je timeout nečinnosti/absolutní timeout vynucen na serveru v rozumném časovém okně.',
        },
        tools: {
          en: ['Leave the session idle for X minutes, then try a request with the old token'],
          cs: ['Nechat session nečinnou X minut, poté zkusit request se starým tokenem'],
        },
        reference: 'WSTG-SESS-07',
      },
      {
        id: 'SESS-08',
        title: { en: 'Testing for Session Puzzling', cs: 'Test session puzzling' },
        summary: {
          en: 'Check if session variables set in one context are misused/trusted in another unrelated context.',
          cs: 'Zkontrolovat, zda proměnné session nastavené v jednom kontextu nejsou nesprávně důvěryhodně použity v jiném kontextu.',
        },
        tools: {
          en: ['Map where session attributes are set and where they are read across different flows'],
          cs: ['Mapovat, kde se session atributy nastavují a kde se čtou v různých flow'],
        },
        reference: 'WSTG-SESS-08',
      },
      {
        id: 'SESS-09',
        title: { en: 'Testing for Session Hijacking', cs: 'Test únosu relace (session hijacking)' },
        summary: {
          en: 'Check if session tokens can be captured/replayed cross-device or over insecure channels.',
          cs: 'Zkontrolovat, zda lze session tokeny zachytit/přehrát z jiného zařízení nebo přes nezabezpečený kanál.',
        },
        tools: {
          en: ['Replay a captured token from a different IP/User-Agent'],
          cs: ['Replay zachyceného tokenu z jiného IP/User-Agentu'],
        },
        reference: 'WSTG-SESS-09',
      },
    ],
  },
  {
    id: 'INPV',
    code: 'WSTG-INPV',
    title: { en: 'Input Validation Testing', cs: 'Testování validace vstupů' },
    tests: [
      {
        id: 'INPV-01',
        title: { en: 'Testing for Reflected Cross Site Scripting', cs: 'Test reflektovaného Cross Site Scripting (XSS)' },
        summary: {
          en: 'Inject markup/script into parameters reflected in the response and check for execution context.',
          cs: 'Vložit markup/skript do parametrů reflektovaných v odpovědi a zkontrolovat kontext spuštění.',
        },
        tools: {
          en: ['dalfox url https://target.com/search?q=FUZZ', '<script>alert(document.domain)</script>, "><svg onload=alert(1)>'],
          cs: ['dalfox url https://target.com/search?q=FUZZ', '<script>alert(document.domain)</script>, "><svg onload=alert(1)>'],
        },
        reference: 'WSTG-INPV-01',
      },
      {
        id: 'INPV-02',
        title: { en: 'Testing for Stored Cross Site Scripting', cs: 'Test uloženého Cross Site Scripting (XSS)' },
        summary: {
          en: 'Inject payloads into persisted data (comments, profile fields) and check execution when rendered to other users.',
          cs: 'Vložit payloady do ukládaných dat (komentáře, pole profilu) a zkontrolovat spuštění při zobrazení jiným uživatelům.',
        },
        tools: {
          en: ['XSS Hunter / Burp Collaborator payloads in form fields'],
          cs: ['XSS Hunter / Burp Collaborator payloady do formulářových polí'],
        },
        reference: 'WSTG-INPV-02',
      },
      {
        id: 'INPV-03',
        title: { en: 'Testing for HTTP Verb Tampering', cs: 'Test manipulace HTTP metod' },
        summary: {
          en: 'Change HTTP method on protected endpoints to check for inconsistent access control enforcement.',
          cs: 'Změnit HTTP metodu na chráněných endpointech a zkontrolovat nekonzistentní vynucování přístupových práv.',
        },
        tools: {
          en: ['curl -X POST/PUT/DELETE/PATCH on an endpoint protected only for GET'],
          cs: ['curl -X POST/PUT/DELETE/PATCH na endpoint chráněný jen pro GET'],
        },
        reference: 'WSTG-INPV-03',
      },
      {
        id: 'INPV-04',
        title: { en: 'Testing for HTTP Parameter Pollution', cs: 'Test HTTP Parameter Pollution' },
        summary: {
          en: 'Send duplicate parameter names to see how backend/WAF/frontend handle conflicting values differently.',
          cs: 'Odeslat duplicitní názvy parametrů a sledovat, jak backend/WAF/frontend odlišně zpracují konfliktní hodnoty.',
        },
        tools: {
          en: ['curl "https://target.com/api?id=1&id=2"'],
          cs: ['curl "https://target.com/api?id=1&id=2"'],
        },
        reference: 'WSTG-INPV-04',
      },
      {
        id: 'INPV-05',
        title: { en: 'Testing for SQL Injection', cs: 'Test SQL Injection' },
        summary: {
          en: 'Test all input points for SQL injection across DB engines (error-based, blind, time-based, UNION).',
          cs: 'Otestovat všechny vstupní body na SQL injection napříč databázovými enginy (error-based, blind, time-based, UNION).',
        },
        tools: {
          en: ["sqlmap -u 'https://target.com/item?id=1' --batch --level=3 --risk=2", "' OR SLEEP(5)-- -, ' UNION SELECT NULL,NULL-- -"],
          cs: ["sqlmap -u 'https://target.com/item?id=1' --batch --level=3 --risk=2", "' OR SLEEP(5)-- -, ' UNION SELECT NULL,NULL-- -"],
        },
        reference: 'WSTG-INPV-05',
      },
      {
        id: 'INPV-06',
        title: { en: 'Testing for LDAP Injection', cs: 'Test LDAP Injection' },
        summary: {
          en: 'Test inputs feeding LDAP queries for filter injection (*)(uid=*)) style payloads.',
          cs: 'Otestovat vstupy vstupující do LDAP dotazů payloady typu (*)(uid=*)) filter injection.',
        },
        tools: {
          en: ['*)(uid=*))(|(uid=*, admin*)((|userPassword=*)'],
          cs: ['*)(uid=*))(|(uid=*, admin*)((|userPassword=*)'],
        },
        reference: 'WSTG-INPV-06',
      },
      {
        id: 'INPV-07',
        title: { en: 'Testing for XML Injection', cs: 'Test XML Injection' },
        summary: {
          en: 'Test XML-consuming endpoints for injection, including XXE (external entity) attacks.',
          cs: 'Otestovat endpointy zpracovávající XML na injection, včetně XXE (external entity) útoků.',
        },
        tools: {
          en: [
            '<?xml version="1.0"?><!DOCTYPE r [<!ENTITY x SYSTEM "file:///etc/passwd">]><r>&x;</r>',
            'XXEinjector --host=target.com --file=req.txt',
          ],
          cs: [
            '<?xml version="1.0"?><!DOCTYPE r [<!ENTITY x SYSTEM "file:///etc/passwd">]><r>&x;</r>',
            'XXEinjector --host=target.com --file=req.txt',
          ],
        },
        reference: 'WSTG-INPV-07',
      },
      {
        id: 'INPV-08',
        title: { en: 'Testing for SSI Injection', cs: 'Test SSI Injection' },
        summary: {
          en: 'Test for Server-Side Include injection on servers that process .shtml or SSI-enabled content.',
          cs: 'Otestovat Server-Side Include injection na serverech zpracovávajících .shtml nebo SSI obsah.',
        },
        tools: {
          en: ['<!--#exec cmd="id"-->'],
          cs: ['<!--#exec cmd="id"-->'],
        },
        reference: 'WSTG-INPV-08',
      },
      {
        id: 'INPV-09',
        title: { en: 'Testing for XPath Injection', cs: 'Test XPath Injection' },
        summary: {
          en: 'Test inputs used in XPath queries for authentication bypass or data extraction.',
          cs: 'Otestovat vstupy použité v XPath dotazech kvůli obejití autentizace nebo extrakci dat.',
        },
        tools: {
          en: ["' or '1'='1, ' or count(/*)=1 or '"],
          cs: ["' or '1'='1, ' or count(/*)=1 or '"],
        },
        reference: 'WSTG-INPV-09',
      },
      {
        id: 'INPV-10',
        title: { en: 'Testing for IMAP SMTP Injection', cs: 'Test IMAP/SMTP Injection' },
        summary: {
          en: 'Test webmail/contact-form inputs that build IMAP/SMTP commands for header/command injection.',
          cs: 'Otestovat vstupy webmailu/kontaktního formuláře, které sestavují IMAP/SMTP příkazy, kvůli header/command injection.',
        },
        tools: {
          en: ['CRLF injection in "To"/"Subject" fields of contact forms'],
          cs: ['CRLF injection do "To"/"Subject" polí kontaktních formulářů'],
        },
        reference: 'WSTG-INPV-10',
      },
      {
        id: 'INPV-11',
        title: { en: 'Testing for Code Injection', cs: 'Test Code Injection' },
        summary: {
          en: 'Test for server-side code evaluation (PHP/Python dynamic code execution, deserialization) via crafted input.',
          cs: 'Otestovat serverové vyhodnocování kódu (dynamické spouštění kódu v PHP/Pythonu, deserializace) přes upravený vstup.',
        },
        tools: {
          en: [
            'phpggc for PHP deserialization, ysoserial for Java',
            'try injecting dynamically evaluated code (e.g. PHP: a system call via a phpinfo page) into input fields',
          ],
          cs: [
            'phpggc pro PHP deserializaci, ysoserial pro Java',
            'zkusit vložit dynamicky vyhodnocovaný kód (např. PHP: system call přes phpinfo page) do vstupních polí',
          ],
        },
        reference: 'WSTG-INPV-11',
      },
      {
        id: 'INPV-12',
        title: { en: 'Testing for Command Injection', cs: 'Test Command Injection' },
        summary: {
          en: 'Test inputs passed to OS shell for command injection.',
          cs: 'Otestovat vstupy předávané do shellu OS kvůli command injection.',
        },
        tools: {
          en: ['commix --url="https://target.com/ping?host=FUZZ"', '; id; | id; `id`; $(id)'],
          cs: ['commix --url="https://target.com/ping?host=FUZZ"', '; id; | id; `id`; $(id)'],
        },
        reference: 'WSTG-INPV-12',
      },
      {
        id: 'INPV-13',
        title: { en: 'Testing for Format String Injection', cs: 'Test Format String Injection' },
        summary: {
          en: 'Test inputs passed to C-style formatting functions for %x/%n format string bugs.',
          cs: 'Otestovat vstupy předávané do C-style formátovacích funkcí kvůli %x/%n format string chybám.',
        },
        tools: {
          en: ['%x %x %x %x %n'],
          cs: ['%x %x %x %x %n'],
        },
        reference: 'WSTG-INPV-13',
      },
      {
        id: 'INPV-14',
        title: { en: 'Testing for Incubated Vulnerability', cs: 'Test inkubované zranitelnosti' },
        summary: {
          en: 'Test multi-step attacks where a stored payload later triggers a vulnerability elsewhere in the flow.',
          cs: 'Otestovat vícekrokové útoky, kde uložený payload spustí zranitelnost později jinde v procesu.',
        },
        tools: {
          en: ['Combine an upload/stored input with later processing (e.g. file parsing)'],
          cs: ['Kombinovat upload/stored input s následným zpracováním (např. file parsing)'],
        },
        reference: 'WSTG-INPV-14',
      },
      {
        id: 'INPV-15',
        title: { en: 'Testing for HTTP Splitting Smuggling', cs: 'Test HTTP Splitting a Smuggling' },
        summary: {
          en: 'Test for CRLF injection into headers and HTTP request smuggling between front-end proxy and backend.',
          cs: 'Otestovat CRLF injection do hlaviček a HTTP request smuggling mezi front-end proxy a backendem.',
        },
        tools: {
          en: ['smuggler.py -u https://target.com', 'curl with a CRLF sequence %0d%0a in a header to test header injection'],
          cs: ['smuggler.py -u https://target.com', 'curl s CRLF sekvencí %0d%0a v hlavičce pro test header injection'],
        },
        reference: 'WSTG-INPV-15',
      },
      {
        id: 'INPV-16',
        title: { en: 'Testing for HTTP Incoming Requests', cs: 'Test příchozích HTTP requestů' },
        summary: {
          en: 'Inspect raw incoming requests for anomalies, hidden parameters, and non-standard header handling.',
          cs: 'Prohlédnout syrové příchozí requesty kvůli anomáliím, skrytým parametrům a nestandardnímu zpracování hlaviček.',
        },
        tools: {
          en: ['Burp Proxy history + Param Miner extension (guess hidden params)'],
          cs: ['Burp Proxy history + Param Miner extension (guess hidden params)'],
        },
        reference: 'WSTG-INPV-16',
      },
      {
        id: 'INPV-17',
        title: { en: 'Testing for Host Header Injection', cs: 'Test Host Header Injection' },
        summary: {
          en: 'Manipulate Host header to test for cache poisoning, password reset poisoning, virtual host confusion.',
          cs: 'Manipulovat hlavičkou Host kvůli otestování cache poisoning, otrávení resetu hesla, záměně virtual hostu.',
        },
        tools: {
          en: ["curl -H 'Host: attacker.com' https://target.com/", "curl -H 'X-Forwarded-Host: attacker.com' https://target.com/"],
          cs: ["curl -H 'Host: attacker.com' https://target.com/", "curl -H 'X-Forwarded-Host: attacker.com' https://target.com/"],
        },
        reference: 'WSTG-INPV-17',
      },
      {
        id: 'INPV-18',
        title: { en: 'Testing for Server-side Template Injection', cs: 'Test Server-Side Template Injection (SSTI)' },
        summary: {
          en: 'Test template-rendering inputs for SSTI leading to RCE (Jinja2, Twig, Freemarker, etc).',
          cs: 'Otestovat vstupy vykreslované šablonovacím enginem kvůli SSTI vedoucímu k RCE (Jinja2, Twig, Freemarker atd.).',
        },
        tools: {
          en: ["tplmap -u 'https://target.com/render?name=FUZZ'", '${7*7}, {{7*7}}, #{7*7}, <%= 7*7 %>'],
          cs: ["tplmap -u 'https://target.com/render?name=FUZZ'", '${7*7}, {{7*7}}, #{7*7}, <%= 7*7 %>'],
        },
        reference: 'WSTG-INPV-18',
      },
      {
        id: 'INPV-19',
        title: { en: 'Testing for Server-Side Request Forgery', cs: 'Test Server-Side Request Forgery (SSRF)' },
        summary: {
          en: 'Test inputs that trigger server-side HTTP requests (URL fetchers, webhooks, PDF/image generators) for SSRF.',
          cs: 'Otestovat vstupy, které spouští serverové HTTP requesty (URL fetchery, webhooky, generátory PDF/obrázků), kvůli SSRF.',
        },
        tools: {
          en: [
            'Interactsh/Burp Collaborator payload as a URL parameter',
            'http://169.254.169.254/latest/meta-data/ for a cloud metadata test',
          ],
          cs: [
            'Interactsh/Burp Collaborator payload jako URL parametr',
            'http://169.254.169.254/latest/meta-data/ pro cloud metadata test',
          ],
        },
        reference: 'WSTG-INPV-19',
      },
    ],
  },
  {
    id: 'ERRH',
    code: 'WSTG-ERRH',
    title: { en: 'Testing for Error Handling', cs: 'Testování zpracování chyb' },
    tests: [
      {
        id: 'ERRH-01',
        title: { en: 'Testing for Improper Error Handling', cs: 'Test nesprávného zpracování chyb' },
        summary: {
          en: 'Trigger application errors and review responses for verbose messages revealing internals.',
          cs: 'Vyvolat chyby aplikace a zkontrolovat odpovědi kvůli podrobným hláškám odhalujícím vnitřní strukturu.',
        },
        tools: {
          en: ['Send invalid data/types into fields and observe error responses'],
          cs: ['Odesílat neplatná data/typy do polí a sledovat chybové odpovědi'],
        },
        reference: 'WSTG-ERRH-01',
      },
      {
        id: 'ERRH-02',
        title: { en: 'Testing for Stack Traces', cs: 'Test odhalení stack trace' },
        summary: {
          en: 'Force exceptions to check if raw stack traces leak file paths, framework versions or query structure.',
          cs: 'Vynutit výjimky a zkontrolovat, zda syrový stack trace neodhaluje cesty k souborům, verze frameworku nebo strukturu dotazů.',
        },
        tools: {
          en: ['Insert unexpected types into JSON/form fields (e.g. an array instead of a string)'],
          cs: ['Vložit neočekávané typy do JSON/form polí (např. pole místo stringu)'],
        },
        reference: 'WSTG-ERRH-02',
      },
    ],
  },
  {
    id: 'CRYP',
    code: 'WSTG-CRYP',
    title: { en: 'Testing for Weak Cryptography', cs: 'Testování slabé kryptografie' },
    tests: [
      {
        id: 'CRYP-01',
        title: { en: 'Testing for Weak Transport Layer Security', cs: 'Test slabého TLS' },
        summary: {
          en: 'Review TLS configuration: protocol versions, cipher suites, certificate validity, known TLS vulns.',
          cs: 'Zkontrolovat konfiguraci TLS: verze protokolu, cipher suites, platnost certifikátu, známé zranitelnosti TLS.',
        },
        tools: {
          en: ['testssl.sh --full target.com', 'sslyze target.com'],
          cs: ['testssl.sh --full target.com', 'sslyze target.com'],
        },
        reference: 'WSTG-CRYP-01',
      },
      {
        id: 'CRYP-02',
        title: { en: 'Testing for Padding Oracle', cs: 'Test Padding Oracle' },
        summary: {
          en: 'Test CBC-mode encrypted tokens/cookies for padding oracle vulnerabilities.',
          cs: 'Otestovat CBC šifrované tokeny/cookies kvůli zranitelnosti padding oracle.',
        },
        tools: {
          en: ['padbuster https://target.com/token ENCRYPTEDVALUE 8'],
          cs: ['padbuster https://target.com/token ENCRYPTEDVALUE 8'],
        },
        reference: 'WSTG-CRYP-02',
      },
      {
        id: 'CRYP-03',
        title: { en: 'Testing for Sensitive Information Sent via Unencrypted Channels', cs: 'Test citlivých dat odesílaných nešifrovaně' },
        summary: {
          en: 'Check for sensitive data transmitted over plain HTTP or unencrypted protocols (email, SMS gateways).',
          cs: 'Zkontrolovat citlivá data přenášená přes obyčejné HTTP nebo nešifrované protokoly (e-mail, SMS brány).',
        },
        tools: {
          en: ['Wireshark / mitmproxy traffic monitoring during testing'],
          cs: ['Wireshark / mitmproxy sledování provozu za běhu testů'],
        },
        reference: 'WSTG-CRYP-03',
      },
      {
        id: 'CRYP-04',
        title: { en: 'Testing for Weak Encryption', cs: 'Test slabého šifrování' },
        summary: {
          en: 'Identify use of weak/broken algorithms (MD5, SHA1, DES, ECB mode) for sensitive data protection.',
          cs: 'Identifikovat použití slabých/prolomených algoritmů (MD5, SHA1, DES, ECB mód) pro ochranu citlivých dat.',
        },
        tools: {
          en: ['Analyze the JWT alg header, look for ECB pattern in encrypted blocks (repeating blocks)'],
          cs: ['Analyzovat JWT alg header, hledat ECB pattern v šifrovaných blocích (opakující se bloky)'],
        },
        reference: 'WSTG-CRYP-04',
      },
    ],
  },
  {
    id: 'BUSL',
    code: 'WSTG-BUSL',
    title: { en: 'Business Logic Testing', cs: 'Testování business logiky' },
    tests: [
      {
        id: 'BUSL-01',
        title: { en: 'Test Business Logic Data Validation', cs: 'Test validace dat business logiky' },
        summary: {
          en: 'Test whether business rules are enforced server-side (negative quantities, price manipulation, invalid states).',
          cs: 'Otestovat, zda jsou business pravidla vynucována na serveru (záporná množství, manipulace ceny, neplatné stavy).',
        },
        tools: {
          en: ['Manipulate price/quantity in Burp Repeater before submitting the order'],
          cs: ['Manipulovat cenu/množství v Burp Repeateru před odesláním objednávky'],
        },
        reference: 'WSTG-BUSL-01',
      },
      {
        id: 'BUSL-02',
        title: { en: 'Test Ability to Forge Requests', cs: 'Test možnosti podvržení requestů' },
        summary: {
          en: 'Check if hidden/disabled UI logic (client-side only) can be bypassed by forging raw requests.',
          cs: 'Zkontrolovat, zda lze obejít skrytou/zakázanou UI logiku (jen na klientovi) podvržením syrových requestů.',
        },
        tools: {
          en: ['Send a request directly via Burp without using the UI (bypass JS validation)'],
          cs: ['Odeslat request přímo přes Burp bez použití UI (obejít JS validace)'],
        },
        reference: 'WSTG-BUSL-02',
      },
      {
        id: 'BUSL-03',
        title: { en: 'Test Integrity Checks', cs: 'Test kontrol integrity' },
        summary: {
          en: 'Check for tampering-detection on data passed through the client (hashes, signatures, hidden totals).',
          cs: 'Zkontrolovat detekci manipulace u dat procházejících klientem (hashe, podpisy, skryté součty).',
        },
        tools: {
          en: ['Change a value protected by a hash/signature and observe whether it is detected'],
          cs: ['Změnit hodnotu chráněnou hash/signature a sledovat, zda je detekováno'],
        },
        reference: 'WSTG-BUSL-03',
      },
      {
        id: 'BUSL-04',
        title: { en: 'Test for Process Timing', cs: 'Test časování procesů' },
        summary: {
          en: 'Check for timing-based logic flaws (race conditions, TOCTOU) in critical flows like payments/coupons.',
          cs: 'Zkontrolovat časové chyby v logice (race condition, TOCTOU) v kritických procesech jako platby/kupony.',
        },
        tools: {
          en: ['Turbo Intruder for race-condition testing (single-packet attack)'],
          cs: ['Turbo Intruder pro race condition testy (single-packet attack)'],
        },
        reference: 'WSTG-BUSL-04',
      },
      {
        id: 'BUSL-05',
        title: { en: 'Test Number of Times a Function Can Be Used Limits', cs: 'Test limitů počtu použití funkce' },
        summary: {
          en: 'Check if usage limits (coupon redemption, votes, free trials) are enforced server-side and not reusable.',
          cs: 'Zkontrolovat, zda jsou limity použití (uplatnění kuponu, hlasy, zkušební verze) vynucovány na serveru a nejsou opakovatelné.',
        },
        tools: {
          en: ['Repeat a request more times than should be allowed (Burp Intruder)'],
          cs: ['Opakovat request víckrát než by mělo být povoleno (Burp Intruder)'],
        },
        reference: 'WSTG-BUSL-05',
      },
      {
        id: 'BUSL-06',
        title: { en: 'Testing for the Circumvention of Work Flows', cs: 'Test obejití pracovních postupů' },
        summary: {
          en: 'Check if multi-step workflows can be skipped by jumping directly to a later step/endpoint.',
          cs: 'Zkontrolovat, zda lze přeskočit vícekrokový proces přímým skokem na pozdější krok/endpoint.',
        },
        tools: {
          en: ['Call a later step of the flow directly without completing the previous steps'],
          cs: ['Volat pozdější krok flow přímo bez absolvování předchozích kroků'],
        },
        reference: 'WSTG-BUSL-06',
      },
      {
        id: 'BUSL-07',
        title: { en: 'Test Defenses Against Application Misuse', cs: 'Test obrany proti zneužití aplikace' },
        summary: {
          en: 'Check anti-automation/anti-abuse controls (CAPTCHA, rate limits, bot detection) for bypasses.',
          cs: 'Zkontrolovat anti-automatizační/anti-abuse ochrany (CAPTCHA, rate limity, detekce botů) kvůli možnostem obejití.',
        },
        tools: {
          en: ['Test repeated requests with IP/session rotation, CAPTCHA re-use bypass'],
          cs: ['Testovat opakované requesty s rotací IP/session, obejití CAPTCHA re-use'],
        },
        reference: 'WSTG-BUSL-07',
      },
      {
        id: 'BUSL-08',
        title: { en: 'Test Upload of Unexpected File Types', cs: 'Test nahrání neočekávaných typů souborů' },
        summary: {
          en: 'Upload disallowed file types/extensions to check server-side validation (not just client-side).',
          cs: 'Nahrát nepovolené typy/přípony souborů a zkontrolovat validaci na serveru (nejen na klientovi).',
        },
        tools: {
          en: ['Upload a .php/.phtml/.svg file renamed / with a double extension'],
          cs: ['Nahrát .php/.phtml/.svg soubor přejmenovaný/s dvojitou příponou'],
        },
        reference: 'WSTG-BUSL-08',
      },
      {
        id: 'BUSL-09',
        title: { en: 'Test Upload of Malicious Files', cs: 'Test nahrání škodlivých souborů' },
        summary: {
          en: 'Upload files with malicious payloads (webshell, XXE-laden SVG/XML, EICAR) to test AV/sanitization.',
          cs: 'Nahrát soubory se škodlivými payloady (webshell, XXE v SVG/XML, EICAR) pro otestování AV/sanitizace.',
        },
        tools: {
          en: ['Upload a webshell, a polyglot file, an XXE payload in SVG'],
          cs: ['Upload webshellu, polyglot souboru, XXE payloadu v SVG'],
        },
        reference: 'WSTG-BUSL-09',
      },
    ],
  },
  {
    id: 'CLNT',
    code: 'WSTG-CLNT',
    title: { en: 'Client-Side Testing', cs: 'Testování na straně klienta' },
    tests: [
      {
        id: 'CLNT-01',
        title: { en: 'Testing for DOM-Based Cross Site Scripting', cs: 'Test DOM-based Cross Site Scripting (XSS)' },
        summary: {
          en: 'Trace client-side data flow from sources (URL, postMessage) to dangerous DOM sinks that render raw markup.',
          cs: 'Sledovat tok dat na klientovi od zdrojů (URL, postMessage) až po nebezpečné DOM sinky vykreslující syrový markup.',
        },
        tools: {
          en: [
            'DOM Invader (Burp), dom-xss-scanner',
            'Watch for dangerous DOM sinks (setting innerHTML, writing directly to the document) fed by user input',
          ],
          cs: [
            'DOM Invader (Burp), dom-xss-scanner',
            'Sledovat nebezpečné DOM sinky (nastavování innerHTML, přímý zápis do dokumentu) napojené na vstup od uživatele',
          ],
        },
        reference: 'WSTG-CLNT-01',
      },
      {
        id: 'CLNT-02',
        title: { en: 'Testing for JavaScript Execution', cs: 'Test spouštění JavaScriptu' },
        summary: {
          en: 'Check for arbitrary JS execution paths beyond classic XSS (e.g. unsafe dynamic evaluation of user-controlled config).',
          cs: 'Zkontrolovat cesty k libovolnému spuštění JS nad rámec klasického XSS (např. nebezpečné dynamické vyhodnocení konfigurace ovládané uživatelem).',
        },
        tools: {
          en: ['Static analysis of bundle.js for dynamic code evaluation (Function constructor etc.) fed by user input'],
          cs: ['Statická analýza bundle.js pro dynamické vyhodnocování kódu (Function konstruktor apod.) se vstupem od uživatele'],
        },
        reference: 'WSTG-CLNT-02',
      },
      {
        id: 'CLNT-03',
        title: { en: 'Testing for HTML Injection', cs: 'Test HTML Injection' },
        summary: {
          en: 'Check if user input is reflected/stored as raw HTML without script execution but still allows markup injection.',
          cs: 'Zkontrolovat, zda se uživatelský vstup reflektuje/ukládá jako syrové HTML bez spuštění skriptu, ale s možností vložení markupu.',
        },
        tools: {
          en: ['<b>test</b>, <img src=x> into text fields, observe rendering'],
          cs: ['<b>test</b>, <img src=x> do textových polí a sledovat vykreslení'],
        },
        reference: 'WSTG-CLNT-03',
      },
      {
        id: 'CLNT-04',
        title: { en: 'Testing for Client-Side URL Redirect', cs: 'Test přesměrování na straně klienta' },
        summary: {
          en: 'Test for open redirect via client-side JS reading URL params and redirecting without validation.',
          cs: 'Otestovat open redirect přes klientský JS, který čte URL parametry a přesměrovává bez validace.',
        },
        tools: {
          en: ['?redirect=https://evil.com, ?next=//evil.com'],
          cs: ['?redirect=https://evil.com, ?next=//evil.com'],
        },
        reference: 'WSTG-CLNT-04',
      },
      {
        id: 'CLNT-05',
        title: { en: 'Testing for CSS Injection', cs: 'Test CSS Injection' },
        summary: {
          en: 'Check if user-controlled CSS/style values can be used for data exfiltration (attribute selectors) or UI redress.',
          cs: 'Zkontrolovat, zda lze uživatelem ovládané CSS/style hodnoty zneužít k exfiltraci dat (atributové selektory) nebo UI redress.',
        },
        tools: {
          en: ['CSS injection payload with background-image to exfiltrate attribute values'],
          cs: ['CSS injection payload s background-image pro exfiltraci hodnot atributů'],
        },
        reference: 'WSTG-CLNT-05',
      },
      {
        id: 'CLNT-06',
        title: { en: 'Testing for Client-Side Resource Manipulation', cs: 'Test manipulace zdrojů na straně klienta' },
        summary: {
          en: 'Check if client-side JS builds resource requests (URLs, AJAX) from unsanitized input.',
          cs: 'Zkontrolovat, zda klientský JS sestavuje requesty na zdroje (URL, AJAX) z nevyčištěného vstupu.',
        },
        tools: {
          en: ['Watch the Network tab while manipulating URL params that influence JS requests'],
          cs: ['Sledovat Network tab při manipulaci s URL parametry ovlivňujícími JS requesty'],
        },
        reference: 'WSTG-CLNT-06',
      },
      {
        id: 'CLNT-07',
        title: { en: 'Test Cross Origin Resource Sharing', cs: 'Test Cross Origin Resource Sharing (CORS)' },
        summary: {
          en: 'Review CORS configuration for overly permissive origins, credentials with wildcard, reflected origin.',
          cs: 'Zkontrolovat konfiguraci CORS kvůli příliš benevolentním originům, credentials s wildcard, reflektovanému originu.',
        },
        tools: {
          en: ["curl -H 'Origin: https://evil.com' -I https://target.com/api/data", 'CORScanner -u https://target.com'],
          cs: ["curl -H 'Origin: https://evil.com' -I https://target.com/api/data", 'CORScanner -u https://target.com'],
        },
        reference: 'WSTG-CLNT-07',
      },
      {
        id: 'CLNT-08',
        title: { en: 'Testing for Cross Site Flashing', cs: 'Test Cross Site Flashing' },
        summary: {
          en: 'Legacy check for Flash (SWF) based XSS/cross-domain issues on apps still serving Flash content.',
          cs: 'Legacy kontrola XSS/cross-domain problémů založených na Flash (SWF) u aplikací stále servírujících Flash obsah.',
        },
        tools: {
          en: ['swfintruder / manual SWF decompilation (relevant only for legacy apps)'],
          cs: ['swfintruder / manuální dekompilace SWF (relevantní jen pro legacy aplikace)'],
        },
        reference: 'WSTG-CLNT-08',
      },
      {
        id: 'CLNT-09',
        title: { en: 'Testing for Clickjacking', cs: 'Test Clickjacking' },
        summary: {
          en: 'Check for X-Frame-Options/CSP frame-ancestors protections against UI redress attacks.',
          cs: 'Zkontrolovat ochranu X-Frame-Options/CSP frame-ancestors proti UI redress útokům.',
        },
        tools: {
          en: [
            'curl -sI https://target.com | grep -i "x-frame-options\\|content-security-policy"',
            'Build a PoC HTML with an <iframe> and test whether the page renders',
          ],
          cs: [
            'curl -sI https://target.com | grep -i "x-frame-options\\|content-security-policy"',
            'Vytvořit PoC HTML s <iframe> a testovat, zda se stránka vykreslí',
          ],
        },
        reference: 'WSTG-CLNT-09',
      },
      {
        id: 'CLNT-10',
        title: { en: 'Testing WebSockets', cs: 'Test WebSocketů' },
        summary: {
          en: 'Test WebSocket handshake origin validation, auth, and message-level injection.',
          cs: 'Otestovat validaci originu při WebSocket handshake, autentizaci a injection na úrovni zpráv.',
        },
        tools: {
          en: ['Burp Suite WebSockets history + manual message tampering', 'websocat wss://target.com/ws'],
          cs: ['Burp Suite WebSockets history + manuální úprava zpráv', 'websocat wss://target.com/ws'],
        },
        reference: 'WSTG-CLNT-10',
      },
      {
        id: 'CLNT-11',
        title: { en: 'Test Web Messaging', cs: 'Test Web Messaging' },
        summary: {
          en: 'Check cross-window messaging handlers for missing origin validation allowing cross-origin data injection.',
          cs: 'Zkontrolovat handlery cross-window messaging kvůli chybějící validaci originu umožňující cross-origin injection dat.',
        },
        tools: {
          en: ['Static analysis of message event handlers without origin verification'],
          cs: ['Statická analýza message event handlerů bez ověření originu'],
        },
        reference: 'WSTG-CLNT-11',
      },
      {
        id: 'CLNT-12',
        title: { en: 'Testing Browser Storage', cs: 'Test úložiště prohlížeče' },
        summary: {
          en: 'Review localStorage/sessionStorage/IndexedDB for sensitive data storage (tokens, PII) accessible to XSS.',
          cs: 'Zkontrolovat localStorage/sessionStorage/IndexedDB kvůli ukládání citlivých dat (tokeny, PII) dostupných pro XSS.',
        },
        tools: {
          en: ['DevTools > Application > Local/Session Storage — inspect the content'],
          cs: ['DevTools > Application > Local/Session Storage kontrola obsahu'],
        },
        reference: 'WSTG-CLNT-12',
      },
      {
        id: 'CLNT-13',
        title: { en: 'Testing for Cross Site Script Inclusion', cs: 'Test Cross Site Script Inclusion (XSSI)' },
        summary: {
          en: 'Check if JSON/JS resources with sensitive data can be included cross-origin via script tag (JSONP/XSSI).',
          cs: 'Zkontrolovat, zda lze JSON/JS zdroje s citlivými daty načíst cross-origin přes script tag (JSONP/XSSI).',
        },
        tools: {
          en: ['Try loading the endpoint as a script tag from a different origin and watch for data leakage'],
          cs: ['Zkusit načíst endpoint jako script tag z jiného originu a sledovat únik dat'],
        },
        reference: 'WSTG-CLNT-13',
      },
    ],
  },
  {
    id: 'APIT',
    code: 'WSTG-APIT',
    title: { en: 'API Testing', cs: 'Testování API' },
    tests: [
      {
        id: 'APIT-01',
        title: { en: 'Testing GraphQL', cs: 'Test GraphQL' },
        summary: {
          en: 'Test GraphQL endpoints for introspection exposure, batching/DoS, injection, and broken authorization on resolvers.',
          cs: 'Otestovat GraphQL endpointy kvůli exponované introspekci, batching/DoS, injection a nedostatečné autorizaci resolverů.',
        },
        tools: {
          en: [
            'graphql-cop -t https://target.com/graphql',
            'InQL (Burp extension) for introspection and schema mapping',
            '{"query":"{__schema{types{name}}}"} — introspection test',
          ],
          cs: [
            'graphql-cop -t https://target.com/graphql',
            'InQL (Burp extension) pro introspection a schema mapping',
            '{"query":"{__schema{types{name}}}"} — introspection test',
          ],
        },
        reference: 'WSTG-APIT-01',
      },
    ],
  },
];

export const ALL_TESTS: WstgTest[] = WSTG_CATEGORIES.flatMap((c) => c.tests);
export const TOTAL_TEST_COUNT = ALL_TESTS.length;
