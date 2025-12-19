// アプリケーション状態
let config = { msgs: [], qas: [] };

// ページ読み込み時の処理
window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash.substring(1); // #を取り除く
    if (hash) {
        try {
            // URLからデータを復元
            const json = decodeURIComponent(atob(hash));
            config = JSON.parse(json);
            initViewer();
        } catch (e) {
            console.error("データの読み込みに失敗しました", e);
            alert("データの読み込みに失敗しました。URLが正しいか確認してね！");
            // 失敗時はURLをクリアしてトップに戻るなどの処理も考えられますが、一旦アラートのみ
        }
    }
});

// QA（質問と回答）を追加
function addQA() {
    const container = document.getElementById('qa-container');
    const num = container.children.length + 1;
    const div = document.createElement('div');
    div.className = 'qa-pair';
    div.innerHTML = `<label>秘密の質問 ${num}</label><input type="text" class="in-q"><label>答え ${num}</label><input type="text" class="in-a" placeholder="ひらがなで入力してね！">`;
    container.appendChild(div);
}

// サイドバーの開閉
function toggleSidebar() {
    document.getElementById('hint-sidebar').classList.toggle('open');
}

// ヒント詳細表示
function showHints(cat) {
    const container = document.getElementById('hint-items-container');
    container.innerHTML = '';

    // サイドバーヘッダーをDOM操作で構築
    const sidebarHead = document.getElementById('sidebar-head');
    sidebarHead.innerHTML = '';

    const backBtn = document.createElement('button');
    backBtn.type = 'button';
    backBtn.style.cssText = 'background:none; border:none; color:var(--main-color); cursor:pointer;';
    backBtn.textContent = '← 戻る';
    backBtn.onclick = showCats;

    const catSpan = document.createElement('span');
    catSpan.textContent = catNames[cat];

    sidebarHead.appendChild(backBtn);
    sidebarHead.appendChild(document.createTextNode(' '));
    sidebarHead.appendChild(catSpan);

    allData[cat].forEach(text => {
        const div = document.createElement('div');
        div.className = 'hint-item';
        div.textContent = text;
        div.onclick = () => {
            const textarea = document.getElementById('in-messages');
            textarea.value += (textarea.value ? '\n' : '') + text;
        };
        container.appendChild(div);
    });
    document.getElementById('category-view').style.display = 'none';
    document.getElementById('hint-detail-view').style.display = 'block';
}

// カテゴリ一覧表示
function showCats() {
    document.getElementById('category-view').style.display = 'block';
    document.getElementById('hint-detail-view').style.display = 'none';

    // サイドバーヘッダーをDOM操作で構築
    const sidebarHead = document.getElementById('sidebar-head');
    sidebarHead.innerHTML = '';

    const titleSpan = document.createElement('span');
    titleSpan.style.cssText = 'font-weight:bold; color:#888;';
    titleSpan.textContent = 'ヒント図鑑';

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.style.cssText = 'border:none; background:none; font-size:1.2em;';
    closeBtn.textContent = '×';
    closeBtn.setAttribute('aria-label', '閉じる');
    closeBtn.onclick = toggleSidebar;

    sidebarHead.appendChild(titleSpan);
    sidebarHead.appendChild(closeBtn);
}

// サイト生成（データ作成とURL更新）
function generateSite() {
    const qs = document.querySelectorAll('.in-q');
    const as = document.querySelectorAll('.in-a');

    // 入力値を取得
    const title = document.getElementById('in-title').value || '好きなところ';
    const msgs = document.getElementById('in-messages').value.split('\n').filter(m => m.trim());
    const qas = [];
    qs.forEach((q, i) => {
        if (q.value && as[i].value) {
            qas.push({ q: q.value, a: as[i].value });
        }
    });

    if (qas.length === 0 || msgs.length === 0) {
        return alert('質問とメッセージを入れてね！');
    }

    // configを更新
    config = {
        title: title,
        msgs: msgs,
        qas: qas
    };

    // ランダムに1問選ぶ（保存時に決めるか、表示時に決めるか。ここでは表示の一貫性のため保存しない＝毎回変わる、でもいいが、
    // URLで状態を固定するなら選んだ質問も固定するか、あるいは問答無用でランダムにするか。
    // 元のロジックはgenerateSite時に決めていた。再読み込みで変わってもいいなら保存しなくていい。
    // 「公開」とあるので、アクセスするたびに質問が変わるのも面白いかも。今回は保存せず、initViewerで選び直す方式にします。

    // URLハッシュを更新
    const json = JSON.stringify(config);
    const hash = btoa(encodeURIComponent(json));
    window.location.hash = hash;

    // ビューワー表示
    initViewer();
}

// ビューワー初期化
function initViewer() {
    // データがない場合は何もしない（あるいはトップに戻す）
    if (!config.qas || config.qas.length === 0) return;

    // ターゲット質問の抽選（未設定の場合）
    if (!config.targetQA) {
        config.targetQA = config.qas[Math.floor(Math.random() * config.qas.length)];
    }

    document.getElementById('setup-section').style.display = 'none';
    document.getElementById('viewer-section').style.display = 'block';

    // タイトル設定
    const viewTitle = document.getElementById('view-title');
    viewTitle.textContent = config.title;

    // 共有ボタンの追加（まだなければ）
    if (!document.getElementById('share-btn')) {
        const shareBtn = document.createElement('button');
        shareBtn.id = 'share-btn';
        shareBtn.textContent = '🔗 このサイトのURLをコピー';
        shareBtn.className = 'main-btn';
        shareBtn.style.cssText = 'background-color: #888; margin-bottom: 20px; font-size: 0.9em;';
        shareBtn.onclick = copyUrl;

        // タイトルの下に挿入
        viewTitle.parentNode.insertBefore(shareBtn, viewTitle.nextSibling);
    }

    const authArea = document.getElementById('auth-area');
    authArea.innerHTML = '';
    authArea.style.display = 'block'; // 再表示用

    // 説明文
    const guideP = document.createElement('p');
    guideP.style.cssText = 'font-size:0.8em; color:var(--main-color); margin-bottom:15px;';
    guideP.textContent = '秘密の質問に答えてね（ひらがな）';
    authArea.appendChild(guideP);

    // 質問カード
    const card = document.createElement('div');
    card.className = 'auth-card';

    const p = document.createElement('p');
    p.textContent = `Q: ${config.targetQA.q}`;

    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'target-auth-input';
    input.placeholder = 'ひらがなで入力してね！';

    card.appendChild(p);
    card.appendChild(input);
    authArea.appendChild(card);

    // 認証ボタン
    const authBtn = document.createElement('button');
    authBtn.type = 'button';
    authBtn.className = 'main-btn';
    authBtn.textContent = '認証する';
    authBtn.onclick = checkAuth;
    authArea.appendChild(authBtn);

    // ビューワーの内容エリアをリセット
    document.getElementById('content-sub-section').style.display = 'none';
}

// URLコピー
function copyUrl() {
    const url = window.location.href;

    // ローカルファイルの場合の警告
    if (window.location.protocol === 'file:') {
        alert("【注意！】\nこれはあなたのパソコンの中にあるファイルです。\nこのURLを送っても、友達は見ることができません。\n\n「Netlify Drop」などのサイトに、このフォルダごとアップロードしてから、そのURLをシェアしてください！");
        return; // コピーさせない（誤解を防ぐため）
    }

    navigator.clipboard.writeText(url).then(() => {
        alert('URLをコピーしました！友達に送ってね！');
    }).catch(err => {
        console.error('コピー失敗:', err);
        alert('コピーに失敗しました。URLバーからコピーしてね。');
    });
}

// 認証チェック
function checkAuth() {
    const input = document.getElementById('target-auth-input');
    if (input.value === config.targetQA.a) {
        document.getElementById('auth-area').style.display = 'none';
        document.getElementById('content-sub-section').style.display = 'block';
        showRandomMessage();
    } else {
        alert("答えが違うよ！ひらがなで合ってるかな？");
    }
}

// ランダムメッセージ表示
function showRandomMessage() {
    const randomIndex = Math.floor(Math.random() * config.msgs.length);
    document.getElementById('message-display').innerText = config.msgs[randomIndex];
}
