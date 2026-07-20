// SKA2 Application Core Controller

// --- Theme Management ---
const themeToggleBtn = document.getElementById('theme-toggle');
const themeText = themeToggleBtn.querySelector('.theme-text');

// Init saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
    themeText.textContent = 'ライトモード';
}

themeToggleBtn.addEventListener('click', () => {
    if (document.body.classList.contains('dark-theme')) {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        themeText.textContent = 'ライトモード';
        localStorage.setItem('theme', 'light');
    } else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        themeText.textContent = 'ダークモード';
        localStorage.setItem('theme', 'dark');
    }
});

// --- Tab Switching Navigation ---
const navItems = document.querySelectorAll('.nav-item');
const tabContents = document.querySelectorAll('.tab-content');

function switchTab(tabId) {
    // Update active nav button
    navItems.forEach(item => {
        if (item.getAttribute('data-tab') === tabId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Update active section
    tabContents.forEach(content => {
        if (content.id === tabId) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });

    // Custom behaviors per tab activation
    if (tabId === 'interview') {
        // Automatically trigger the first question typing
        triggerInterviewQuestion('q1');
    }
}

navItems.forEach(item => {
    item.addEventListener('click', () => {
        const tabId = item.getAttribute('data-tab');
        switchTab(tabId);
    });
});

// Expose switchTab to window context
window.switchTab = switchTab;

// --- Recall Mapping Stepper Control ---
let currentStep = 1;
const totalSteps = 3;
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const stepIndicators = document.querySelectorAll('.step-indicator-item');
const stepContents = document.querySelectorAll('.step-content');

function updateStepper() {
    // Sync indicator classes
    stepIndicators.forEach(indicator => {
        const stepNum = parseInt(indicator.getAttribute('data-step'));
        if (stepNum === currentStep) {
            indicator.className = 'step-indicator-item active';
        } else if (stepNum < currentStep) {
            indicator.className = 'step-indicator-item completed';
        } else {
            indicator.className = 'step-indicator-item';
        }
    });

    // Sync active step content
    stepContents.forEach(content => {
        if (content.id === `step-${currentStep}-content`) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });

    // Control buttons state
    btnPrev.disabled = currentStep === 1;
    if (currentStep === totalSteps) {
        btnNext.textContent = '最初から体験';
    } else {
        btnNext.textContent = '次のステップへ';
    }
}

btnNext.addEventListener('click', () => {
    if (currentStep === totalSteps) {
        currentStep = 1;
    } else {
        currentStep++;
    }
    updateStepper();
});

btnPrev.addEventListener('click', () => {
    if (currentStep > 1) {
        currentStep--;
        updateStepper();
    }
});

// --- Karpicke Study Chart Switcher ---
const kTabBtns = document.querySelectorAll('.k-tab-btn');
const studyDetails = document.querySelectorAll('.study-details');

kTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        kTabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const study = btn.getAttribute('data-study');
        studyDetails.forEach(detail => {
            if (detail.id === `study-${study}-content`) {
                detail.classList.add('active');
            } else {
                detail.classList.remove('active');
            }
        });
    });
});

// --- Interview Prep Simulator Logic ---
const interviewData = {
    q1: {
        interviewer: "「あなたの履歴書を拝見すると、NLP（自然言語処理）やコンピュータサイエンスの専門性をお持ちですね。子供たちの言語教育や、今回の『課程計畫引導師』という職務にこれをどのように応用できますか？」",
        candidate: `「私の専門である自然言語処理は、言語という複雑なシステムを、コンピュータが理解可能な論理構造に分解する技術です。この訓練を通じて培った『複雑な情報を分解し、再構築する能力』は、子供たちに言葉や論理思考を教える上で最大の強みになると確信しています。

例えば、英語の時制や日本語の助詞など、子供たちがつまずきやすい抽象的な言語概念を、彼らが直感的かつゲーム感覚で理解できるような『スモールステップの論理的カリキュラム』に分解して設計することに長けています。

単にルールを教えるのではなく、言語のパターンを子供たちが自ら発見できるような教材とガイドを提供することで、暗記に頼らない本物の言語習得と論理的思考力を同時に育ててまいります。」`,
        commentary: "NLPの論理的分解力を「カリキュラムの構造化（スモールステップ設計）」と「子供のパターン認識力」に繋げることで、技術的背景と教育実践力を一貫したストーリーとしてアピールできます。"
    },
    q2: {
        interviewer: "「当校のカリキュラムでは心智圖（マインドマップ）を取り入れています。しかし、一部からは『綺麗に描いただけでわかった気になる＝能力の錯覚（Illusion of Competence）』を招くという批判もあります。これについてどうお考えですか？」",
        candidate: `「非常に鋭く、かつ学習科学的にも重要なご指摘です。確かに、完成された心智圖をただ受動的に眺めるだけの学習では、脳が知識を処理したと勘違いする『能力の錯覚』を誘発します。

しかし、これはツールの問題ではなく『使い方の問題』です。私はこの課題に対し、『能動的想起（Active Recall）』と融合した『想起マッピング（Retrieval Mapping）』を指導します。

具体的には、テキストを閉じた状態で自分の記憶だけを頼りに白紙にマップを描き出させ（想起）、その後にテキストと照合して思い出せなかった箇所を赤ペンで追記させる（ギャップ検出）指導法です。

この手法により、心智圖は受動的な整理ツールから、『自分の知識の穴を可視化し、脳に負荷をかけて記憶を定着させる最高のアウトプットツール』へと昇華します。御社のカリキュラム効果をさらに何倍にも高める指導ができると確信しています。」`,
        commentary: "相手の教育方針を否定することなく、科学的な知見（能動的想起・想起マッピング）を追加提案することで、専門家としての信頼度と即戦力としての価値を強烈に示せます。"
    },
    q3: {
        interviewer: "「修了証を拝見すると、『Learning How to Learn』や『Mindshift』など、学習指導法に関する講座を数多く修了されていますね。これらは現場でどう活かされますか？」",
        candidate: `「これらの講座を通じて、私は単なる『科目の知識』ではなく、脳科学に基づいた『効果的な学習方法そのもの（メタ学習）』を体系的に学んでまいりました。

私が目指す『課程計畫引導師』とは、生徒に知識（魚）を直接与える人ではなく、一生モノの『学び方（魚の釣り方）』を授けるナビゲーターです。

生徒個々の認知特性や悩みをカウンセリングで汲み取り、例えば『ポモドーロ・テクニックによる集中力維持』や『分散学習（Spaced Repetition）の実践スケジューリング』などを一人ひとりに合わせてカスタマイズ指導します。

これにより、自習室や家庭でも自ら進んで効率的に学習できる『完全自律型』の学習者を育成し、御社が掲げる『生涯にわたって持ち運べる能力』の育成に直接貢献いたします。」`,
        commentary: "資格を「単なる勉強実績」から「自律学習者の育成（＝魚の釣り方を教える）のための強固な科学的バックボーン」へと意味づけを変え、会社の教育理念にぴったりシンクロさせています。"
    }
};

const interviewerText = document.getElementById('interviewer-text');
const candidateText = document.getElementById('candidate-text');
const commentaryText = document.getElementById('commentary-text');
const qButtons = document.querySelectorAll('.q-btn');

let typingInterval = null;
let currentAnswerText = '';

function triggerInterviewQuestion(qId) {
    const data = interviewData[qId];
    if (!data) return;

    // Reset indicator classes
    qButtons.forEach(btn => {
        if (btn.getAttribute('data-q') === qId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Cancel active typing animation
    if (typingInterval) clearInterval(typingInterval);

    // Render Interviewer prompt instantly
    interviewerText.textContent = data.interviewer;
    commentaryText.textContent = data.commentary;

    // Setup Typewriter Animation for Candidate reply
    candidateText.textContent = '';
    candidateText.classList.add('typing');
    currentAnswerText = data.candidate;
    
    let index = 0;
    typingInterval = setInterval(() => {
        if (index < data.candidate.length) {
            candidateText.textContent += data.candidate.charAt(index);
            index++;
        } else {
            clearInterval(typingInterval);
            candidateText.classList.remove('typing');
        }
    }, 15); // Faster smooth typing
}

qButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const qId = btn.getAttribute('data-q');
        triggerInterviewQuestion(qId);
    });
});

// Clipboard Answer Copy Handler
function copyAnswerText() {
    if (!currentAnswerText) return;
    navigator.clipboard.writeText(currentAnswerText).then(() => {
        const copyBtn = document.querySelector('.copy-btn');
        const origText = copyBtn.textContent;
        copyBtn.textContent = 'コピー完了！';
        setTimeout(() => {
            copyBtn.textContent = origText;
        }, 1500);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

window.copyAnswerText = copyAnswerText;

// Trigger first interview typing simulation on setup
document.addEventListener('DOMContentLoaded', () => {
    // Ensure Overview step begins correctly
    updateStepper();
});
