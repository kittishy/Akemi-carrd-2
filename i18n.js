/**
 * i18n.js — Auto-detect device language and apply translations.
 * Fallback language: pt (Brazilian Portuguese).
 * Supported: pt, en, es, fr, de, ja, ko, zh, ru, it, pl, tr, ar
 * RTL support: Arabic (ar) → adds dir="rtl" to <html>.
 *
 * Usage:
 *   import { t, currentLang } from './i18n.js';
 *   or access window.__i18n
 */

const translations = {
  // ── Brazilian Portuguese (fallback / default) ────────────────────────────
  pt: {
    // Theme toggle
    toggle_theme: "Alternar tema",

    // Profile
    bio: "Programadora que preza pela simplicidade e usabilidade.",
    verified: "Perfil verificado",

    // Music widget — now-playing card
    music_listening: "Ouvindo",
    music_last_played: "Tocou por último",
    music_loading_track: "Carregando faixa...",
    music_checking: "Verificando Last.fm",
    music_open_lastfm: "Abrir no Last.fm",
    music_now_playing_aria: "Tocando agora no Spotify via Last.fm",
    music_art_alt: "Capa do álbum atual",
    music_idle_aria: "Música inativa",

    // Music widget — fallback card
    music_label: "Música",
    music_nothing: "Nada tocando agora",
    music_fallback_hint: "Assim que o Last.fm detectar uma faixa, ela aparecerá aqui automaticamente.",

    // Discord activity
    discord_activity_aria: "Atividade no Discord",
    discord_music_status_aria: "Status de música",
    activity_playing: "Jogando",
    activity_streaming: "Transmitindo",
    activity_listening: "Ouvindo",
    activity_watching: "Assistindo",
    activity_custom: "Status personalizado",
    activity_competing: "Competindo em",
    activity_elapsed: "elapsed", // used in time string e.g. "05:32 elapsed"
    activity_unknown: "Desconhecido",

    // Action buttons
    btn_about: "Sobre",
    btn_follow: "Seguir",
    btn_follow_aria: "Seguir no Discord",

    // About panel
    about_aria: "Sobre Akemi",
    about_back: "Voltar",
    about_back_aria: "Voltar ao perfil",
    about_heading: "Ei, sou a Akemi.",
    about_p1: "Desenvolvedora de 22 anos, baseada no Brasil. Escrevo código desde 2016, movida principalmente pela curiosidade e pela tendência de hiperfocalisar em coisas até que elas realmente funcionem.",
    about_p2: "Sou neurodivergente, e isso molda como eu construo: penso em sistemas, fico obcecada com detalhes e me importo muito com como as coisas <em>parecem</em> para usar, não só como elas aparentam.",
    about_p3: "Quando não estou codando, estou perdida em Cyberpunk 2077, construindo algo absurdo no Minecraft, ou descobrindo jogos aleatórios.",
    about_p4: "Falo vários idiomas. Atualmente aprendendo a fazer as coisas mais simples.",
  },

  // ── English ───────────────────────────────────────────────────────────────
  en: {
    toggle_theme: "Toggle theme",
    bio: "Programmer who focuses on simplicity and usability.",
    verified: "Verified profile",
    music_listening: "Listening",
    music_last_played: "Last played",
    music_loading_track: "Loading track...",
    music_checking: "Checking Last.fm",
    music_open_lastfm: "Open on Last.fm",
    music_now_playing_aria: "Now playing on Spotify via Last.fm",
    music_art_alt: "Current track artwork",
    music_idle_aria: "Music idle state",
    music_label: "Music",
    music_nothing: "Nothing playing right now",
    music_fallback_hint: "As soon as Last.fm detects a track, it will appear here automatically.",
    discord_activity_aria: "Discord activity",
    discord_music_status_aria: "Music status",
    activity_playing: "Playing",
    activity_streaming: "Streaming",
    activity_listening: "Listening to",
    activity_watching: "Watching",
    activity_custom: "Custom Status",
    activity_competing: "Competing in",
    activity_elapsed: "elapsed",
    activity_unknown: "Unknown",
    btn_about: "About",
    btn_follow: "Follow",
    btn_follow_aria: "Follow on Discord",
    about_aria: "About Akemi",
    about_back: "Back",
    about_back_aria: "Back to profile",
    about_heading: "Hey, I'm Akemi.",
    about_p1: "22 y/o developer based in Brazil. I've been writing code since 2016, mostly driven by curiosity and a tendency to hyperfocus on things until they actually work.",
    about_p2: "I'm neurodivergent, and it shapes how I build: I think in systems, get obsessed with details, and care a lot about how things <em>feel</em> to use, not just how they look.",
    about_p3: "When I'm not coding, I'm usually lost in Cyberpunk 2077, building something absurd in Minecraft, or picking up random games.",
    about_p4: "I speak multiple languages. Currently learning to make things simpler.",
  },

  // ── Spanish ───────────────────────────────────────────────────────────────
  es: {
    toggle_theme: "Cambiar tema",
    bio: "Programadora que se enfoca en la simplicidad y la usabilidad.",
    verified: "Perfil verificado",
    music_listening: "Escuchando",
    music_last_played: "Última reproducción",
    music_loading_track: "Cargando pista...",
    music_checking: "Verificando Last.fm",
    music_open_lastfm: "Abrir en Last.fm",
    music_now_playing_aria: "Reproduciendo en Spotify vía Last.fm",
    music_art_alt: "Portada del álbum actual",
    music_idle_aria: "Música inactiva",
    music_label: "Música",
    music_nothing: "Nada reproduciéndose ahora",
    music_fallback_hint: "En cuanto Last.fm detecte una pista, aparecerá aquí automáticamente.",
    discord_activity_aria: "Actividad de Discord",
    discord_music_status_aria: "Estado de música",
    activity_playing: "Jugando",
    activity_streaming: "Transmitiendo",
    activity_listening: "Escuchando",
    activity_watching: "Viendo",
    activity_custom: "Estado personalizado",
    activity_competing: "Compitiendo en",
    activity_elapsed: "transcurrido",
    activity_unknown: "Desconocido",
    btn_about: "Sobre mí",
    btn_follow: "Seguir",
    btn_follow_aria: "Seguir en Discord",
    about_aria: "Sobre Akemi",
    about_back: "Volver",
    about_back_aria: "Volver al perfil",
    about_heading: "Hola, soy Akemi.",
    about_p1: "Desarrolladora de 22 años con base en Brasil. Llevo escribiendo código desde 2016, impulsada principalmente por la curiosidad y mi tendencia a hiperfocalizar en las cosas hasta que realmente funcionan.",
    about_p2: "Soy neurodivergente, y eso moldea cómo construyo: pienso en sistemas, me obsesiono con los detalles y me importa mucho cómo se <em>siente</em> usar algo, no solo cómo se ve.",
    about_p3: "Cuando no estoy programando, suelo estar perdida en Cyberpunk 2077, construyendo algo absurdo en Minecraft o probando juegos aleatorios.",
    about_p4: "Hablo varios idiomas. Actualmente aprendiendo a hacer las cosas más simples.",
  },

  // ── French ────────────────────────────────────────────────────────────────
  fr: {
    toggle_theme: "Changer de thème",
    bio: "Programmeuse axée sur la simplicité et l'utilisabilité.",
    verified: "Profil vérifié",
    music_listening: "En écoute",
    music_last_played: "Dernière lecture",
    music_loading_track: "Chargement...",
    music_checking: "Vérification Last.fm",
    music_open_lastfm: "Ouvrir sur Last.fm",
    music_now_playing_aria: "En cours de lecture sur Spotify via Last.fm",
    music_art_alt: "Pochette de l'album en cours",
    music_idle_aria: "Musique inactive",
    music_label: "Musique",
    music_nothing: "Rien en cours de lecture",
    music_fallback_hint: "Dès que Last.fm détecte une piste, elle apparaîtra ici automatiquement.",
    discord_activity_aria: "Activité Discord",
    discord_music_status_aria: "Statut musique",
    activity_playing: "Joue à",
    activity_streaming: "En direct",
    activity_listening: "Écoute",
    activity_watching: "Regarde",
    activity_custom: "Statut personnalisé",
    activity_competing: "En compétition dans",
    activity_elapsed: "écoulé",
    activity_unknown: "Inconnu",
    btn_about: "À propos",
    btn_follow: "Suivre",
    btn_follow_aria: "Suivre sur Discord",
    about_aria: "À propos d'Akemi",
    about_back: "Retour",
    about_back_aria: "Retour au profil",
    about_heading: "Salut, je suis Akemi.",
    about_p1: "Développeuse de 22 ans basée au Brésil. J'écris du code depuis 2016, poussée surtout par la curiosité et ma tendance à m'hyperfocaliser sur les choses jusqu'à ce qu'elles fonctionnent vraiment.",
    about_p2: "Je suis neurodivergente, et ça façonne ma façon de construire : je pense en systèmes, je m'obsède sur les détails, et je tiens beaucoup à la façon dont les choses se <em>ressentent</em> à l'usage, pas seulement à leur apparence.",
    about_p3: "Quand je ne code pas, je suis généralement perdue dans Cyberpunk 2077, en train de construire quelque chose d'absurde dans Minecraft, ou à tester des jeux au hasard.",
    about_p4: "Je parle plusieurs langues. J'apprends actuellement à simplifier les choses.",
  },

  // ── German ────────────────────────────────────────────────────────────────
  de: {
    toggle_theme: "Design wechseln",
    bio: "Programmiererin mit Fokus auf Einfachheit und Benutzerfreundlichkeit.",
    verified: "Verifiziertes Profil",
    music_listening: "Hört",
    music_last_played: "Zuletzt gespielt",
    music_loading_track: "Lade Track...",
    music_checking: "Prüfe Last.fm",
    music_open_lastfm: "Auf Last.fm öffnen",
    music_now_playing_aria: "Gerade gespielt auf Spotify via Last.fm",
    music_art_alt: "Aktuelles Albumcover",
    music_idle_aria: "Musik inaktiv",
    music_label: "Musik",
    music_nothing: "Gerade nichts am laufen",
    music_fallback_hint: "Sobald Last.fm einen Track erkennt, erscheint er hier automatisch.",
    discord_activity_aria: "Discord-Aktivität",
    discord_music_status_aria: "Musikstatus",
    activity_playing: "Spielt",
    activity_streaming: "Streamt",
    activity_listening: "Hört",
    activity_watching: "Schaut",
    activity_custom: "Benutzerstatus",
    activity_competing: "Konkurriert in",
    activity_elapsed: "vergangen",
    activity_unknown: "Unbekannt",
    btn_about: "Über mich",
    btn_follow: "Folgen",
    btn_follow_aria: "Auf Discord folgen",
    about_aria: "Über Akemi",
    about_back: "Zurück",
    about_back_aria: "Zurück zum Profil",
    about_heading: "Hey, ich bin Akemi.",
    about_p1: "22-jährige Entwicklerin aus Brasilien. Ich schreibe seit 2016 Code – hauptsächlich angetrieben von Neugier und der Tendenz, mich in Dinge zu vertiefen, bis sie wirklich funktionieren.",
    about_p2: "Ich bin neurodivergent, und das beeinflusst, wie ich baue: Ich denke in Systemen, werde von Details besessen und kümmere mich sehr darum, wie sich Dinge beim Benutzen <em>anfühlen</em>, nicht nur wie sie aussehen.",
    about_p3: "Wenn ich nicht code, stecke ich meistens in Cyberpunk 2077, baue irgendetwas Absurdes in Minecraft oder teste zufällige Spiele aus.",
    about_p4: "Ich spreche mehrere Sprachen. Gerade lerne ich, Dinge einfacher zu machen.",
  },

  // ── Japanese ──────────────────────────────────────────────────────────────
  ja: {
    toggle_theme: "テーマを切り替え",
    bio: "シンプルさと使いやすさを重視するプログラマー。",
    verified: "認証済みプロフィール",
    music_listening: "再生中",
    music_last_played: "最後に再生",
    music_loading_track: "読み込み中...",
    music_checking: "Last.fm を確認中",
    music_open_lastfm: "Last.fm で開く",
    music_now_playing_aria: "Last.fm 経由で Spotify 再生中",
    music_art_alt: "現在のトラックのアートワーク",
    music_idle_aria: "音楽アイドル状態",
    music_label: "ミュージック",
    music_nothing: "現在再生中の曲はありません",
    music_fallback_hint: "Last.fm がトラックを検出すると、自動的にここに表示されます。",
    discord_activity_aria: "Discord アクティビティ",
    discord_music_status_aria: "音楽ステータス",
    activity_playing: "プレイ中",
    activity_streaming: "配信中",
    activity_listening: "聴いています",
    activity_watching: "視聴中",
    activity_custom: "カスタムステータス",
    activity_competing: "競技中",
    activity_elapsed: "経過",
    activity_unknown: "不明",
    btn_about: "について",
    btn_follow: "フォロー",
    btn_follow_aria: "Discord でフォロー",
    about_aria: "Akemi について",
    about_back: "戻る",
    about_back_aria: "プロフィールに戻る",
    about_heading: "はじめまして、Akemi です。",
    about_p1: "ブラジル在住の22歳の開発者。2016年からコードを書いており、主に好奇心と、ものが実際に動くまで深く集中し続ける性質に駆られています。",
    about_p2: "私はニューロダイバージェントで、それが作り方に影響しています。システムで考え、細部にこだわり、見た目だけでなく使ったときの<em>感覚</em>をとても大切にしています。",
    about_p3: "コーディングしていないときは、Cyberpunk 2077 に没入しているか、Minecraft で何か突拍子もないものを作っているか、ランダムにゲームをプレイしています。",
    about_p4: "複数の言語を話します。今はシンプルにすることを学んでいます。",
  },

  // ── Korean ────────────────────────────────────────────────────────────────
  ko: {
    toggle_theme: "테마 전환",
    bio: "단순함과 사용성에 집중하는 개발자.",
    verified: "인증된 프로필",
    music_listening: "듣는 중",
    music_last_played: "마지막 재생",
    music_loading_track: "트랙 로딩 중...",
    music_checking: "Last.fm 확인 중",
    music_open_lastfm: "Last.fm에서 열기",
    music_now_playing_aria: "Last.fm을 통해 Spotify에서 재생 중",
    music_art_alt: "현재 트랙 아트워크",
    music_idle_aria: "음악 대기 상태",
    music_label: "음악",
    music_nothing: "현재 재생 중인 곡 없음",
    music_fallback_hint: "Last.fm이 트랙을 감지하면 자동으로 여기에 표시됩니다.",
    discord_activity_aria: "Discord 활동",
    discord_music_status_aria: "음악 상태",
    activity_playing: "플레이 중",
    activity_streaming: "스트리밍 중",
    activity_listening: "듣는 중",
    activity_watching: "시청 중",
    activity_custom: "사용자 상태",
    activity_competing: "참여 중",
    activity_elapsed: "경과",
    activity_unknown: "알 수 없음",
    btn_about: "소개",
    btn_follow: "팔로우",
    btn_follow_aria: "Discord에서 팔로우",
    about_aria: "Akemi 소개",
    about_back: "뒤로",
    about_back_aria: "프로필로 돌아가기",
    about_heading: "안녕하세요, Akemi입니다.",
    about_p1: "브라질에 사는 22살 개발자입니다. 2016년부터 코드를 써왔는데, 주로 호기심과 뭔가 제대로 작동할 때까지 깊이 파고드는 성향 덕분입니다.",
    about_p2: "저는 신경다양인이고, 그게 만드는 방식에 영향을 줍니다. 시스템으로 생각하고, 세부 사항에 집착하며, 어떻게 생겼는지보다 사용했을 때 어떻게 <em>느껴지는지</em>를 중요하게 여깁니다.",
    about_p3: "코딩하지 않을 때는 Cyberpunk 2077에 빠져 있거나, Minecraft에서 말도 안 되는 걸 짓거나, 랜덤으로 게임을 하고 있어요.",
    about_p4: "여러 언어를 구사합니다. 지금은 더 단순하게 만드는 법을 배우고 있어요.",
  },

  // ── Chinese Simplified ────────────────────────────────────────────────────
  zh: {
    toggle_theme: "切换主题",
    bio: "专注于简洁与易用性的程序员。",
    verified: "已认证账户",
    music_listening: "正在听",
    music_last_played: "最近播放",
    music_loading_track: "加载曲目中...",
    music_checking: "正在检查 Last.fm",
    music_open_lastfm: "在 Last.fm 中打开",
    music_now_playing_aria: "通过 Last.fm 在 Spotify 上播放",
    music_art_alt: "当前曲目封面",
    music_idle_aria: "音乐闲置状态",
    music_label: "音乐",
    music_nothing: "当前没有正在播放的内容",
    music_fallback_hint: "一旦 Last.fm 检测到曲目，它将自动显示在此处。",
    discord_activity_aria: "Discord 活动",
    discord_music_status_aria: "音乐状态",
    activity_playing: "正在玩",
    activity_streaming: "直播中",
    activity_listening: "正在听",
    activity_watching: "正在看",
    activity_custom: "自定义状态",
    activity_competing: "正在参赛",
    activity_elapsed: "已过",
    activity_unknown: "未知",
    btn_about: "关于",
    btn_follow: "关注",
    btn_follow_aria: "在 Discord 上关注",
    about_aria: "关于 Akemi",
    about_back: "返回",
    about_back_aria: "返回主页",
    about_heading: "嗨，我是 Akemi。",
    about_p1: "22 岁的开发者，居住在巴西。我从 2016 年开始写代码，主要是出于好奇心，以及一旦开始做某件事就停不下来、直到它真正跑通为止的执念。",
    about_p2: "我是神经多样性者，这塑造了我的构建方式：我用系统思维思考，对细节着迷，非常在乎使用时的<em>感受</em>，而不只是外观。",
    about_p3: "不写代码的时候，我通常沉迷于《赛博朋克 2077》，在 Minecraft 里造些荒诞的东西，或者随机发现新游戏。",
    about_p4: "我会说多种语言，目前正在学习把事情做得更简单。",
  },

  // ── Russian ───────────────────────────────────────────────────────────────
  ru: {
    toggle_theme: "Сменить тему",
    bio: "Разработчица, уделяющая особое внимание простоте и удобству использования.",
    verified: "Подтверждённый профиль",
    music_listening: "Слушает",
    music_last_played: "Последнее воспроизведение",
    music_loading_track: "Загрузка...",
    music_checking: "Проверяем Last.fm",
    music_open_lastfm: "Открыть в Last.fm",
    music_now_playing_aria: "Сейчас играет в Spotify через Last.fm",
    music_art_alt: "Обложка текущего трека",
    music_idle_aria: "Музыка не играет",
    music_label: "Музыка",
    music_nothing: "Ничего не играет",
    music_fallback_hint: "Как только Last.fm обнаружит трек, он автоматически появится здесь.",
    discord_activity_aria: "Активность в Discord",
    discord_music_status_aria: "Статус музыки",
    activity_playing: "Играет в",
    activity_streaming: "Стримит",
    activity_listening: "Слушает",
    activity_watching: "Смотрит",
    activity_custom: "Пользовательский статус",
    activity_competing: "Соревнуется в",
    activity_elapsed: "прошло",
    activity_unknown: "Неизвестно",
    btn_about: "О себе",
    btn_follow: "Подписаться",
    btn_follow_aria: "Подписаться в Discord",
    about_aria: "Об Akemi",
    about_back: "Назад",
    about_back_aria: "Вернуться к профилю",
    about_heading: "Привет, я Akemi.",
    about_p1: "22-летний разработчик из Бразилии. Пишу код с 2016 года — в основном из любопытства и из-за привычки зацикливаться на чём-то, пока оно не заработает как надо.",
    about_p2: "Я нейроотличная, и это влияет на то, как я создаю: думаю системами, зацикливаюсь на деталях и сильно забочусь о том, как вещи <em>ощущаются</em> в использовании, а не только как выглядят.",
    about_p3: "Когда я не кожу, то чаще всего потеряна в Cyberpunk 2077, строю что-нибудь безумное в Minecraft или случайно нахожу новые игры.",
    about_p4: "Говорю на нескольких языках. Сейчас учусь делать вещи проще.",
  },

  // ── Italian ───────────────────────────────────────────────────────────────
  it: {
    toggle_theme: "Cambia tema",
    bio: "Programmatrice che punta alla semplicità e all'usabilità.",
    verified: "Profilo verificato",
    music_listening: "In ascolto",
    music_last_played: "Ultima riproduzione",
    music_loading_track: "Caricamento traccia...",
    music_checking: "Controllo Last.fm",
    music_open_lastfm: "Apri su Last.fm",
    music_now_playing_aria: "In riproduzione su Spotify tramite Last.fm",
    music_art_alt: "Copertina della traccia corrente",
    music_idle_aria: "Musica inattiva",
    music_label: "Musica",
    music_nothing: "Nessuna traccia in riproduzione",
    music_fallback_hint: "Non appena Last.fm rileva una traccia, apparirà qui automaticamente.",
    discord_activity_aria: "Attività Discord",
    discord_music_status_aria: "Stato musica",
    activity_playing: "Sta giocando a",
    activity_streaming: "In streaming",
    activity_listening: "In ascolto di",
    activity_watching: "Sta guardando",
    activity_custom: "Stato personalizzato",
    activity_competing: "In competizione in",
    activity_elapsed: "trascorso",
    activity_unknown: "Sconosciuto",
    btn_about: "Chi sono",
    btn_follow: "Segui",
    btn_follow_aria: "Segui su Discord",
    about_aria: "Chi è Akemi",
    about_back: "Indietro",
    about_back_aria: "Torna al profilo",
    about_heading: "Ciao, sono Akemi.",
    about_p1: "Sviluppatrice di 22 anni con base in Brasile. Scrivo codice dal 2016, spinta principalmente dalla curiosità e dalla tendenza a iperfocalizzarmi sulle cose finché non funzionano davvero.",
    about_p2: "Sono neurodivergente, e questo plasma il mio modo di costruire: penso per sistemi, mi ossessiono sui dettagli e tengo moltissimo a come le cose si <em>sentono</em> nell'uso, non solo a come appaiono.",
    about_p3: "Quando non sto programmando, di solito sono persa in Cyberpunk 2077, a costruire qualcosa di assurdo in Minecraft, o a esplorare giochi a caso.",
    about_p4: "Parlo più lingue. Sto imparando a rendere le cose più semplici.",
  },

  // ── Polish ────────────────────────────────────────────────────────────────
  pl: {
    toggle_theme: "Zmień motyw",
    bio: "Programistka skupiająca się na prostocie i użyteczności.",
    verified: "Zweryfikowany profil",
    music_listening: "Słucha",
    music_last_played: "Ostatnio grane",
    music_loading_track: "Ładowanie utworu...",
    music_checking: "Sprawdzam Last.fm",
    music_open_lastfm: "Otwórz na Last.fm",
    music_now_playing_aria: "Teraz grane na Spotify przez Last.fm",
    music_art_alt: "Okładka bieżącego utworu",
    music_idle_aria: "Muzyka nieaktywna",
    music_label: "Muzyka",
    music_nothing: "Nic nie gra w tej chwili",
    music_fallback_hint: "Gdy tylko Last.fm wykryje utwór, pojawi się tu automatycznie.",
    discord_activity_aria: "Aktywność Discord",
    discord_music_status_aria: "Status muzyki",
    activity_playing: "Gra w",
    activity_streaming: "Streamuje",
    activity_listening: "Słucha",
    activity_watching: "Ogląda",
    activity_custom: "Własny status",
    activity_competing: "Rywalizuje w",
    activity_elapsed: "minęło",
    activity_unknown: "Nieznane",
    btn_about: "O mnie",
    btn_follow: "Obserwuj",
    btn_follow_aria: "Obserwuj na Discordzie",
    about_aria: "O Akemi",
    about_back: "Wróć",
    about_back_aria: "Wróć do profilu",
    about_heading: "Hej, jestem Akemi.",
    about_p1: "22-letnia developerka z Brazylii. Piszę kod od 2016 roku, głównie napędzana ciekawością i tendencją do hiperfokusowania się na rzeczach, dopóki nie zaczną działać jak należy.",
    about_p2: "Jestem neuroróżnorodna, co kształtuje sposób, w jaki tworzę: myślę systemami, obsesjonuję się detalami i bardzo zależy mi na tym, jak rzeczy <em>czuje się</em> w użyciu, a nie tylko jak wyglądają.",
    about_p3: "Kiedy nie piszę kodu, zazwyczaj gubię się w Cyberpunk 2077, buduję coś absurdalnego w Minecrafcie albo losowo odkrywam nowe gry.",
    about_p4: "Mówię w kilku językach. Aktualnie uczę się upraszczać rzeczy.",
  },

  // ── Turkish ───────────────────────────────────────────────────────────────
  tr: {
    toggle_theme: "Temayı değiştir",
    bio: "Sadelik ve kullanılabilirliğe odaklanan programcı.",
    verified: "Doğrulanmış profil",
    music_listening: "Dinliyor",
    music_last_played: "Son çalınan",
    music_loading_track: "Parça yükleniyor...",
    music_checking: "Last.fm kontrol ediliyor",
    music_open_lastfm: "Last.fm'de aç",
    music_now_playing_aria: "Last.fm aracılığıyla Spotify'da çalıyor",
    music_art_alt: "Mevcut parçanın kapak resmi",
    music_idle_aria: "Müzik boşta",
    music_label: "Müzik",
    music_nothing: "Şu an çalan bir şey yok",
    music_fallback_hint: "Last.fm bir parça tespit ettiği anda burada otomatik olarak görünecek.",
    discord_activity_aria: "Discord aktivitesi",
    discord_music_status_aria: "Müzik durumu",
    activity_playing: "Oynuyor",
    activity_streaming: "Yayın yapıyor",
    activity_listening: "Dinliyor",
    activity_watching: "İzliyor",
    activity_custom: "Özel durum",
    activity_competing: "Yarışıyor",
    activity_elapsed: "geçti",
    activity_unknown: "Bilinmiyor",
    btn_about: "Hakkımda",
    btn_follow: "Takip et",
    btn_follow_aria: "Discord'da takip et",
    about_aria: "Akemi hakkında",
    about_back: "Geri",
    about_back_aria: "Profile dön",
    about_heading: "Hey, ben Akemi.",
    about_p1: "Brezilya'da yaşayan 22 yaşında bir geliştirici. 2016'dan beri kod yazıyorum; çoğunlukla meraktan ve bir şeylerin gerçekten çalışana kadar üzerlerine takılıp kalma eğilimimden.",
    about_p2: "Nörodiverjantım ve bu, nasıl inşa ettiğimi şekillendiriyor: sistemler halinde düşünüyor, detaylara takılıyor ve şeylerin nasıl <em>hissettirdiğine</em>, sadece nasıl göründüğüne değil, çok önem veriyorum.",
    about_p3: "Kod yazmadığımda genellikle Cyberpunk 2077'de kaybolmuş, Minecraft'ta saçma sapan bir şeyler inşa ediyor ya da rastgele oyunlar keşfediyorum.",
    about_p4: "Birçok dil konuşuyorum. Şu sıralar şeyleri daha sade yapmayı öğreniyorum.",
  },

  // ── Arabic (RTL) ──────────────────────────────────────────────────────────
  ar: {
    toggle_theme: "تبديل المظهر",
    bio: "مبرمجة تركّز على البساطة وسهولة الاستخدام.",
    verified: "ملف شخصي موثّق",
    music_listening: "يستمع الآن",
    music_last_played: "آخر تشغيل",
    music_loading_track: "جارٍ التحميل...",
    music_checking: "جارٍ التحقق من Last.fm",
    music_open_lastfm: "فتح على Last.fm",
    music_now_playing_aria: "يُشغَّل الآن على Spotify عبر Last.fm",
    music_art_alt: "غلاف المسار الحالي",
    music_idle_aria: "الموسيقى في وضع الخمول",
    music_label: "موسيقى",
    music_nothing: "لا يوجد شيء يُشغَّل الآن",
    music_fallback_hint: "بمجرد اكتشاف Last.fm لمسار، سيظهر هنا تلقائيًا.",
    discord_activity_aria: "نشاط Discord",
    discord_music_status_aria: "حالة الموسيقى",
    activity_playing: "يلعب",
    activity_streaming: "يبث مباشرةً",
    activity_listening: "يستمع إلى",
    activity_watching: "يشاهد",
    activity_custom: "حالة مخصصة",
    activity_competing: "يتنافس في",
    activity_elapsed: "مضى",
    activity_unknown: "غير معروف",
    btn_about: "نبذة عني",
    btn_follow: "تابعني",
    btn_follow_aria: "تابع على Discord",
    about_aria: "نبذة عن Akemi",
    about_back: "رجوع",
    about_back_aria: "العودة إلى الملف الشخصي",
    about_heading: "مرحبًا، أنا Akemi.",
    about_p1: "مطوّرة في الثانية والعشرين من عمري، مقيمة في البرازيل. أكتب الكود منذ عام 2016، مدفوعةً في الغالب بالفضول وميلي إلى التركيز المفرط على الأشياء حتى تعمل بالشكل الصحيح.",
    about_p2: "أنا من ذوي العقول المختلفة (نيوروداييفرجنت)، وهذا يشكّل أسلوب بنائي: أفكّر بمنطق الأنظمة، أهوس بالتفاصيل، وأهتم كثيرًا بكيفية <em>الشعور</em> باستخدام الأشياء، لا بكيف تبدو فحسب.",
    about_p3: "حين لا أكون أكتب كودًا، أكون عادةً ضائعة في Cyberpunk 2077، أو أبني شيئًا سخيفًا في Minecraft، أو أجرّب ألعابًا عشوائية.",
    about_p4: "أتحدث عدة لغات. أتعلم حاليًا كيف أجعل الأشياء أبسط.",
  },
};

// ── Language detection ───────────────────────────────────────────────────────

const SUPPORTED = new Set(Object.keys(translations));
const FALLBACK = "pt";
const RTL_LANGS = new Set(["ar"]);

/**
 * Detect the visitor's preferred language from navigator.languages / navigator.language.
 * Returns a 2-letter code (e.g. "pt", "en", "ar").
 */
function detectLanguage() {
  const candidates = [];

  if (Array.isArray(navigator.languages) && navigator.languages.length) {
    candidates.push(...navigator.languages);
  } else if (navigator.language) {
    candidates.push(navigator.language);
  }

  for (const raw of candidates) {
    // Normalize: "pt-BR" → "pt", "zh-CN" → "zh", "en-US" → "en"
    const code = raw.toLowerCase().split(/[-_]/)[0];
    if (SUPPORTED.has(code)) return code;
  }

  return FALLBACK;
}

// ── Translation accessor ─────────────────────────────────────────────────────

const lang = detectLanguage();
const dict = translations[lang] || translations[FALLBACK];

/**
 * Get a translation string by key.
 * Falls back to English, then Portuguese if key is missing in current lang.
 */
function t(key) {
  return dict[key]
    ?? translations[FALLBACK][key]
    ?? `[${key}]`;
}

// ── Apply to DOM ─────────────────────────────────────────────────────────────

function applyTranslations() {
  const htmlEl = document.documentElement;

  // Set lang attribute and RTL direction
  htmlEl.setAttribute("lang", lang);
  if (RTL_LANGS.has(lang)) {
    htmlEl.setAttribute("dir", "rtl");
  } else {
    htmlEl.removeAttribute("dir");
  }

  // Apply data-i18n (textContent)
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const value = t(key);
    if (key === "about_p2") {
      // Allow <em> tag
      el.innerHTML = value;
    } else {
      el.textContent = value;
    }
  });

  // Apply data-i18n-aria (aria-label)
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    const key = el.getAttribute("data-i18n-aria");
    el.setAttribute("aria-label", t(key));
  });
}

// Apply immediately if DOM is ready, otherwise wait
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", applyTranslations);
} else {
  applyTranslations();
}

// ── Public API ───────────────────────────────────────────────────────────────

export { t, lang, translations, SUPPORTED, RTL_LANGS };

// Also expose on window for non-module scripts
window.__i18n = { t, lang, translations };
