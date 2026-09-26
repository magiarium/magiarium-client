export default {
  extends: ['markuplint:recommended-react'],
  parser: {
    '\\.[jt]sx$': '@markuplint/jsx-parser',
  },
  specs: {
    '\\.[jt]sx$': '@markuplint/react-spec',
  },
  rules: {
    // 同一要素内で同じ属性が重複して指定されていないか検査する
    // 例: <div id="foo" id="bar">
    'attr-duplication': true,
    // 属性値が引用符で囲まれているか検査する
    'attr-value-quotes': false,
    // 属性名の大文字・小文字が統一されているか検査する
    'case-sensitive-attr-name': false,
    // 要素名（タグ名）の大文字・小文字が統一されているか検査する
    'case-sensitive-tag-name': false,
    // HTML上、文字参照が必要な文字が適切にエスケープされているか検査する
    // 例: < → &lt;、& → &amp;
    'character-reference': true,
    // class属性の値が指定した命名規則に従っているか検査する(BEM記法想定)
    'class-naming':
      '/^[a-z][a-z0-9]*(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?$/',
    // 非推奨・obsolete なHTML属性を使用していないか検査する
    'deprecated-attr': true,
    // 非推奨・obsolete・non-standard なHTML要素を使用していないか検査する
    'deprecated-element': true,
    // 使用を禁止する要素を指定する
    'disallowed-element': [],
    // DOCTYPE宣言の有無を検査する
    doctype: false,
    // HTML要素の終了タグが存在するか検査する
    'end-tag': false,
    // 見出しレベルが飛ばされていないか検査する
    'heading-levels': true,
    // 同一ドキュメント内でid属性の値が重複していないか検査する
    'id-duplication': true,
    // 指定した属性が、その要素に対して実質的な効果を持たない場合に検査する
    'ineffective-attr': false,
    // HTML仕様上存在しない属性、または要素に対して不正な属性を検査する
    'invalid-attr': true,
    // label要素がフォームコントロールを関連付けているか検査する
    'label-has-control': false,
    // landmark roleに関するアクセシビリティ上の問題を検査する
    'landmark-roles': false,
    // popoverのトリガーと対象要素がDOM上で適切に隣接しているか検査する
    'neighbor-popovers': true,
    // ナビゲーション可能な要素のtarget名が曖昧になっていないか検査する
    'no-ambiguous-navigable-target-names': false,
    // boolean属性に値を指定していないか検査する
    'no-boolean-attr-value': false,
    // <br> が連続して使用されていないか検査する
    'no-consecutive-br': false,
    // 属性に、その属性のデフォルト値を明示的に指定していないか検査する
    'no-default-value': false,
    // <dl> 内で同じ名称の <dt> が重複していないか検査する
    'no-duplicate-dt': true,
    // 空の palpable content 要素が存在しないか検査する
    'no-empty-palpable-content': false,
    // Fragmentとして扱われるコンポーネントに固定値のid属性が指定されていないか検査する
    'no-hard-code-id': false,
    // 対応する開始タグが存在しない終了タグがないか検査する
    'no-orphaned-end-tag': true,
    // href、for、aria-labelledby等が参照するidが実際に存在するか検査する
    'no-refer-to-non-existent-id': true,
    // HTML属性形式のイベントハンドラを使用していないか検査する
    'no-use-event-handler-attr': false,
    // 要素の子要素・テキストがHTML仕様上許可されているか検査する
    'permitted-contents': [],
    // requiredな<select>にplaceholder label optionが存在するか検査する
    'placeholder-label-option': true,
    // ARIA role等から必要とされるアクセシブルネームが存在するか検査する
    'require-accessible-name': true,
    // <time> の内容が有効な日時文字列でない場合、datetime属性を要求する
    'require-datetime': true,
    // 指定された必須属性、または仕様上requiredな属性が存在するか検査する
    'required-attr': false,
    // 指定された必須要素が存在するか検査する
    'required-element': false,
    // ドキュメント内にh1要素が存在するか検査する
    'required-h1': false,
    // tableの各行・列でセル数が整合しているか検査する
    'table-row-column-alignment': false,
    // 箇条書きとして認識できるテキストを適切なリスト要素で表現しているか検査する
    'use-list': false,
    // role属性およびaria-*属性がWAI-ARIA / ARIA in HTMLの仕様に従っているか検査する
    'wai-aria': true,
  },
};
