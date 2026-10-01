export function validateBook(value) {
  if (!value || typeof value.title !== 'string' || !value.title.trim() || !Array.isArray(value.chapters) || !value.chapters.length) throw new Error('Książka musi mieć tytuł i co najmniej jeden rozdział.');
  if (value.chapters.length > 1000) throw new Error('Zbyt wiele rozdziałów.');
  const ids = new Set();
  const chapters = value.chapters.map((c, i) => {
    if (!c || typeof c.title !== 'string' || !Array.isArray(c.blocks)) throw new Error(`Nieprawidłowy rozdział ${i + 1}.`);
    const id = String(c.id ?? i + 1);
    if (ids.has(id)) throw new Error('Identyfikatory rozdziałów muszą być unikalne.');
    ids.add(id);
    const blocks = c.blocks.map(b => {
      if (!b || !['paragraph', 'image', 'notice'].includes(b.type)) throw new Error('Nieznany rodzaj bloku.');
      if (b.type === 'image') {
        if (typeof b.src !== 'string' || !safeImageSource(b.src)) throw new Error('Niedozwolony adres ilustracji.');
        return {type: 'image', src: b.src, alt: String(b.alt ?? ''), caption: String(b.caption ?? '')};
      }
      if (typeof b.text !== 'string') throw new Error('Blok tekstowy musi zawierać tekst.');
      return {type: b.type, text: b.text};
    });
    return {id, title: c.title, meta: String(c.meta ?? ''), blocks};
  });
  let cover;
  if(value.cover){if(typeof value.cover.src!=='string'||!safeImageSource(value.cover.src))throw new Error('Niedozwolony adres okładki.');cover={src:value.cover.src,alt:String(value.cover.alt??value.title)};}
  return {id: String(value.id || value.title), title: value.title, subtitle: String(value.subtitle ?? ''), ...(cover?{cover}:{}), chapters};
}
export function safeImageSource(src) {
  if (!src.trim() || src.includes('\\') || /[\u0000-\u0020]/.test(src)) return false;
  if (/^https:\/\//i.test(src)) return true;
  if (/^data:image\/(png|jpeg|webp|gif);base64,[a-z0-9+/=]+$/i.test(src)) return true;
  return !/^[a-z][a-z0-9+.-]*:/i.test(src) && !src.startsWith('//') && !src.startsWith('/');
}
export function parseText(text, title = 'Moja książka') {
  const lines = text.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').split('\n');
  const chapters = []; let current = null, pending = [];
  const flush = () => { if (pending.length) {current.blocks.push({type:'paragraph', text:pending.join(' ').trim()});pending=[];} };
  for (const line of lines) {
    if (/^(?:#{1,2}\s+|Rozdział\s+(?:[IVXLCDM]+|\d+)\b)/i.test(line.trim())) {
      if (current) flush();
      current = {id:String(chapters.length+1),title:line.replace(/^#{1,2}\s+/, '').trim(),blocks:[]}; chapters.push(current);
    } else {
      if (!current) {current={id:'1',title:'Początek',blocks:[]};chapters.push(current);}
      if (!line.trim()) flush(); else pending.push(line.trim());
    }
  }
  if(current) flush();
  if(!chapters.some(c=>c.blocks.length)) throw new Error('Plik nie zawiera tekstu.');
  return validateBook({title,chapters:chapters.filter(c=>c.blocks.length)});
}
export function readingMinutes(chapter) {
  const words = chapter.blocks.filter(b=>b.type==='paragraph').reduce((n,b)=>n+b.text.trim().split(/\s+/).filter(Boolean).length,0);
  return Math.max(1,Math.ceil(words/200));
}
export const demo = validateBook({id:'bookforge-demo',title:'Popiół nad Polską',subtitle:'Podgląd czytnika · materiał demonstracyjny',chapters:[
  {id:'intro',title:'Zanim zaczniesz',meta:'BookForge / Twoja przestrzeń do czytania',blocks:[
    {type:'notice',text:'To demonstracja czytnika. Aktualny rękopis „Popiołu nad Polską” nie jest jeszcze wczytany. Poniższe teksty opisują obsługę aplikacji i nie należą do powieści.'},
    {type:'paragraph',text:'Dobra opowieść potrzebuje przestrzeni. Ten czytnik daje ją tekstowi: spokojne tło, czytelną kolumnę i narzędzia, które pozostają na obrzeżach strony.'},
    {type:'paragraph',text:'Wybierz „Wczytaj książkę”, aby otworzyć plik TXT lub JSON. Tekst z nagłówkami „Rozdział I”, „Rozdział II” i kolejnymi zostanie automatycznie podzielony. Każdy rozdział znajdziesz w spisie treści.'},
    {type:'paragraph',text:'W panelu Aa zmienisz wielkość liter, interlinię, szerokość tekstu i kolor strony. Wybierz noc, papier lub sepię. Na telefonie spis treści otworzysz przyciskiem w prawym górnym rogu.'},
    {type:'paragraph',text:'Możesz zamknąć kartę i wrócić później. Książka, ustawienia, zakładki i miejsce czytania pozostają w tej przeglądarce. Nie potrzebujesz konta.'}]},
  {id:'illustrations',title:'Miejsce na ilustracje',meta:'Tekst i obrazy w jednym rytmie',blocks:[
    {type:'paragraph',text:'Ilustracje można umieścić pomiędzy akapitami. Czytnik obsługuje podpisy, opisy alternatywne oraz pliki dołączone z urządzenia. Dzięki temu portrety, warsztat Leona i kolejne widoki Czarnowa mogą pojawiać się w ustalonych miejscach książki.'},
    {type:'image',src:'assets/warsztat.png',alt:'Miejsce na ilustrację warsztatu Leona',caption:'Przykładowe miejsce ilustracji — dodaj plik warsztat.png, aby zobaczyć obraz.'},
    {type:'paragraph',text:'W książce JSON podaj ścieżkę ilustracji w polu src. Jeżeli plik nie jest dostępny pod tym adresem, użyj przycisku „Dodaj ilustracje” i wybierz obrazy z dysku. Nazwy muszą odpowiadać nazwom w książce.'}]},
  {id:'return',title:'Wróć w to samo miejsce',meta:'Zakładki / Postęp / Wyszukiwanie w przeglądarce',blocks:[
    {type:'paragraph',text:'Przycisk „Zakładka” zapisuje bieżące miejsce w rozdziale. W spisie po lewej możesz wrócić do każdego zapisanego fragmentu lub usunąć zakładkę. Pasek u dołu pokazuje postęp aktualnego rozdziału.'},
    {type:'paragraph',text:'Strzałki w lewo i w prawo przełączają rozdziały, gdy nie korzystasz z ustawień ani pola formularza. Tekst możesz przeszukać standardowym skrótem przeglądarki Ctrl+F lub Cmd+F.'},
    {type:'notice',text:'Czytnik przechowuje dane lokalnie. Wyczyszczenie danych przeglądarki usuwa również wczytaną książkę i zakładki. Zachowaj oryginalne pliki książki i grafik.'}]}]});
