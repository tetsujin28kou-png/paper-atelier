if (typeof document === 'undefined') {
  // Node.js/Vercel Serverless environment
  // Prevent execution of browser-only code
} else {
const STORAGE_KEY = "paperAtelierState.v2";
const LEGACY_STORAGE_KEY = "paperAtelierState.v1";
const PROJECT_INDEX_KEY = "paperAtelierProjects.v1";
const ACTIVE_PROJECT_KEY = "paperAtelierActiveProject.v1";
const PROJECT_STATE_PREFIX = "paperAtelierProject:";
const SNAPSHOT_PREFIX = "paperAtelierSnapshot:";

const fieldProfiles = {
  history: {
    label: "教育思想史研究",
    lens: "思想家・制度・受容史・時代文脈",
    focus: [
      "一次資料の成立時期、版、翻訳、引用箇所を区別する",
      "思想を現在の用語で言い換える前に、当時の語彙と問題状況を押さえる",
      "先行研究がどの時代区分、受容経路、資料群を重視してきたかを比較する",
      "思想家の内在的理解と教育史上の位置づけを分けて記述する"
    ],
    review: [
      "一次資料と二次資料が明確に区別されている",
      "時代錯誤的な概念の投影を避ける説明がある",
      "引用した語の原語、訳語、文脈を確認している",
      "思想家個人の議論と制度史上の位置づけを混同していない",
      "先行研究との差分が資料読解に基づいて示されている",
      "結論が単なる紹介ではなく、解釈上の貢献になっている"
    ]
  },
  philosophy: {
    label: "教育哲学研究",
    lens: "概念分析・規範的主張・反論可能性",
    focus: [
      "中心概念を定義するだけでなく、なぜその定義が必要かを述べる",
      "規範的主張と記述的主張を混ぜずに段落ごとに役割を分ける",
      "想定反論を置き、どの前提を守り、どの前提を修正するかを明確にする",
      "教育実践への含意は、理念から直接飛ばさず媒介概念を置いて示す"
    ],
    review: [
      "中心概念の定義が途中で変わっていない",
      "記述、解釈、規範的評価の役割が区別されている",
      "反論可能な形で主張が提示されている",
      "先行研究の立場を弱く作りすぎていない",
      "実践への含意が単なるスローガンになっていない",
      "結論で主張の射程と限界を明記している"
    ]
  },
  art: {
    label: "美術教育学研究",
    lens: "作品・実践・鑑賞・カリキュラム",
    focus: [
      "作品、教材、授業記録、学習者の制作過程を分析単位として明確にする",
      "造形的特徴と教育的意味づけを分けて記述してから接続する",
      "実践報告に留めず、学習観、表現観、鑑賞観の理論的位置を示す",
      "カリキュラム、評価、教師の働きかけへの含意を検討する"
    ],
    review: [
      "作品や実践の具体的記述が理論の例示だけで終わっていない",
      "造形的分析と教育学的考察が接続されている",
      "授業者、学習者、教材の関係が明確に扱われている",
      "研究倫理やデータ利用の説明が必要に応じて入っている",
      "カリキュラムや評価への含意が過度に一般化されていない",
      "図版、作品画像、授業記録の扱いに権利・匿名性の配慮がある"
    ]
  },
  cross: {
    label: "横断研究",
    lens: "思想・概念・実践の接続",
    focus: [
      "思想史、哲学、美術教育学のどの方法を組み合わせるのかを明示する",
      "一次資料、概念分析、実践分析が同じ問いに向かっているか確認する",
      "方法の混在が単なる並列にならないよう、橋渡し概念を置く",
      "各領域の読者が納得できる貢献の言い方を準備する"
    ],
    review: [
      "横断する理由が研究対象から説明されている",
      "方法が並列ではなく、一つの問いに向けて統合されている",
      "中心概念が各領域で同じ意味として乱用されていない",
      "個別事例から一般的含意へ進む手順が明確である",
      "想定読者ごとの貢献が過不足なく述べられている",
      "結論で残された課題と次の研究可能性を示している"
    ]
  }
};

const paperPatterns = {
  higuchi: {
    label: "思想史・再定位型",
    source: "樋口勘次郎論文に近い型",
    summary: "現代的な教育問題から入り、固定化した先行解釈を一次資料の概念読解で組み替える。",
    moves: [
      "現代の教育課題を置き、対象思想を読み直す必要を示す",
      "先行研究の定説を紹介し、説明しきれない矛盾や連続性を取り出す",
      "中心概念の用法を一次資料に戻って読み、周辺思想や同時代知へ接続する",
      "理論と実践の両方を検討し、思想史上の位置づけを言い直す"
    ],
    outline: [
      ["はじめに", "現代的問題、対象思想、先行研究の定説、問いを提示する"],
      ["基本構想", "対象思想の中心概念と初期の理論枠組みを整理する"],
      ["再定位の焦点", "従来は矛盾とされた点を、資料読解から連続性として検討する"],
      ["周辺概念・同時代知", "翻訳、心理学、宗教、制度などの接続点を分析する"],
      ["理論と実践", "教授法、学校実践、具体例における中心概念の働きを確認する"],
      ["おわりに", "定説の修正点、思想史上の意義、現代教育への含意を述べる"]
    ]
  },
  forum: {
    label: "美術教育・モデル提案型",
    source: "リサーチフォーラム概要原稿に近い型",
    summary: "美術教育の実践的困難を受け、理論概念を組み合わせて学習モデルとして提案する。",
    moves: [
      "既存の問題提起を引き受け、扱う論点を複数に整理する",
      "実践上の困難を、制度、教師、子どもの経験の緊張として言語化する",
      "リフレクション、ABR、経験などの理論をモデル構築の部品として置く",
      "モデルの構成理念、教師の判断、評価・カリキュラム上の含意を示す"
    ],
    outline: [
      ["はじめに", "研究会や先行論稿の問題提起を受け、扱う論点を明示する"],
      ["理論的枠組み", "リフレクション、ABR、経験概念などを整理する"],
      ["モデルの提案", "学習モデルの基本理念、構成要素、教師の役割を示す"],
      ["運用可能性", "授業、評価、安全管理、カリキュラム上の扱いを検討する"],
      ["おわりに", "モデルの意義、限界、実践研究への次の課題を述べる"]
    ]
  },
  bridge: {
    label: "概念架橋型",
    source: "教育思想史・教育哲学・美術教育学をつなぐ型",
    summary: "思想史的な概念読解を、美術教育の実践や作品経験を説明する理論へ橋渡しする。",
    moves: [
      "思想史上の概念と美術教育上の実践課題を一つの問いに結びつける",
      "概念の成立文脈を確認し、現在の教育実践へ移すときの条件を示す",
      "作品、教材、授業記録を使い、概念が実践をどう照らすか分析する",
      "哲学的主張を、カリキュラムや教師の判断へ翻訳する"
    ],
    outline: [
      ["導入", "思想史的概念と美術教育上の実践課題を一つの問いとして提示する"],
      ["概念の系譜", "中心概念の成立文脈、定義、先行研究上の争点を整理する"],
      ["実践への接続条件", "概念を現代の授業や作品経験へ移す際の前提を示す"],
      ["事例分析", "作品、教材、授業記録に即して概念の説明力を検討する"],
      ["教育哲学的考察", "規範的含意、教師の判断、評価の問題を論じる"],
      ["結論", "横断によって見えた美術教育学上の貢献を述べる"]
    ]
  }
};

const workflowSteps = [
  ["theme", "テーマ設定・問いの設定", "問い、対象、中心概念、意義、新規性を一文で説明できる状態にする"],
  ["overview", "概要", "テーマ、問い、目的、方法、意義を短い概要として接続する"],
  ["outline", "論証構造・アウトライン", "各節が、主張、根拠、反論処理、次節への接続を持つようにする"],
  ["references", "参考文献の整理", "各節に必要な一次資料、先行研究、反論用文献を割り当てる"],
  ["literature", "先行研究の整理", "研究状況、先行研究の限界、本研究の独自性を叩き台にする"],
  ["outlineCheck", "アウトラインの点検", "先行研究の課題から論証構造を見直し、弱い節を補強する"],
  ["draft", "本文の編集", "節単位で編集し、必要な箇所に引用・参照を挿入する"],
  ["review", "査読", "査読観点で弱点を洗い出し、修正メモを節ごとに残す"],
  ["proofread", "校正", "引用、固有名、年号、論理接続、パラグラフ機能を確認する"],
  ["export", "出力", "Word、Markdown、JSONとして書き出す"]
];

const styleGuideItems = [
  {
    title: "序論の入り方",
    body: "現代的な教育課題を置き、すぐに研究対象へ飛ばず、その課題がなぜ対象思想や美術教育実践の再検討を要請するのかを段階的に示す。"
  },
  {
    title: "先行研究との差分",
    body: "先行研究を否定するより、共有されてきた評価や到達点を確認したうえで、それだけでは説明しきれない点を取り出す。"
  },
  {
    title: "論証の接続句",
    body: "「しかし」「では、なぜ」「以上を踏まえ」などを節の転換点に置き、読者に論理の向きを見失わせない。"
  },
  {
    title: "文体の調子",
    body: "断定は資料や先行研究で支え、解釈は射程を明示する。紹介文ではなく、問い、根拠、解釈、含意が順に進む文章にする。"
  }
];

const paragraphRoleDefs = {
  today: {
    label: "今日的課題",
    className: "role-today",
    description: "現在の教育課題や社会的背景を提示する"
  },
  problem: {
    label: "問題提起",
    className: "role-problem",
    description: "論文テーマに関わる問いや緊張関係を示す"
  },
  purposeSetup: {
    label: "目的設定への導入",
    className: "role-purpose-setup",
    description: "研究目的へ進むために論点を絞り込む"
  },
  literature: {
    label: "先行研究の整理",
    className: "role-literature",
    description: "研究状況、到達点、主要立場を整理する"
  },
  gap: {
    label: "先行研究の限界",
    className: "role-gap",
    description: "先行研究の課題、未検討点、説明不足を示す"
  },
  originality: {
    label: "本研究の独自性",
    className: "role-originality",
    description: "先行研究との差異化と本稿の貢献を示す"
  },
  purpose: {
    label: "本研究の目的",
    className: "role-purpose",
    description: "本稿が何を明らかにするかを明示する"
  },
  method: {
    label: "本研究の方法",
    className: "role-method",
    description: "資料、分析視角、方法論を説明する"
  },
  procedure: {
    label: "本研究の手順",
    className: "role-procedure",
    description: "章構成、分析順序、検討手順を示す"
  },
  analysis: {
    label: "分析・解釈",
    className: "role-analysis",
    description: "資料や実践の分析から主張を支える"
  },
  transition: {
    label: "接続・小結",
    className: "role-transition",
    description: "前段の整理、次節への接続、暫定結論を示す"
  },
  unset: {
    label: "未判定",
    className: "role-unset",
    description: "役割を手動で選ぶ"
  }
};

const els = {};
let state = createDefaultState();
let activeProjectId = "";

document.addEventListener("DOMContentLoaded", () => {
  cacheElements();
  loadState();
  bindEvents();
  syncForm();
  renderAll();
  registerServiceWorker();
});

function createDefaultState() {
  const firstArgumentId = uid();
  return {
    paperTitle: "",
    field: "history",
    paperPattern: "auto",
    stage: "theme",
    materials: "",
    concepts: "",
    question: "",
    claim: "",
    theme: {
      candidates: [
        {
          id: uid(),
          title: "",
          question: "",
          fit: ""
        }
      ],
      significance: "",
      novelty: "",
      audience: ""
    },
    overviewText: "",
    sources: [createSource()],
    literatureQuery: "",
    searchResults: [],
    literatureDraft: "",
    arguments: [
      {
        id: firstArgumentId,
        title: "はじめに",
        role: "問題設定、先行研究、問いを提示する",
        claim: "",
        evidence: "",
        counter: "",
        gap: "",
        sources: [],
        body: "",
        reviewerNote: "",
        revisionPlan: "",
        status: "draft"
      }
    ],
    activeArgumentId: firstArgumentId,
    paragraphRoles: {},
    reviewChecks: {},
    abstractText: "",
    aiMessages: [],
    finalCheckMemo: "",
    lastVerification: ""
  };
}

function createSource() {
  return {
    id: uid(),
    author: "",
    year: "",
    title: "",
    type: "先行研究",
    position: "",
    method: "",
    finding: "",
    limitation: "",
    quote: "",
    citation: "",
    argumentId: ""
  };
}

function createArgument(title = "新しい節", role = "この節の役割を記入する") {
  return {
    id: uid(),
    title,
    role,
    claim: "",
    evidence: "",
    counter: "",
    gap: "",
    sources: [],
    body: "",
    reviewerNote: "",
    revisionPlan: "",
    status: "draft"
  };
}

function cacheElements() {
  [
    "paperTitle",
    "field",
    "paperPattern",
    "stage",
    "materials",
    "concepts",
    "question",
    "claim",
    "saveProject",
    "resetProject",
    "projectSelect",
    "newProject",
    "duplicateProject",
    "saveSnapshot",
    "importJson",
    "importJsonFile",
    "snapshotList",
    "copyShareUrl",
    "shareHint",
    "fieldEyebrow",
    "workspaceTitle",
    "copyPrompt",
    "exportDocx",
    "exportDocxFinal",
    "workflowBoard",
    "styleGuide",
    "overviewText",
    "generateOverview",
    "themeCandidates",
    "addThemeCandidate",
    "significance",
    "novelty",
    "audience",
    "academicQuery",
    "searchPapers",
    "generateLiteratureDraft",
    "copyLiteraturePrompt",
    "searchResults",
    "literatureDraft",
    "sourceRows",
    "addSource",
    "readingFocus",
    "argumentCards",
    "generateOutline",
    "addArgument",
    "verifyOutline",
    "robustnessPanel",
    "sectionList",
    "activeSectionTitle",
    "sectionBody",
    "insertStyleSentence",
    "citationButtons",
    "sectionDiagnostics",
    "reanalyzeParagraphs",
    "paragraphMap",
    "runPeerReview",
    "peerReviewReport",
    "revisionChecklist",
    "abstractText",
    "generateAbstract",
    "runFinalCheck",
    "finalCheckReport",
    "stepAdvice",
    "exportChecklist",
    "exportMarkdown",
    "exportJson",
    "aiModelLabel",
    "aiMessages",
    "askStepAdvice",
    "askDraftHelp",
    "aiUserInput",
    "sendAiMessage",
    "toast"
  ].forEach((id) => {
    els[id] = document.getElementById(id);
  });
}

function bindEvents() {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => activateTab(tab.dataset.tab));
  });

  ["paperTitle", "field", "paperPattern", "stage", "materials", "concepts", "question", "claim"].forEach((id) => {
    els[id].addEventListener("input", () => {
      state[id] = els[id].value;
      renderAll();
      persistQuietly();
    });
  });

  ["significance", "novelty", "audience"].forEach((id) => {
    els[id].addEventListener("input", () => {
      state.theme[id] = els[id].value;
      renderWorkflow();
      persistQuietly();
    });
  });

  els.abstractText.addEventListener("input", () => {
    state.abstractText = els.abstractText.value;
    persistQuietly();
  });

  els.overviewText.addEventListener("input", () => {
    state.overviewText = els.overviewText.value;
    renderWorkflow();
    renderStepAdvice();
    persistQuietly();
  });

  els.academicQuery.addEventListener("input", () => {
    state.literatureQuery = els.academicQuery.value;
    persistQuietly();
  });

  els.literatureDraft.addEventListener("input", () => {
    state.literatureDraft = els.literatureDraft.value;
    persistQuietly();
  });

  els.sectionBody.addEventListener("input", () => {
    const active = activeArgument();
    if (!active) return;
    active.body = els.sectionBody.value;
    renderSectionDiagnostics();
    renderParagraphMap();
    renderWorkflow();
    persistQuietly();
  });

  els.saveProject.addEventListener("click", () => {
    persist();
    showToast("保存しました");
  });

  els.projectSelect.addEventListener("change", () => switchProject(els.projectSelect.value));
  els.newProject.addEventListener("click", createNewProject);
  els.duplicateProject.addEventListener("click", duplicateCurrentProject);
  els.saveSnapshot.addEventListener("click", saveSnapshot);
  els.importJson.addEventListener("click", () => els.importJsonFile.click());
  els.importJsonFile.addEventListener("change", importJsonProject);
  els.snapshotList.addEventListener("click", handleSnapshotClick);

  els.resetProject.addEventListener("click", () => {
    if (!confirm("入力内容を初期状態に戻しますか。")) return;
    state = createDefaultState();
    syncForm();
    renderAll();
    persist();
    showToast("初期化しました");
  });

  els.copyShareUrl.addEventListener("click", () => copyText(location.href, "現在のURLをコピーしました"));
  els.copyPrompt.addEventListener("click", () => copyText(makeAiPrompt(), "AI相談プロンプトをコピーしました"));
  els.exportDocx.addEventListener("click", exportDocx);
  els.exportDocxFinal.addEventListener("click", exportDocx);
  els.exportMarkdown.addEventListener("click", exportMarkdown);
  els.exportJson.addEventListener("click", exportJson);
  els.generateOverview.addEventListener("click", generateOverview);
  els.addThemeCandidate.addEventListener("click", () => {
    state.theme.candidates.push({ id: uid(), title: "", question: "", fit: "" });
    renderThemeCandidates();
    persistQuietly();
  });
  els.addSource.addEventListener("click", () => {
    state.sources.push(createSource());
    renderSources();
    persistQuietly();
  });
  els.searchPapers.addEventListener("click", searchAcademicPapers);
  els.generateLiteratureDraft.addEventListener("click", generateLiteratureDraft);
  els.copyLiteraturePrompt.addEventListener("click", () => copyText(makeLiteraturePrompt(), "先行研究整理のAI相談文をコピーしました"));
  els.generateOutline.addEventListener("click", generateOutlineFromPattern);
  els.addArgument.addEventListener("click", () => {
    const arg = createArgument();
    state.arguments.push(arg);
    state.activeArgumentId = arg.id;
    renderOutlineWorkspace();
    renderWritingWorkspace();
    persistQuietly();
  });
  els.verifyOutline.addEventListener("click", verifyOutlineAgainstSources);
  els.insertStyleSentence.addEventListener("click", insertStyleSentence);
  els.reanalyzeParagraphs.addEventListener("click", reanalyzeParagraphs);
  els.runPeerReview.addEventListener("click", runPeerReview);
  els.generateAbstract.addEventListener("click", generateAbstract);
  els.runFinalCheck.addEventListener("click", runFinalCheck);
  els.askStepAdvice.addEventListener("click", () => askAi("advice"));
  els.askDraftHelp.addEventListener("click", () => askAi("draft"));
  els.sendAiMessage.addEventListener("click", () => askAi("custom"));

  els.themeCandidates.addEventListener("input", handleThemeInput);
  els.themeCandidates.addEventListener("click", handleThemeClick);
  els.searchResults.addEventListener("click", handleSearchResultClick);
  els.sourceRows.addEventListener("input", handleSourceInput);
  els.sourceRows.addEventListener("change", handleSourceInput);
  els.sourceRows.addEventListener("click", handleSourceClick);
  els.argumentCards.addEventListener("input", handleArgumentInput);
  els.argumentCards.addEventListener("change", handleArgumentInput);
  els.argumentCards.addEventListener("click", handleArgumentClick);
  els.sectionList.addEventListener("click", handleSectionListClick);
  els.citationButtons.addEventListener("click", handleCitationClick);
  els.paragraphMap.addEventListener("change", handleParagraphRoleChange);
  els.revisionChecklist.addEventListener("change", handleRevisionCheck);
}

function activateTab(tabId) {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.tab === tabId);
  });
  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.classList.toggle("is-active", panel.id === tabId);
  });
  if (tabId === "writing") syncActiveSectionEditor();
  renderStepAdvice();
  renderAiMessages();
}

function loadState() {
  ensureProjectStore();
  const projects = loadProjectIndex();
  activeProjectId = localStorage.getItem(ACTIVE_PROJECT_KEY) || (projects[0] && projects[0].id) || "";
  if (!projects.some((project) => project.id === activeProjectId)) {
    activeProjectId = projects[0] && projects[0].id;
  }
  state = loadProjectState(activeProjectId);
}

function ensureProjectStore() {
  const projects = loadProjectIndex();
  if (projects.length > 0) return;
  let imported = createDefaultState();
  const legacy = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
  if (legacy) {
    try {
      imported = normalizeState(JSON.parse(legacy));
    } catch {
      imported = createDefaultState();
    }
  }
  const id = uid();
  const now = new Date().toISOString();
  const meta = {
    id,
    title: projectTitle(imported),
    field: imported.field,
    stage: imported.stage,
    createdAt: now,
    updatedAt: now,
    snapshots: []
  };
  saveProjectIndex([meta]);
  localStorage.setItem(projectStateKey(id), JSON.stringify(imported));
  localStorage.setItem(ACTIVE_PROJECT_KEY, id);
}

function loadProjectIndex() {
  try {
    const parsed = JSON.parse(localStorage.getItem(PROJECT_INDEX_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveProjectIndex(projects) {
  localStorage.setItem(PROJECT_INDEX_KEY, JSON.stringify(projects));
}

function projectStateKey(id) {
  return `${PROJECT_STATE_PREFIX}${id}`;
}

function snapshotStateKey(projectId, snapshotId) {
  return `${SNAPSHOT_PREFIX}${projectId}:${snapshotId}`;
}

function loadProjectState(projectId) {
  if (!projectId) return createDefaultState();
  try {
    const saved = localStorage.getItem(projectStateKey(projectId));
    return saved ? normalizeState(JSON.parse(saved)) : createDefaultState();
  } catch {
    return createDefaultState();
  }
}

function updateActiveProjectMeta() {
  if (!activeProjectId) return;
  const projects = loadProjectIndex();
  const now = new Date().toISOString();
  const next = projects.map((project) =>
    project.id === activeProjectId
      ? {
          ...project,
          title: projectTitle(state),
          field: state.field,
          stage: state.stage,
          updatedAt: now
        }
      : project
  );
  saveProjectIndex(next);
}

function projectTitle(projectState = state) {
  return clean(projectState.paperTitle) || clean(projectState.question) || "無題の研究";
}

function switchProject(projectId) {
  if (!projectId || projectId === activeProjectId) return;
  persistQuietly();
  activeProjectId = projectId;
  localStorage.setItem(ACTIVE_PROJECT_KEY, activeProjectId);
  state = loadProjectState(activeProjectId);
  syncForm();
  renderAll();
  showToast("研究プロジェクトを切り替えました");
}

function createNewProject() {
  persistQuietly();
  const id = uid();
  const now = new Date().toISOString();
  const newState = createDefaultState();
  const projects = loadProjectIndex();
  projects.unshift({
    id,
    title: projectTitle(newState),
    field: newState.field,
    stage: newState.stage,
    createdAt: now,
    updatedAt: now,
    snapshots: []
  });
  saveProjectIndex(projects);
  localStorage.setItem(projectStateKey(id), JSON.stringify(newState));
  activeProjectId = id;
  localStorage.setItem(ACTIVE_PROJECT_KEY, id);
  state = newState;
  syncForm();
  renderAll();
  showToast("新しい研究プロジェクトを作成しました");
}

function duplicateCurrentProject() {
  persistQuietly();
  const id = uid();
  const now = new Date().toISOString();
  const copied = normalizeState(JSON.parse(JSON.stringify(state)));
  copied.paperTitle = `${projectTitle(copied)}（コピー）`;
  const projects = loadProjectIndex();
  projects.unshift({
    id,
    title: projectTitle(copied),
    field: copied.field,
    stage: copied.stage,
    createdAt: now,
    updatedAt: now,
    snapshots: []
  });
  saveProjectIndex(projects);
  localStorage.setItem(projectStateKey(id), JSON.stringify(copied));
  activeProjectId = id;
  localStorage.setItem(ACTIVE_PROJECT_KEY, id);
  state = copied;
  syncForm();
  renderAll();
  showToast("現在の研究を複製しました");
}

function saveSnapshot() {
  if (!activeProjectId) return;
  persistQuietly();
  const snapshotId = uid();
  const now = new Date().toISOString();
  localStorage.setItem(snapshotStateKey(activeProjectId, snapshotId), JSON.stringify(state));
  const projects = loadProjectIndex();
  const next = projects.map((project) => {
    if (project.id !== activeProjectId) return project;
    const snapshots = [
      {
        id: snapshotId,
        label: projectTitle(state),
        createdAt: now
      },
      ...(project.snapshots || [])
    ].slice(0, 12);
    return { ...project, snapshots, updatedAt: now, title: projectTitle(state) };
  });
  saveProjectIndex(next);
  renderProjectHub();
  showToast("途中経過を保存しました");
}

function handleSnapshotClick(event) {
  const button = event.target.closest("[data-restore-snapshot]");
  if (!button) return;
  const snapshotId = button.dataset.restoreSnapshot;
  const saved = localStorage.getItem(snapshotStateKey(activeProjectId, snapshotId));
  if (!saved) {
    showToast("保存点が見つかりません");
    return;
  }
  if (!confirm("この途中保存の状態に戻しますか。現在の状態は自動保存されています。")) return;
  persistQuietly();
  state = normalizeState(JSON.parse(saved));
  localStorage.setItem(projectStateKey(activeProjectId), JSON.stringify(state));
  syncForm();
  renderAll();
  showToast("途中保存の状態を復元しました");
}

async function importJsonProject(event) {
  const file = event.target.files && event.target.files[0];
  event.target.value = "";
  if (!file) return;
  try {
    const text = await file.text();
    const imported = normalizeState(JSON.parse(text));
    persistQuietly();
    const id = uid();
    const now = new Date().toISOString();
    const projects = loadProjectIndex();
    projects.unshift({
      id,
      title: projectTitle(imported),
      field: imported.field,
      stage: imported.stage,
      createdAt: now,
      updatedAt: now,
      snapshots: []
    });
    saveProjectIndex(projects);
    localStorage.setItem(projectStateKey(id), JSON.stringify(imported));
    activeProjectId = id;
    localStorage.setItem(ACTIVE_PROJECT_KEY, id);
    state = imported;
    syncForm();
    renderAll();
    showToast("JSONから研究プロジェクトを読み込みました");
  } catch (error) {
    console.error(error);
    showToast("JSONを読み込めませんでした");
  }
}

function normalizeState(saved) {
  const base = createDefaultState();
  const next = { ...base, ...saved };
  next.theme = { ...base.theme, ...(saved.theme || {}) };
  if (!Array.isArray(next.theme.candidates) || next.theme.candidates.length === 0) {
    next.theme.candidates = base.theme.candidates;
  }
  next.sources = normalizeSources(saved.sources || base.sources);
  next.overviewText = saved.overviewText || "";
  next.literatureQuery = saved.literatureQuery || "";
  next.searchResults = Array.isArray(saved.searchResults) ? saved.searchResults : [];
  next.literatureDraft = saved.literatureDraft || "";
  next.arguments = normalizeArguments(saved.arguments || [], next);
  if (next.arguments.length === 0) {
    next.arguments = createArgumentsFromPattern(next);
  }
  if (!next.activeArgumentId || !next.arguments.some((arg) => arg.id === next.activeArgumentId)) {
    next.activeArgumentId = next.arguments[0].id;
  }
  next.paragraphRoles = saved.paragraphRoles || {};
  next.reviewChecks = saved.reviewChecks || {};
  next.abstractText = saved.abstractText || "";
  next.aiMessages = Array.isArray(saved.aiMessages) ? saved.aiMessages : [];
  next.finalCheckMemo = saved.finalCheckMemo || "";
  return next;
}

function normalizeSources(sources) {
  return sources.map((source) => ({
    id: source.id || uid(),
    author: source.author || "",
    year: source.year || "",
    title: source.title || source.material || "",
    type: source.type || "先行研究",
    position: source.position || source.point || "",
    method: source.method || "",
    finding: source.finding || source.use || "",
    limitation: source.limitation || "",
    quote: source.quote || "",
    citation: source.citation || "",
    argumentId: source.argumentId || ""
  }));
}

function normalizeArguments(argumentsList, currentState) {
  if (Array.isArray(argumentsList) && argumentsList.length > 0) {
    return argumentsList.map((arg) => ({
      ...createArgument(),
      ...arg,
      id: arg.id || uid(),
      sources: Array.isArray(arg.sources) ? arg.sources : [],
      body: arg.body || ""
    }));
  }
  if (currentState.draftText) {
    const first = createArgument("本文メモ", "旧版で入力した本文を引き継いだ節");
    first.body = currentState.draftText;
    return [first];
  }
  return [];
}

function syncForm() {
  ["paperTitle", "field", "paperPattern", "stage", "materials", "concepts", "question", "claim"].forEach((id) => {
    els[id].value = state[id] ?? "";
  });
  els.significance.value = state.theme.significance || "";
  els.novelty.value = state.theme.novelty || "";
  els.audience.value = state.theme.audience || "";
  els.overviewText.value = state.overviewText || "";
  els.academicQuery.value = state.literatureQuery || "";
  els.literatureDraft.value = state.literatureDraft || "";
  els.abstractText.value = state.abstractText || "";
  syncActiveSectionEditor();
}

function renderAll() {
  renderProjectHub();
  renderHeader();
  renderShareHint();
  renderWorkflow();
  renderStyleGuide();
  renderThemeCandidates();
  renderSearchResults();
  renderSources();
  renderReadingFocus();
  renderOutlineWorkspace();
  renderWritingWorkspace();
  renderPeerReviewReport();
  renderRevisionChecklist();
  renderFinalCheckReport();
  renderStepAdvice();
  renderExportChecklist();
  renderAiMessages();
}

function renderHeader() {
  els.fieldEyebrow.textContent = currentProfile().label;
  const title = clean(state.paperTitle);
  els.workspaceTitle.textContent = title || "テーマからWord出力までを一つの流れに";
}

function renderProjectHub() {
  const projects = loadProjectIndex();
  els.projectSelect.innerHTML = projects
    .map((project) => {
      const label = `${project.title || "無題の研究"} / ${fieldLabel(project.field)} / ${shortDate(project.updatedAt)}`;
      return `<option value="${project.id}" ${project.id === activeProjectId ? "selected" : ""}>${escapeHtml(label)}</option>`;
    })
    .join("");

  const active = projects.find((project) => project.id === activeProjectId);
  const snapshots = (active && active.snapshots) || [];
  if (snapshots.length === 0) {
    els.snapshotList.innerHTML = `<p class="snapshot-empty">途中保存はまだありません。</p>`;
    return;
  }
  els.snapshotList.innerHTML = snapshots
    .slice(0, 5)
    .map(
      (snapshot) => `
        <article class="snapshot-item">
          <div>
            <strong>${escapeHtml(snapshot.label || "保存点")}</strong>
            <span>${escapeHtml(formatDateTime(snapshot.createdAt))}</span>
          </div>
          <button type="button" class="small-button" data-restore-snapshot="${snapshot.id}">復元</button>
        </article>
      `
    )
    .join("");
}

function renderShareHint() {
  const host = location.hostname;
  if (host && !["127.0.0.1", "localhost", "::1"].includes(host)) {
    els.shareHint.textContent = `この端末のURLは ${location.href} です。同じWi-Fi上のスマホで開けます。`;
  } else if (location.protocol.startsWith("http")) {
    els.shareHint.textContent = "PCではこのURLで使えます。スマホでは server.mjs に表示された「スマホ: http://...」のURLを開いてください。";
  } else {
    els.shareHint.textContent = "スマホ共有は server.mjs で起動します。起動後に表示される http:// から始まるURLをスマホで開きます。";
  }
}

function renderWorkflow() {
  const progress = workflowProgress();
  els.workflowBoard.innerHTML = workflowSteps
    .map(([key, title, body], index) => {
      const done = progress[key];
      return `
        <article class="workflow-step ${done ? "is-done" : ""}">
          <span class="step-number">${done ? "✓" : index + 1}</span>
          <div>
            <h4>${escapeHtml(title)}</h4>
            <p>${escapeHtml(body)}</p>
          </div>
          <span class="status-pill ${done ? "is-done" : "is-warning"}">${done ? "完了" : "未完"}</span>
        </article>
      `;
    })
    .join("");
}

function workflowProgress() {
  const hasTheme = clean(state.paperTitle) && clean(state.question) && clean(state.claim);
  const hasOverview = clean(state.overviewText).length > 120;
  const hasOutline = state.arguments.length > 1 && state.arguments.every((arg) => clean(arg.title) && clean(arg.role));
  const hasRefs = state.arguments.every((arg) => linkedSources(arg).length > 0 || state.sources.some((source) => source.argumentId === arg.id));
  const hasLiterature = clean(state.literatureDraft).length > 160 || state.sources.some((source) => clean(source.author) && (clean(source.finding) || clean(source.limitation)));
  const hasVerified = state.arguments.every((arg) => clean(arg.gap) || clean(arg.counter));
  const hasDraft = state.arguments.some((arg) => clean(arg.body).length > 250);
  const hasReview = state.arguments.some((arg) => clean(arg.reviewerNote));
  const hasProofread = clean(state.finalCheckMemo).length > 0;
  const hasExport = hasDraft && (clean(state.abstractText).length > 120 || hasProofread);
  return {
    theme: Boolean(hasTheme),
    overview: Boolean(hasOverview),
    outline: Boolean(hasOutline),
    references: Boolean(hasRefs),
    literature: Boolean(hasLiterature),
    outlineCheck: Boolean(hasVerified),
    draft: Boolean(hasDraft),
    review: Boolean(hasReview),
    proofread: Boolean(hasProofread),
    export: Boolean(hasExport)
  };
}

function renderStyleGuide() {
  const pattern = currentPattern();
  const cards = [
    {
      title: pattern.label,
      body: `${pattern.source}。${pattern.summary}`
    },
    ...styleGuideItems,
    {
      title: "論証の動き",
      body: pattern.moves.join(" → ")
    }
  ];
  els.styleGuide.innerHTML = cards
    .map(
      (card) => `
        <article class="style-card">
          <h4>${escapeHtml(card.title)}</h4>
          <p>${escapeHtml(card.body)}</p>
        </article>
      `
    )
    .join("");
}

function generateOverview() {
  state.overviewText = makeOverviewDraft();
  els.overviewText.value = state.overviewText;
  renderWorkflow();
  renderStepAdvice();
  persistQuietly();
  showToast("概要案を作成しました");
}

function makeOverviewDraft() {
  const title = clean(state.paperTitle) || "本研究";
  const question = clean(state.question) || "本稿の問い";
  const materials = clean(state.materials) || "対象資料";
  const concepts = clean(state.concepts) || "中心概念";
  const claim = clean(state.claim) || "本稿の主張";
  const significance = clean(state.theme.significance) || "今日的な教育課題";
  const novelty = clean(state.theme.novelty) || "先行研究では十分に説明されてこなかった点";
  return [
    `${title}は、${significance}を背景として、${question}を検討するものである。`,
    `本研究では、${materials}を主たる対象とし、${concepts}の用法と教育学的含意を分析する。`,
    `先行研究の到達点を踏まえつつ、${novelty}に注目することで、${claim}という見通しを提示する。`
  ].join("\n\n");
}

function renderStepAdvice() {
  if (!els.stepAdvice) return;
  const step = currentStepId();
  const notes = localAdviceForStep(step);
  els.stepAdvice.innerHTML = notes.map((body) => `<article class="advice-card is-note"><p>${escapeHtml(body)}</p></article>`).join("");
}

function renderExportChecklist() {
  if (!els.exportChecklist) return;
  const progress = workflowProgress();
  const items = workflowSteps.map(([key, title]) => `${progress[key] ? "完了" : "未完"}: ${title}`);
  els.exportChecklist.innerHTML = items
    .map((item) => `<article class="advice-card ${item.startsWith("完了") ? "is-good" : "is-warning"}"><p>${escapeHtml(item)}</p></article>`)
    .join("");
}

function currentStepId() {
  const active = document.querySelector(".tab.is-active");
  return active ? active.dataset.tab : "theme";
}

function localAdviceForStep(step) {
  const advice = {
    theme: [
      "まず、論文タイトル、研究対象、中心概念、暫定的な問い、主張の核を埋めてください。問いは「何を、どの資料から、どの視角で明らかにするか」の形に寄せると後工程へつながります。",
      "テーマ候補には、資料の入手可能性、先行研究との差分、教育学的意義の3点をメモしておくと、次の概要が作りやすくなります。"
    ],
    overview: [
      "概要は、今日的課題、問い、対象資料、方法、独自性、暫定結論が一続きに読めることが重要です。",
      "前工程の入力から概要案を作り、曖昧な語を中心概念に置き換えてください。"
    ],
    outline: [
      "各節に「この節の主張」「根拠」「想定反論」「先行研究の課題から見た補強点」を入れてください。",
      "アウトラインは章題の一覧ではなく、読者を結論へ運ぶ論証の順路として点検します。"
    ],
    references: [
      "参考文献は、背景、定説、反論、一次資料、方法論のどれに使うのかを分けて登録してください。",
      "各節に必要文献を割り当てると、本文編集で引用候補として出てきます。"
    ],
    literature: [
      "検索結果をそのまま羅列せず、研究状況、到達点、限界、本研究の差異化に分けて叩き台を作ってください。",
      "AI相談では、検索結果と登録文献をまとめて渡すと、先行研究整理の段落案を作れます。"
    ],
    "outline-check": [
      "先行研究の限界からアウトラインを逆向きに点検します。弱い節には反論処理か資料根拠を追加してください。",
      "堅牢度が低い場合は、根拠文献がない節、反論がない節、先行研究との差分がない節から直すのが近道です。"
    ],
    writing: [
      "本文は節ごとに書き、パラグラフ機能マップで今日的課題、問題提起、先行研究、限界、目的、方法、手順が見えるか確認してください。",
      "右の引用ボタンから必要文献を挿入し、紹介文ではなく論証文になるよう接続語を調整します。"
    ],
    review: [
      "査読では、問いの焦点、先行研究との差分、資料根拠、反論可能性、結論の射程を優先して見ます。",
      "修正方針は節ごとに残し、本文に戻って直す場所を明確にしてください。"
    ],
    proofread: [
      "校正では、固有名、年号、引用ページ、訳語、論理接続、段落機能の不足を確認します。",
      "要旨は本文が固まったあとに、問い、方法、結果、意義の順で作成してください。"
    ],
    export: [
      "出力前に、未完の工程が残っていないか確認してください。Word出力は本文、要旨、文献リストをまとめて書き出します。",
      "別端末へ移す場合はJSONも保存しておくと、途中状態のバックアップになります。"
    ]
  };
  return advice[step] || advice.theme;
}

function renderThemeCandidates() {
  els.themeCandidates.innerHTML = state.theme.candidates
    .map(
      (candidate, index) => `
        <article class="theme-card">
          <div class="source-actions">
            <h4>テーマ候補 ${index + 1}</h4>
            <button class="row-button" type="button" data-remove-theme="${candidate.id}" title="削除">×</button>
          </div>
          <label>
            候補タイトル
            <input value="${escapeAttr(candidate.title)}" data-theme="${candidate.id}" data-key="title" placeholder="例: 造形遊びにおける安全な逸脱" />
          </label>
          <label>
            研究問い
            <textarea data-theme="${candidate.id}" data-key="question" placeholder="このテーマで何を明らかにするか">${escapeHtml(candidate.question)}</textarea>
          </label>
          <label>
            適合理由・不安点
            <textarea data-theme="${candidate.id}" data-key="fit" placeholder="資料、先行研究、独自性、実現可能性の観点でメモ">${escapeHtml(candidate.fit)}</textarea>
          </label>
        </article>
      `
    )
    .join("");
}

function handleThemeInput(event) {
  const id = event.target.dataset.theme;
  const key = event.target.dataset.key;
  if (!id || !key) return;
  const candidate = state.theme.candidates.find((item) => item.id === id);
  if (!candidate) return;
  candidate[key] = event.target.value;
  persistQuietly();
}

function handleThemeClick(event) {
  const id = event.target.dataset.removeTheme;
  if (!id) return;
  state.theme.candidates = state.theme.candidates.filter((item) => item.id !== id);
  if (state.theme.candidates.length === 0) {
    state.theme.candidates.push({ id: uid(), title: "", question: "", fit: "" });
  }
  renderThemeCandidates();
  persistQuietly();
}

async function searchAcademicPapers() {
  const query = clean(state.literatureQuery) || [state.paperTitle, state.concepts, state.materials].map(clean).filter(Boolean).join(" ");
  if (!query) {
    showToast("検索語を入力してください");
    return;
  }
  els.searchPapers.disabled = true;
  els.searchPapers.querySelector("span:last-child").textContent = "検索中";
  try {
    const url = `https://api.openalex.org/works?search=${encodeURIComponent(query)}&filter=type:article&per-page=8&sort=relevance_score:desc`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`OpenAlex error: ${response.status}`);
    const data = await response.json();
    state.searchResults = (data.results || []).map(normalizeOpenAlexWork);
    renderSearchResults();
    generateLiteratureDraft(false);
    persistQuietly();
    showToast(`${state.searchResults.length}件の論文候補を取得しました`);
  } catch (error) {
    console.error(error);
    showToast("検索に失敗しました。通信環境を確認してください");
  } finally {
    els.searchPapers.disabled = false;
    els.searchPapers.querySelector("span:last-child").textContent = "検索";
  }
}

function normalizeOpenAlexWork(work) {
  const authors = (work.authorships || [])
    .slice(0, 3)
    .map((item) => item.author && item.author.display_name)
    .filter(Boolean);
  const abstract = abstractFromInvertedIndex(work.abstract_inverted_index);
  return {
    id: work.id || uid(),
    title: work.title || "",
    year: work.publication_year || "",
    authors,
    venue: (work.primary_location && work.primary_location.source && work.primary_location.source.display_name) || "",
    doi: work.doi || "",
    citedBy: work.cited_by_count || 0,
    abstract,
    url: work.doi || work.id || ""
  };
}

function abstractFromInvertedIndex(index) {
  if (!index) return "";
  const words = [];
  Object.entries(index).forEach(([word, positions]) => {
    positions.forEach((position) => {
      words[position] = word;
    });
  });
  return words.join(" ").replace(/\s+([,.!?;:])/g, "$1");
}

function renderSearchResults() {
  if (!state.searchResults || state.searchResults.length === 0) {
    els.searchResults.innerHTML = `<article class="advice-card is-note"><p>検索すると、ここに論文候補が表示されます。取り込むと先行研究マトリクスへ追加されます。</p></article>`;
    return;
  }
  els.searchResults.innerHTML = state.searchResults
    .map(
      (result, index) => `
        <article class="result-card">
          <p class="meta">${escapeHtml([result.authors.join(", "), result.year, result.venue].filter(Boolean).join(" / "))}</p>
          <h4>${escapeHtml(result.title || "タイトル不明")}</h4>
          <p>${escapeHtml(shorten(result.abstract || "抄録情報は取得できませんでした。", 220))}</p>
          <div class="button-row">
            <button class="small-button" type="button" data-import-result="${index}">取り込む</button>
            ${result.url ? `<a class="small-button" href="${escapeAttr(result.url)}" target="_blank" rel="noreferrer">開く</a>` : ""}
          </div>
        </article>
      `
    )
    .join("");
}

function handleSearchResultClick(event) {
  const button = event.target.closest("[data-import-result]");
  if (!button) return;
  const result = state.searchResults[Number(button.dataset.importResult)];
  if (!result) return;
  state.sources.push({
    ...createSource(),
    author: result.authors[0] || "",
    year: String(result.year || ""),
    title: result.title || "",
    type: "先行研究",
    finding: result.abstract ? shorten(result.abstract, 240) : "",
    limitation: "本研究の対象・資料・方法との関係から、扱いきれていない点を確認する。",
    position: result.venue ? `掲載誌・媒体: ${result.venue}` : "",
    citation: [result.authors[0], result.year].filter(Boolean).join(" ")
  });
  renderSources();
  renderWorkflow();
  persistQuietly();
  showToast("先行研究マトリクスに取り込みました");
}

function generateLiteratureDraft(showMessage = true) {
  const items = state.sources
    .filter((source) => clean(source.author) || clean(source.title) || clean(source.finding))
    .slice(0, 8);
  const results = (state.searchResults || []).slice(0, 5);
  const researchState = items.length
    ? items.map((source) => `${sourceLabel(source)}は、${clean(source.finding) || clean(source.position) || "関連する論点を提示している"}`).join("。")
    : results.map((result) => `${result.authors[0] || "関連研究"}（${result.year || "年不明"}）は、${result.title}を扱っている`).join("。");
  const limitations = items
    .map((source) => clean(source.limitation))
    .filter(Boolean)
    .slice(0, 4)
    .join("。");
  state.literatureDraft = [
    `先行研究の整理として、${researchState || "検索結果と登録文献をもとに研究状況を整理する必要がある"}。`,
    `しかし、${limitations || "これらの研究が本稿の対象資料、中心概念、教育実践上の条件をどこまで扱っているかは、なお検討を要する"}。`,
    `したがって本研究は、${clean(state.question) || "本稿の問い"}を検討することで、${clean(state.claim) || "先行研究との差異化された見通し"}を示す点に独自性を持つ。`
  ].join("\n\n");
  els.literatureDraft.value = state.literatureDraft;
  persistQuietly();
  if (showMessage) showToast("先行研究整理の叩き台を作成しました");
}

function makeLiteraturePrompt() {
  const results = (state.searchResults || [])
    .map((result, index) => `${index + 1}. ${result.authors.join(", ")} (${result.year || "n.d."}) ${result.title}. ${result.venue || ""} ${result.abstract ? `Abstract: ${shorten(result.abstract, 500)}` : ""}`)
    .join("\n");
  const sources = state.sources
    .map((source, index) => `${index + 1}. ${sourceLabel(source)} ${source.title}\n到達点: ${source.finding || "未入力"}\n限界: ${source.limitation || "未入力"}`)
    .join("\n\n");
  return [
    "以下の検索結果と登録文献をもとに、教育学系論文の先行研究整理の叩き台を作成してください。",
    "文体は硬質な学術論文調にし、研究状況、先行研究の限界、本研究のオリジナリティが順に見えるようにしてください。",
    "",
    `論文テーマ: ${clean(state.paperTitle) || "未定"}`,
    `問い: ${clean(state.question) || "未定"}`,
    `主張: ${clean(state.claim) || "未定"}`,
    `対象・一次資料: ${clean(state.materials) || "未定"}`,
    `中心概念: ${clean(state.concepts) || "未定"}`,
    "",
    "検索結果:",
    results || "なし",
    "",
    "登録文献:",
    sources || "なし",
    "",
    "出力形式:",
    "1. 先行研究の研究状況",
    "2. 先行研究の限界と課題",
    "3. 本研究のオリジナリティ",
    "4. アウトラインのどの節にどの文献を置くべきか"
  ].join("\n");
}

function renderSources() {
  const argOptions = [`<option value="">未割当</option>`]
    .concat(state.arguments.map((arg) => `<option value="${arg.id}">${escapeHtml(arg.title || "無題の節")}</option>`))
    .join("");

  els.sourceRows.innerHTML = state.sources
    .map(
      (source, index) => `
        <article class="source-card">
          <label class="medium">
            著者
            <input value="${escapeAttr(source.author)}" data-source="${source.id}" data-key="author" placeholder="例: Dewey" />
          </label>
          <label class="small">
            年
            <input value="${escapeAttr(source.year)}" data-source="${source.id}" data-key="year" placeholder="1934" />
          </label>
          <label class="medium">
            種別
            <select data-source="${source.id}" data-key="type">
              ${["先行研究", "一次資料", "作品・教材", "授業記録", "反論用文献"].map((type) => `<option value="${type}" ${source.type === type ? "selected" : ""}>${type}</option>`).join("")}
            </select>
          </label>
          <label class="full">
            文献・資料名
            <input value="${escapeAttr(source.title)}" data-source="${source.id}" data-key="title" placeholder="書名、論文名、作品、授業記録など" />
          </label>
          <label class="wide">
            到達点・主張
            <textarea data-source="${source.id}" data-key="finding" placeholder="この文献は何を明らかにしたか">${escapeHtml(source.finding)}</textarea>
          </label>
          <label class="wide">
            残された課題
            <textarea data-source="${source.id}" data-key="limitation" placeholder="この文献では扱いきれていない点">${escapeHtml(source.limitation)}</textarea>
          </label>
          <label class="wide">
            方法・視角
            <textarea data-source="${source.id}" data-key="method" placeholder="思想史、概念分析、実践分析など">${escapeHtml(source.method)}</textarea>
          </label>
          <label class="wide">
            使い方
            <textarea data-source="${source.id}" data-key="position" placeholder="背景、定説、反論、分析対象、引用根拠など">${escapeHtml(source.position)}</textarea>
          </label>
          <label class="wide">
            引用メモ
            <textarea data-source="${source.id}" data-key="quote" placeholder="短い引用、ページ、使う文脈">${escapeHtml(source.quote)}</textarea>
          </label>
          <label class="medium">
            引用表記
            <input value="${escapeAttr(source.citation)}" data-source="${source.id}" data-key="citation" placeholder="例: Dewey 1934: 45" />
          </label>
          <label class="small">
            必要な節
            <select data-source="${source.id}" data-key="argumentId">
              ${argOptions.replace(`value="${source.argumentId}"`, `value="${source.argumentId}" selected`)}
            </select>
          </label>
          <div class="source-actions">
            <span class="status-pill">${index + 1}</span>
            <button class="row-button" type="button" data-remove-source="${source.id}" title="削除">×</button>
          </div>
        </article>
      `
    )
    .join("");
}

function handleSourceInput(event) {
  const id = event.target.dataset.source;
  const key = event.target.dataset.key;
  if (!id || !key) return;
  const source = state.sources.find((item) => item.id === id);
  if (!source) return;
  source[key] = event.target.value;
  if (key === "argumentId" && source.argumentId) {
    const arg = state.arguments.find((item) => item.id === source.argumentId);
    if (arg && !arg.sources.includes(source.id)) arg.sources.push(source.id);
    renderOutlineWorkspace();
    renderCitationButtons();
  }
  renderWorkflow();
  persistQuietly();
}

function handleSourceClick(event) {
  const id = event.target.dataset.removeSource;
  if (!id) return;
  state.sources = state.sources.filter((source) => source.id !== id);
  state.arguments.forEach((arg) => {
    arg.sources = arg.sources.filter((sourceId) => sourceId !== id);
  });
  if (state.sources.length === 0) state.sources.push(createSource());
  renderSources();
  renderOutlineWorkspace();
  renderCitationButtons();
  persistQuietly();
}

function renderReadingFocus() {
  els.readingFocus.innerHTML = currentProfile().focus.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function renderOutlineWorkspace() {
  renderArgumentCards();
  renderRobustnessPanel();
}

function renderArgumentCards() {
  els.argumentCards.innerHTML = state.arguments
    .map((arg, index) => {
      const sources = renderSourceChips(arg);
      return `
        <article class="argument-card ${arg.id === state.activeArgumentId ? "is-active" : ""}">
          <div class="argument-actions">
            <h4>${index + 1}. ${escapeHtml(arg.title || "無題の節")}</h4>
            <div class="button-row">
              <button class="small-button" type="button" data-focus-argument="${arg.id}">本文へ</button>
              <button class="row-button" type="button" data-remove-argument="${arg.id}" title="削除">×</button>
            </div>
          </div>
          <div class="argument-fields">
            <label>
              節タイトル
              <input value="${escapeAttr(arg.title)}" data-argument="${arg.id}" data-key="title" />
            </label>
            <label>
              節の役割
              <input value="${escapeAttr(arg.role)}" data-argument="${arg.id}" data-key="role" />
            </label>
            <label class="full">
              この節の主張
              <textarea data-argument="${arg.id}" data-key="claim">${escapeHtml(arg.claim)}</textarea>
            </label>
            <label>
              根拠・資料
              <textarea data-argument="${arg.id}" data-key="evidence">${escapeHtml(arg.evidence)}</textarea>
            </label>
            <label>
              想定反論・別解釈
              <textarea data-argument="${arg.id}" data-key="counter">${escapeHtml(arg.counter)}</textarea>
            </label>
            <label class="full">
              先行研究の課題から見た補強点
              <textarea data-argument="${arg.id}" data-key="gap">${escapeHtml(arg.gap)}</textarea>
            </label>
          </div>
          <div>
            <p class="eyebrow">必要文献</p>
            <div class="source-chip-list">${sources}</div>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderSourceChips(arg) {
  if (state.sources.length === 0) return `<span class="source-chip">文献未登録</span>`;
  return state.sources
    .map((source) => {
      const checked = arg.sources.includes(source.id) || source.argumentId === arg.id ? "checked" : "";
      return `
        <label class="source-chip">
          <input type="checkbox" data-argument="${arg.id}" data-source-link="${source.id}" ${checked} />
          <span>${escapeHtml(sourceLabel(source))}</span>
        </label>
      `;
    })
    .join("");
}

function handleArgumentInput(event) {
  const argId = event.target.dataset.argument;
  if (!argId) return;
  const arg = state.arguments.find((item) => item.id === argId);
  if (!arg) return;
  if (event.target.dataset.sourceLink) {
    const sourceId = event.target.dataset.sourceLink;
    if (event.target.checked && !arg.sources.includes(sourceId)) arg.sources.push(sourceId);
    if (!event.target.checked) arg.sources = arg.sources.filter((id) => id !== sourceId);
  } else if (event.target.dataset.key) {
    arg[event.target.dataset.key] = event.target.value;
  }
  renderRobustnessPanel();
  renderWritingWorkspace();
  renderWorkflow();
  persistQuietly();
}

function handleArgumentClick(event) {
  const focusId = event.target.dataset.focusArgument;
  if (focusId) {
    state.activeArgumentId = focusId;
    activateTab("writing");
    renderWritingWorkspace();
    persistQuietly();
    return;
  }
  const removeId = event.target.dataset.removeArgument;
  if (!removeId) return;
  if (state.arguments.length === 1) {
    showToast("節は最低1つ必要です");
    return;
  }
  state.arguments = state.arguments.filter((arg) => arg.id !== removeId);
  state.sources.forEach((source) => {
    if (source.argumentId === removeId) source.argumentId = "";
  });
  if (state.activeArgumentId === removeId) state.activeArgumentId = state.arguments[0].id;
  renderAll();
  persistQuietly();
}

function generateOutlineFromPattern() {
  const hasBody = state.arguments.some((arg) => clean(arg.body));
  if (hasBody && !confirm("既存のアウトラインを型から作り直しますか。本文は失われませんが、節構成は置き換わります。")) {
    return;
  }
  const oldBodies = state.arguments.map((arg) => clean(arg.body)).filter(Boolean);
  state.arguments = createArgumentsFromPattern(state);
  oldBodies.forEach((body, index) => {
    if (state.arguments[index]) state.arguments[index].body = body;
  });
  state.activeArgumentId = state.arguments[0].id;
  renderAll();
  persistQuietly();
  showToast("論文の型からアウトラインを生成しました");
}

function createArgumentsFromPattern(currentState = state) {
  const pattern = currentPattern(currentState);
  return pattern.outline.map(([title, role]) => createArgument(title, role));
}

function verifyOutlineAgainstSources() {
  state.arguments.forEach((arg) => {
    const relevant = linkedSources(arg);
    const limitations = relevant.map((source) => clean(source.limitation)).filter(Boolean);
    if (!clean(arg.gap) && limitations.length > 0) {
      arg.gap = `先行研究の課題として、${limitations.slice(0, 2).join("、")}が残る。本節ではこの不足を、${clean(arg.claim) || "本節の主張"}に接続して補強する。`;
    }
    if (!clean(arg.counter)) {
      arg.counter = "別解釈、資料の読み替え、過度な一般化の可能性を確認する。";
    }
  });
  state.lastVerification = new Date().toISOString();
  renderOutlineWorkspace();
  renderWorkflow();
  persistQuietly();
  showToast("先行研究の課題からアウトラインを検証しました");
}

function renderRobustnessPanel() {
  const score = robustnessScore();
  const notes = robustnessNotes();
  els.robustnessPanel.innerHTML = `
    <div class="robustness-score">
      <strong>${score}%</strong>
      <div class="score-bar"><span style="width: ${score}%"></span></div>
      <p class="eyebrow">論証構造の堅牢度</p>
    </div>
    ${notes
      .map(
        (note) => `
          <article class="metric-card">
            <h4>${escapeHtml(note.title)}</h4>
            <p>${escapeHtml(note.body)}</p>
          </article>
        `
      )
      .join("")}
  `;
}

function robustnessScore() {
  if (state.arguments.length === 0) return 0;
  const total = state.arguments.length * 5;
  const achieved = state.arguments.reduce((sum, arg) => {
    return (
      sum +
      Number(Boolean(clean(arg.title))) +
      Number(Boolean(clean(arg.claim))) +
      Number(Boolean(clean(arg.evidence) || linkedSources(arg).length > 0)) +
      Number(Boolean(clean(arg.counter))) +
      Number(Boolean(clean(arg.gap)))
    );
  }, 0);
  return Math.round((achieved / total) * 100);
}

function robustnessNotes() {
  const noSource = state.arguments.filter((arg) => linkedSources(arg).length === 0);
  const noCounter = state.arguments.filter((arg) => !clean(arg.counter));
  const noGap = state.arguments.filter((arg) => !clean(arg.gap));
  const notes = [];
  notes.push({
    title: "節数",
    body: `${state.arguments.length}節で構成されています。各節が主張を持ち、前後の節に接続しているか確認します。`
  });
  if (noSource.length) {
    notes.push({
      title: "文献不足",
      body: `${noSource.length}節に必要文献が割り当てられていません。先行研究・一次資料マトリクスから節へ結びつけてください。`
    });
  }
  if (noCounter.length) {
    notes.push({
      title: "反論処理",
      body: `${noCounter.length}節で反論・別解釈の検討が未記入です。査読ではここが弱点になりやすいです。`
    });
  }
  if (noGap.length) {
    notes.push({
      title: "先行研究の課題",
      body: `${noGap.length}節で、先行研究の課題から見た補強点が未記入です。アウトライン検証を実行すると補助できます。`
    });
  }
  if (notes.length === 1) {
    notes.push({
      title: "状態",
      body: "主張、根拠、反論、先行研究との接続が整っています。次は本文節で引用と文章展開を確認します。"
    });
  }
  return notes;
}

function renderWritingWorkspace() {
  renderSectionList();
  syncActiveSectionEditor();
  renderCitationButtons();
  renderSectionDiagnostics();
  renderParagraphMap();
}

function renderSectionList() {
  els.sectionList.innerHTML = state.arguments
    .map((arg, index) => {
      const chars = clean(arg.body).length;
      return `
        <button type="button" class="section-button ${arg.id === state.activeArgumentId ? "is-active" : ""}" data-select-section="${arg.id}">
          <strong>${index + 1}. ${escapeHtml(arg.title || "無題の節")}</strong>
          <span>${chars}字 / ${linkedSources(arg).length}文献</span>
        </button>
      `;
    })
    .join("");
}

function handleSectionListClick(event) {
  const button = event.target.closest("[data-select-section]");
  if (!button) return;
  state.activeArgumentId = button.dataset.selectSection;
  renderWritingWorkspace();
  persistQuietly();
}

function syncActiveSectionEditor() {
  const active = activeArgument();
  if (!active || !els.sectionBody) return;
  els.activeSectionTitle.textContent = active.title || "本文";
  if (els.sectionBody.value !== active.body) {
    els.sectionBody.value = active.body || "";
  }
}

function renderCitationButtons() {
  const active = activeArgument();
  if (!active) return;
  const sources = linkedSources(active);
  const pool = sources.length ? sources : state.sources.filter((source) => clean(source.author) || clean(source.title));
  if (pool.length === 0) {
    els.citationButtons.innerHTML = `<article class="advice-card is-warning"><p>文献を登録すると、ここから本文へ引用表記を挿入できます。</p></article>`;
    return;
  }
  els.citationButtons.innerHTML = pool
    .map(
      (source) => `
        <button type="button" class="citation-button" data-insert-citation="${source.id}">
          <strong>${escapeHtml(citationLabel(source))}</strong>
          <span>${escapeHtml(source.quote || source.title || "引用メモ未入力")}</span>
        </button>
      `
    )
    .join("");
}

function handleCitationClick(event) {
  const button = event.target.closest("[data-insert-citation]");
  if (!button) return;
  const source = state.sources.find((item) => item.id === button.dataset.insertCitation);
  if (!source) return;
  insertAtCursor(els.sectionBody, `（${citationLabel(source)}）`);
  const active = activeArgument();
  if (active) active.body = els.sectionBody.value;
  renderSectionDiagnostics();
  renderSectionList();
  persistQuietly();
}

function insertStyleSentence() {
  const active = activeArgument();
  if (!active) return;
  const sentence = styleSentenceFor(active);
  insertAtCursor(els.sectionBody, sentence);
  active.body = els.sectionBody.value;
  renderSectionDiagnostics();
  renderSectionList();
  persistQuietly();
}

function styleSentenceFor(arg) {
  if (arg.title.includes("はじめ") || arg.title.includes("導入")) {
    return `本節では、${clean(state.question) || "本稿の問い"}を検討するために、まず${clean(state.materials) || "対象資料"}を取り上げる必要を確認する。`;
  }
  if (arg.title.includes("おわり") || arg.title.includes("結論")) {
    return `以上の検討から、${clean(state.claim) || "本稿の主張"}という点が明らかになる。`;
  }
  return `では、なぜこの点が${currentProfile().label}にとって重要なのか。本節では、${clean(arg.claim) || "この節の主張"}を資料と先行研究の双方から検討する。`;
}

function renderSectionDiagnostics() {
  const active = activeArgument();
  if (!active) return;
  const text = clean(active.body);
  const citations = citationCount(text);
  const notes = [];
  if (!text) {
    notes.push(["is-warning", "この節はまだ空です。節の主張、資料、先行研究との差分の順で書き始めると流れを作りやすいです。"]);
  } else {
    if (text.length < 400) notes.push(["is-note", "節としては短めです。主張、根拠、解釈、次節への接続が揃っているか確認してください。"]);
    if (citations === 0) notes.push(["is-warning", "引用・参照表記が見つかりません。必要に応じて右の文献ボタンから挿入してください。"]);
    if (!/しかし|では|以上|一方|したがって|このよう/.test(text)) {
      notes.push(["is-note", "論理の転換や接続を示す語が少なめです。サンプル論文のように節の転換点を明示すると読みやすくなります。"]);
    }
    if (linkedSources(active).length === 0) notes.push(["is-warning", "この節に必要文献が割り当てられていません。論証検証タブで文献を結びつけてください。"]);
    const coverage = paragraphCoverage(active);
    if (coverage.missing.length > 0 && active.title.includes("はじめ")) {
      notes.push(["is-warning", `序論で不足しやすい機能: ${coverage.missing.map((role) => paragraphRoleDefs[role].label).join("、")}。パラグラフ機能マップで確認してください。`]);
    }
  }
  if (notes.length === 0) {
    notes.push(["is-good", "節の長さ、引用、接続語の簡易チェックは整っています。次は査読タブで反論可能性を見ます。"]);
  }
  els.sectionDiagnostics.innerHTML = notes.map(([kind, body]) => `<article class="advice-card ${kind}"><p>${escapeHtml(body)}</p></article>`).join("");
}

function renderParagraphMap() {
  const active = activeArgument();
  if (!active) return;
  const paragraphs = splitParagraphs(active.body || "");
  if (paragraphs.length === 0) {
    els.paragraphMap.innerHTML = `<article class="advice-card is-note"><p>本文を書くと、パラグラフごとの論証機能を色分けして表示します。</p></article>`;
    return;
  }
  els.paragraphMap.innerHTML = paragraphs
    .map((paragraph, index) => {
      const role = paragraphRoleFor(active, paragraph, index);
      const def = paragraphRoleDefs[role] || paragraphRoleDefs.unset;
      return `
        <article class="paragraph-card ${def.className}">
          <header>
            <strong>${index + 1}. ${escapeHtml(def.label)}</strong>
            <span class="status-pill">${paragraph.length}字</span>
          </header>
          <p>${escapeHtml(def.description)}</p>
          <select data-paragraph-role="${active.id}:${index}">
            ${Object.entries(paragraphRoleDefs)
              .map(([key, item]) => `<option value="${key}" ${key === role ? "selected" : ""}>${item.label}</option>`)
              .join("")}
          </select>
          <p class="paragraph-excerpt">${escapeHtml(paragraph)}</p>
        </article>
      `;
    })
    .join("");
}

function handleParagraphRoleChange(event) {
  const key = event.target.dataset.paragraphRole;
  if (!key) return;
  state.paragraphRoles[key] = event.target.value;
  renderParagraphMap();
  renderSectionDiagnostics();
  persistQuietly();
}

function reanalyzeParagraphs() {
  const active = activeArgument();
  if (!active) return;
  Object.keys(state.paragraphRoles).forEach((key) => {
    if (key.startsWith(`${active.id}:`)) delete state.paragraphRoles[key];
  });
  renderParagraphMap();
  renderSectionDiagnostics();
  persistQuietly();
  showToast("パラグラフ機能を再判定しました");
}

function paragraphRoleFor(arg, paragraph, index) {
  const key = `${arg.id}:${index}`;
  if (state.paragraphRoles[key]) return state.paragraphRoles[key];
  return classifyParagraph(paragraph, index);
}

function classifyParagraph(paragraph, index) {
  const text = clean(paragraph);
  if (!text) return "unset";
  if (/今日|現在|現行|近年|現代|学校教育|教育現場|社会/.test(text) && index <= 1) return "today";
  if (/しかし|一方で|十分ではない|言い難い|未検討|限界|課題/.test(text)) return "gap";
  if (/独自|新規|本研究の意義|差異|再定位|提案/.test(text)) return "originality";
  if (/以上を踏まえ|これらを踏まえ|そこで|この点を踏まえ/.test(text)) return "purposeSetup";
  if (/第一|第二|第三|手順|構成|まず|次に|最後に|以下/.test(text)) return "procedure";
  if (/方法|資料|対象|分析|視角|枠組み|テクスト|授業記録/.test(text)) return "method";
  if (/本稿では|本研究では|本報告では|目的|明らかにする|検討する/.test(text)) return index <= 3 ? "purpose" : "analysis";
  if (/先行研究|従来|既往研究|研究の系譜|蓄積|評価されてきた/.test(text)) return "literature";
  if (/問題|課題|問う|なぜ|にもかかわらず|緊張/.test(text)) return "problem";
  if (/以上|したがって|このように|結論|小括/.test(text)) return "transition";
  return index === 0 ? "today" : "analysis";
}

function paragraphCoverage(arg) {
  const paragraphs = splitParagraphs(arg.body || "");
  const roles = paragraphs.map((paragraph, index) => paragraphRoleFor(arg, paragraph, index));
  const expected = ["today", "problem", "literature", "gap", "originality", "purpose", "method", "procedure"];
  return {
    roles,
    missing: expected.filter((role) => !roles.includes(role))
  };
}

function runPeerReview() {
  state.arguments.forEach((arg) => {
    const problems = [];
    if (!clean(arg.claim)) problems.push("節の主張が明確でない");
    if (linkedSources(arg).length === 0) problems.push("根拠となる文献・資料が割り当てられていない");
    if (!clean(arg.counter)) problems.push("反論・別解釈への応答が弱い");
    if (citationCount(arg.body) === 0) problems.push("本文中の引用・参照が不足している");
    if (!/先行研究|従来|既往研究|本稿|本報告/.test(arg.body)) problems.push("先行研究との関係や本稿の立場が本文に出ていない");
    arg.reviewerNote = problems.length ? problems.join("。") + "。" : "大きな弱点は見当たりません。節末で次節への接続をさらに明確にしてください。";
    arg.revisionPlan = problems.length
      ? "主張を一文で置き、必要文献を本文に引用し、反論可能性を一段落追加する。"
      : "細部の表記、引用ページ、接続語を確認する。";
  });
  renderPeerReviewReport();
  renderRevisionChecklist();
  renderWorkflow();
  persistQuietly();
  showToast("査読メモを作成しました");
}

function renderPeerReviewReport() {
  els.peerReviewReport.innerHTML = state.arguments
    .map(
      (arg, index) => `
        <article class="review-card">
          <h4>${index + 1}. ${escapeHtml(arg.title || "無題の節")}</h4>
          <p><strong>査読コメント:</strong> ${escapeHtml(arg.reviewerNote || "未査読です。")}</p>
          <p><strong>修正方針:</strong> ${escapeHtml(arg.revisionPlan || "未設定です。")}</p>
        </article>
      `
    )
    .join("");
}

function renderRevisionChecklist() {
  const checks = [
    "序論で、現代的問題から研究対象へ移る必然性が示されている",
    "先行研究の到達点と課題が、各節の論証に結びついている",
    "一次資料・作品・授業記録の記述が、解釈の根拠として機能している",
    "反論・別解釈・過度な一般化への応答がある",
    "引用ページ、年号、固有名、訳語を確認している",
    "結論で、研究領域への貢献と限界が明確に述べられている"
  ];
  els.revisionChecklist.innerHTML = checks
    .map((item, index) => {
      const id = `revision-${index}`;
      return `
        <article class="review-item">
          <label>
            <input type="checkbox" data-review-check="${id}" ${state.reviewChecks[id] ? "checked" : ""} />
            <span>${escapeHtml(item)}</span>
          </label>
        </article>
      `;
    })
    .join("");
}

function handleRevisionCheck(event) {
  const id = event.target.dataset.reviewCheck;
  if (!id) return;
  state.reviewChecks[id] = event.target.checked;
  persistQuietly();
}

function generateAbstract() {
  const material = clean(state.materials) || "対象資料";
  const concepts = clean(state.concepts) || "中心概念";
  const question = clean(state.question) || "本稿の問い";
  const claim = clean(state.claim) || "本稿の主張";
  const method = currentPattern().label;
  state.abstractText = [
    `本稿は、${material}を手がかりに、${concepts}をめぐる問題を検討する。`,
    `先行研究は重要な到達点を示してきたが、${question}という点にはなお検討の余地がある。`,
    `そこで本稿では、${method}の方法により、先行研究の課題を踏まえて論証構造を組み直す。`,
    `その結果、${claim}という見通しを提示し、${currentProfile().label}における対象理解の再考を試みる。`
  ].join("");
  els.abstractText.value = state.abstractText;
  renderWorkflow();
  persistQuietly();
  showToast("要旨を作成しました");
}

function runFinalCheck() {
  const notes = finalCheckNotes();
  state.finalCheckMemo = notes.map((note) => note.body).join("\n");
  renderFinalCheckReport();
  renderWorkflow();
  persistQuietly();
  showToast("ファクトチェック・校正メモを更新しました");
}

function renderFinalCheckReport() {
  const notes = state.finalCheckMemo ? finalCheckNotes() : [["is-note", "仕上げ段階で点検を実行すると、引用、年号、固有名、論理接続の確認項目を表示します。"]];
  els.finalCheckReport.innerHTML = notes.map(([kind, body]) => `<article class="advice-card ${kind}"><p>${escapeHtml(body)}</p></article>`).join("");
}

function finalCheckNotes() {
  const fullText = fullPaperText();
  const notes = [];
  const yearMentions = fullText.match(/(?:18|19|20)\d{2}/g) || [];
  const citations = citationCount(fullText);
  const sourceCitations = state.sources.filter((source) => clean(source.author) && clean(source.year)).length;
  if (citations < Math.max(1, state.arguments.length - 1)) {
    notes.push(["is-warning", "本文中の引用・参照表記が少なめです。各節に必要な根拠が入っているか確認してください。"]);
  }
  if (yearMentions.length > 0) {
    notes.push(["is-note", `${yearMentions.length}件の年号候補があります。著作年、人物生没年、引用年が混同されていないか確認してください。`]);
  }
  if (sourceCitations !== state.sources.length) {
    notes.push(["is-warning", "著者または年が未入力の文献があります。Word出力前に文献表記を補ってください。"]);
  }
  if (!/本稿|本報告/.test(fullText)) {
    notes.push(["is-note", "本文中に本稿・本報告の立場を示す語が少なめです。論文としての主張位置を明示してください。"]);
  }
  if (state.abstractText.length < 120) {
    notes.push(["is-warning", "要旨が短い、または未作成です。問い、方法、結果、意義を含めてください。"]);
  }
  if (notes.length === 0) {
    notes.push(["is-good", "簡易チェックでは大きな不足は見当たりません。最後に引用ページ、固有名、図版権利、投稿規定を確認してください。"]);
  }
  return notes;
}

function exportMarkdown() {
  downloadBlob(new Blob([makeMarkdown()], { type: "text/markdown;charset=utf-8" }), `${fileStem()}.md`);
  showToast("Markdownを書き出しました");
}

function exportJson() {
  downloadBlob(new Blob([JSON.stringify(state, null, 2)], { type: "application/json;charset=utf-8" }), `${fileStem()}.json`);
  showToast("JSONを書き出しました");
}

function exportDocx() {
  const blob = createDocxBlob();
  downloadBlob(blob, `${fileStem()}.docx`);
  showToast("Wordファイルを書き出しました");
}

function makeMarkdown() {
  const lines = [
    `# ${clean(state.paperTitle) || "無題の論文"}`,
    "",
    `- 研究領域: ${currentProfile().label}`,
    `- 論文の型: ${currentPattern().label}`,
    `- 研究対象・一次資料: ${clean(state.materials) || "未定"}`,
    `- 中心概念: ${clean(state.concepts) || "未定"}`,
    "",
    "## 要旨",
    clean(state.abstractText) || "未作成",
    "",
    "## 問い",
    clean(state.question) || "未定",
    "",
    "## 主張の核",
    clean(state.claim) || "未定",
    "",
    "## 概要",
    clean(state.overviewText) || "未作成",
    "",
    "## 先行研究整理の叩き台",
    clean(state.literatureDraft) || "未作成",
    "",
    "## 本文"
  ];
  state.arguments.forEach((arg, index) => {
    lines.push("", `### ${index + 1}. ${arg.title || "無題の節"}`, "", arg.body || "");
    const paragraphs = splitParagraphs(arg.body || "");
    if (paragraphs.length > 0) {
      lines.push("", "#### パラグラフ機能");
      paragraphs.forEach((paragraph, paraIndex) => {
        const role = paragraphRoleDefs[paragraphRoleFor(arg, paragraph, paraIndex)] || paragraphRoleDefs.unset;
        lines.push(`- P${paraIndex + 1}: ${role.label}`);
      });
    }
  });
  lines.push("", "## 文献・資料", "");
  state.sources.forEach((source) => {
    lines.push(`- ${sourceLabel(source)} ${source.title || ""}`);
  });
  return lines.join("\n");
}

function makeAiPrompt() {
  return [
    "あなたは教育思想史研究、教育哲学研究、美術教育学研究に詳しい論文執筆支援者です。",
    "以下の構想について、サンプル論文に近い硬質な学術文体を保ちながら点検してください。",
    "",
    `タイトル: ${clean(state.paperTitle) || "未定"}`,
    `研究領域: ${currentProfile().label}`,
    `論文の型: ${currentPattern().label}`,
    `研究対象・一次資料: ${clean(state.materials) || "未定"}`,
    `中心概念: ${clean(state.concepts) || "未定"}`,
    `問い: ${clean(state.question) || "未定"}`,
    `主張: ${clean(state.claim) || "未定"}`,
    "",
    "依頼:",
    "1. 研究テーマとして成立するかを評価してください。",
    "2. アウトラインの論証構造を、主張・根拠・反論・先行研究の課題から検証してください。",
    "3. 足りない先行研究、一次資料、反論用文献の種類を挙げてください。",
    "4. 本文の文体を、教育学系論文として硬質かつ明晰に整える方針を示してください。"
  ].join("\n");
}

function renderAiMessages() {
  if (!els.aiMessages) return;
  if (!state.aiMessages || state.aiMessages.length === 0) {
    const intro = localAdviceForStep(currentStepId()).join("\n\n");
    els.aiMessages.innerHTML = `<article class="ai-message assistant"><strong>AI</strong><p>${escapeHtml(intro)}</p></article>`;
    return;
  }
  els.aiMessages.innerHTML = state.aiMessages
    .slice(-12)
    .map(
      (message) => `
        <article class="ai-message ${message.role === "user" ? "user" : "assistant"}">
          <strong>${message.role === "user" ? "あなた" : "AI"}</strong>
          <p>${escapeHtml(message.content)}</p>
        </article>
      `
    )
    .join("");
  els.aiMessages.scrollTop = els.aiMessages.scrollHeight;
}

async function askAi(mode) {
  const userText = clean(els.aiUserInput.value);
  const prompt = buildAiTaskPrompt(mode, userText);
  if (mode === "custom" && !userText) {
    showToast("相談内容を入力してください");
    return;
  }
  state.aiMessages.push({ role: "user", content: mode === "custom" ? userText : prompt.label, createdAt: new Date().toISOString() });
  renderAiMessages();
  els.sendAiMessage.disabled = true;
  try {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode,
        prompt: prompt.text,
        context: aiContext(),
        messages: state.aiMessages.slice(-8)
      })
    });
    const data = response.ok ? await response.json() : null;
    const content = data && data.ok && data.text ? data.text : localAiFallback(mode, userText);
    state.aiMessages.push({ role: "assistant", content, createdAt: new Date().toISOString(), model: data && data.model });
  } catch {
    state.aiMessages.push({ role: "assistant", content: localAiFallback(mode, userText), createdAt: new Date().toISOString(), model: "local" });
  } finally {
    els.aiUserInput.value = "";
    els.sendAiMessage.disabled = false;
    renderAiMessages();
    persistQuietly();
  }
}

function buildAiTaskPrompt(mode, userText) {
  const step = currentStepId();
  const labels = {
    advice: "この工程について助言してください",
    draft: "この工程に必要な文章案を作ってください",
    custom: userText
  };
  const task =
    mode === "draft"
      ? "現在の工程に必要な文章案を、教育学系論文の硬質な文体で作成してください。必要なら複数案を出してください。"
      : mode === "advice"
        ? "現在の工程で次に入力すべきこと、弱い点、改善案を具体的に示してください。"
        : userText;
  return {
    label: labels[mode] || userText,
    text: [
      "あなたは教育思想史研究、教育哲学研究、美術教育学研究の論文執筆を伴走する専門家です。",
      "サンプル論文に近い、硬質で明晰な学術文体を前提に助言してください。",
      `現在の工程: ${stepTitle(step)}`,
      task
    ].join("\n")
  };
}

function aiContext() {
  return {
    title: state.paperTitle,
    field: currentProfile().label,
    pattern: currentPattern().label,
    materials: state.materials,
    concepts: state.concepts,
    question: state.question,
    claim: state.claim,
    significance: state.theme.significance,
    novelty: state.theme.novelty,
    overview: state.overviewText,
    literatureDraft: state.literatureDraft,
    outline: state.arguments.map((arg) => ({
      title: arg.title,
      role: arg.role,
      claim: arg.claim,
      evidence: arg.evidence,
      counter: arg.counter,
      gap: arg.gap,
      body: shorten(arg.body, 800)
    })),
    sources: state.sources.map((source) => ({
      label: sourceLabel(source),
      title: source.title,
      finding: source.finding,
      limitation: source.limitation
    }))
  };
}

function localAiFallback(mode, userText) {
  const step = currentStepId();
  if (mode === "draft") {
    if (step === "overview") return makeOverviewDraft();
    if (step === "literature") {
      generateLiteratureDraft(false);
      return state.literatureDraft || "先行研究の登録が増えると、研究状況、限界、独自性の文章案をより具体化できます。";
    }
    if (step === "writing") return styleSentenceFor(activeArgument());
  }
  const advice = localAdviceForStep(step).join("\n\n");
  return `APIキーが未設定のため、ローカル提案を表示します。\n\n${advice}${userText ? `\n\n相談内容への応答: ${userText}については、問い、根拠、先行研究との差分の三点に分けて検討してください。` : ""}`;
}

function stepTitle(step) {
  const found = workflowSteps.find(([key]) => key === step || (key === "outlineCheck" && step === "outline-check"));
  return found ? found[1] : "テーマ設定・問いの設定";
}

function createDocxBlob() {
  const docXml = makeDocumentXml();
  const files = {
    "[Content_Types].xml": contentTypesXml(),
    "_rels/.rels": rootRelsXml(),
    "docProps/core.xml": coreXml(),
    "docProps/app.xml": appXml(),
    "word/styles.xml": stylesXml(),
    "word/document.xml": docXml
  };
  return new Blob([zipStore(files)], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  });
}

function makeDocumentXml() {
  const body = [];
  body.push(p(clean(state.paperTitle) || "無題の論文", "Title"));
  body.push(p(currentProfile().label + " / " + currentPattern().label, "Subtitle"));
  if (clean(state.abstractText)) {
    body.push(p("要旨", "Heading1"));
    splitParagraphs(state.abstractText).forEach((text) => body.push(p(text)));
  }
  if (clean(state.overviewText)) {
    body.push(p("概要", "Heading1"));
    splitParagraphs(state.overviewText).forEach((text) => body.push(p(text)));
  }
  if (clean(state.literatureDraft)) {
    body.push(p("先行研究整理の叩き台", "Heading1"));
    splitParagraphs(state.literatureDraft).forEach((text) => body.push(p(text)));
  }
  body.push(p("はじめに向けた構想", "Heading1"));
  body.push(p(`問い: ${clean(state.question) || "未定"}`));
  body.push(p(`主張: ${clean(state.claim) || "未定"}`));
  state.arguments.forEach((arg, index) => {
    body.push(p(`${index + 1}. ${arg.title || "無題の節"}`, "Heading1"));
    if (clean(arg.role)) body.push(p(`節の役割: ${arg.role}`, "Note"));
    splitParagraphs(arg.body || "").forEach((text) => body.push(p(text)));
  });
  body.push(p("文献・資料", "Heading1"));
  state.sources.forEach((source) => {
    body.push(p(`${sourceLabel(source)} ${source.title || ""}`));
  });
  body.push(`<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/></w:sectPr>`);
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>${body.join("")}</w:body>
</w:document>`;
}

function p(text, style = "Normal") {
  const stylePart = style === "Normal" ? "" : `<w:pPr><w:pStyle w:val="${style}"/></w:pPr>`;
  return `<w:p>${stylePart}<w:r><w:t xml:space="preserve">${xmlEscape(text)}</w:t></w:r></w:p>`;
}

function contentTypesXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>`;
}

function rootRelsXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`;
}

function coreXml() {
  const now = new Date().toISOString();
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>${xmlEscape(clean(state.paperTitle) || "無題の論文")}</dc:title>
  <dc:creator>論文アトリエ</dc:creator>
  <cp:lastModifiedBy>論文アトリエ</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified>
</cp:coreProperties>`;
}

function appXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>論文アトリエ</Application>
</Properties>`;
}

function stylesXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal">
    <w:name w:val="Normal"/>
    <w:qFormat/>
    <w:pPr><w:spacing w:after="160" w:line="360" w:lineRule="auto"/></w:pPr>
    <w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:eastAsia="Yu Mincho"/><w:sz w:val="21"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Title">
    <w:name w:val="Title"/>
    <w:qFormat/>
    <w:pPr><w:jc w:val="center"/><w:spacing w:after="240"/></w:pPr>
    <w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:eastAsia="Yu Gothic"/><w:b/><w:sz w:val="30"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Subtitle">
    <w:name w:val="Subtitle"/>
    <w:qFormat/>
    <w:pPr><w:jc w:val="center"/><w:spacing w:after="360"/></w:pPr>
    <w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:eastAsia="Yu Gothic"/><w:color w:val="5F6B7A"/><w:sz w:val="20"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="heading 1"/>
    <w:qFormat/>
    <w:pPr><w:spacing w:before="360" w:after="160"/><w:outlineLvl w:val="0"/></w:pPr>
    <w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:eastAsia="Yu Gothic"/><w:b/><w:sz w:val="24"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Note">
    <w:name w:val="Note"/>
    <w:pPr><w:spacing w:after="120"/></w:pPr>
    <w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:eastAsia="Yu Gothic"/><w:color w:val="5F6B7A"/><w:sz w:val="19"/></w:rPr>
  </w:style>
</w:styles>`;
}

function zipStore(files) {
  const encoder = new TextEncoder();
  const localParts = [];
  const centralParts = [];
  let offset = 0;
  Object.entries(files).forEach(([name, content]) => {
    const nameBytes = encoder.encode(name);
    const data = encoder.encode(content);
    const crc = crc32(data);
    const local = new Uint8Array(30 + nameBytes.length + data.length);
    const view = new DataView(local.buffer);
    writeHeader(view, 0x04034b50);
    view.setUint16(4, 20, true);
    view.setUint16(6, 0, true);
    view.setUint16(8, 0, true);
    view.setUint16(10, 0, true);
    view.setUint16(12, 0, true);
    view.setUint32(14, crc, true);
    view.setUint32(18, data.length, true);
    view.setUint32(22, data.length, true);
    view.setUint16(26, nameBytes.length, true);
    view.setUint16(28, 0, true);
    local.set(nameBytes, 30);
    local.set(data, 30 + nameBytes.length);
    localParts.push(local);

    const central = new Uint8Array(46 + nameBytes.length);
    const cview = new DataView(central.buffer);
    writeHeader(cview, 0x02014b50);
    cview.setUint16(4, 20, true);
    cview.setUint16(6, 20, true);
    cview.setUint16(8, 0, true);
    cview.setUint16(10, 0, true);
    cview.setUint16(12, 0, true);
    cview.setUint16(14, 0, true);
    cview.setUint32(16, crc, true);
    cview.setUint32(20, data.length, true);
    cview.setUint32(24, data.length, true);
    cview.setUint16(28, nameBytes.length, true);
    cview.setUint16(30, 0, true);
    cview.setUint16(32, 0, true);
    cview.setUint16(34, 0, true);
    cview.setUint16(36, 0, true);
    cview.setUint32(38, 0, true);
    cview.setUint32(42, offset, true);
    central.set(nameBytes, 46);
    centralParts.push(central);
    offset += local.length;
  });

  const centralSize = centralParts.reduce((sum, item) => sum + item.length, 0);
  const end = new Uint8Array(22);
  const eview = new DataView(end.buffer);
  writeHeader(eview, 0x06054b50);
  eview.setUint16(4, 0, true);
  eview.setUint16(6, 0, true);
  eview.setUint16(8, centralParts.length, true);
  eview.setUint16(10, centralParts.length, true);
  eview.setUint32(12, centralSize, true);
  eview.setUint32(16, offset, true);
  eview.setUint16(20, 0, true);
  return new Blob([...localParts, ...centralParts, end]);
}

function writeHeader(view, signature) {
  view.setUint32(0, signature, true);
}

function crc32(bytes) {
  let table = crc32.table;
  if (!table) {
    table = [];
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[i] = c >>> 0;
    }
    crc32.table = table;
  }
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = table[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function currentProfile() {
  return fieldProfiles[state.field] || fieldProfiles.history;
}

function currentPattern(targetState = state) {
  if (targetState.paperPattern && targetState.paperPattern !== "auto") {
    return paperPatterns[targetState.paperPattern] || paperPatterns.higuchi;
  }
  if (targetState.field === "art") return paperPatterns.forum;
  if (targetState.field === "cross") return paperPatterns.bridge;
  return paperPatterns.higuchi;
}

function activeArgument() {
  return state.arguments.find((arg) => arg.id === state.activeArgumentId) || state.arguments[0];
}

function linkedSources(arg) {
  return state.sources.filter((source) => arg.sources.includes(source.id) || source.argumentId === arg.id);
}

function sourceLabel(source) {
  const author = clean(source.author) || "著者未定";
  const year = clean(source.year);
  return year ? `${author}（${year}）` : author;
}

function citationLabel(source) {
  return clean(source.citation) || sourceLabel(source);
}

function fullPaperText() {
  return state.arguments.map((arg) => arg.body).join("\n\n");
}

function splitParagraphs(text) {
  return clean(text)
    .split(/\n{2,}/)
    .map((item) => clean(item))
    .filter(Boolean);
}

function citationCount(text) {
  return (clean(text).match(/[（(][^)）]*(?:18|19|20)\d{2}[^)）]*[)）]|『[^』]+』|「[^」]+」/g) || []).length;
}

function insertAtCursor(textarea, text) {
  const start = textarea.selectionStart || 0;
  const end = textarea.selectionEnd || 0;
  const before = textarea.value.slice(0, start);
  const after = textarea.value.slice(end);
  textarea.value = `${before}${text}${after}`;
  const pos = start + text.length;
  textarea.focus();
  textarea.setSelectionRange(pos, pos);
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function copyText(text, message) {
  navigator.clipboard
    .writeText(text)
    .then(() => showToast(message))
    .catch(() => {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
      showToast(message);
    });
}

function persistQuietly() {
  if (!activeProjectId) {
    ensureProjectStore();
    activeProjectId = localStorage.getItem(ACTIVE_PROJECT_KEY) || "";
  }
  localStorage.setItem(projectStateKey(activeProjectId), JSON.stringify(state));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  updateActiveProjectMeta();
  localStorage.setItem(ACTIVE_PROJECT_KEY, activeProjectId);
}

function persist() {
  persistQuietly();
}

function fileStem() {
  return sanitizeFilename(clean(state.paperTitle) || "paper-atelier");
}

function fieldLabel(field) {
  return (fieldProfiles[field] && fieldProfiles[field].label) || "研究領域未定";
}

function shortDate(value) {
  if (!value) return "未保存";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "未保存";
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function formatDateTime(value) {
  if (!value) return "日時不明";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "日時不明";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}/${mm}/${dd} ${hh}:${min}`;
}

function sanitizeFilename(value) {
  return value.replace(/[\\/:*?"<>|]/g, "_").slice(0, 80);
}

function clean(value) {
  return String(value || "").trim();
}

function shorten(value, max = 160) {
  const text = clean(value);
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}…`;
}

function uid() {
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("is-visible");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    els.toast.classList.remove("is-visible");
  }, 1800);
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  if (!location.protocol.startsWith("http")) return;
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}

} // End of browser-only code check
