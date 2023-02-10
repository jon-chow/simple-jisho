import { useModal, ModalType, toggleModal } from '@/contexts/ModalProvider';

import styles from './KanaChartPage.module.scss';


// List of basic kana.
const BASIC_KANA : Kana[][] = [
  [
    {romaji: 'a', hiragana: 'あ', katakana: 'ア'},
    {romaji: 'i', hiragana: 'い', katakana: 'イ'},
    {romaji: 'u', hiragana: 'う', katakana: 'ウ'},
    {romaji: 'e', hiragana: 'え', katakana: 'エ'},
    {romaji: 'o', hiragana: 'お', katakana: 'オ'},
  ],
  [
    {romaji: 'ka', hiragana: 'か', katakana: 'カ'},
    {romaji: 'ki', hiragana: 'き', katakana: 'キ'},
    {romaji: 'ku', hiragana: 'く', katakana: 'ク'},
    {romaji: 'ke', hiragana: 'け', katakana: 'ケ'},
    {romaji: 'ko', hiragana: 'こ', katakana: 'コ'},
  ],
  [
    {romaji: 'sa', hiragana: 'さ', katakana: 'サ'},
    {romaji: 'shi', hiragana: 'し', katakana: 'シ'},
    {romaji: 'su', hiragana: 'す', katakana: 'ス'},
    {romaji: 'se', hiragana: 'せ', katakana: 'セ'},
    {romaji: 'so', hiragana: 'そ', katakana: 'ソ'},
  ],
  [
    {romaji: 'ta', hiragana: 'た', katakana: 'タ'},
    {romaji: 'chi', hiragana: 'ち', katakana: 'チ'},
    {romaji: 'tsu', hiragana: 'つ', katakana: 'ツ'},
    {romaji: 'te', hiragana: 'て', katakana: 'テ'},
    {romaji: 'to', hiragana: 'と', katakana: 'ト'},
  ],
  [
    {romaji: 'na', hiragana: 'な', katakana: 'ナ'},
    {romaji: 'ni', hiragana: 'に', katakana: 'ニ'},
    {romaji: 'nu', hiragana: 'ぬ', katakana: 'ヌ'},
    {romaji: 'ne', hiragana: 'ね', katakana: 'ネ'},
    {romaji: 'no', hiragana: 'の', katakana: 'ノ'},
  ],
  [
    {romaji: 'ha', hiragana: 'は', katakana: 'ハ'},
    {romaji: 'hi', hiragana: 'ひ', katakana: 'ヒ'},
    {romaji: 'fu', hiragana: 'ふ', katakana: 'フ'},
    {romaji: 'he', hiragana: 'へ', katakana: 'ヘ'},
    {romaji: 'ho', hiragana: 'ほ', katakana: 'ホ'},
  ],
  [
    {romaji: 'ma', hiragana: 'ま', katakana: 'マ'},
    {romaji: 'mi', hiragana: 'み', katakana: 'ミ'},
    {romaji: 'mu', hiragana: 'む', katakana: 'ム'},
    {romaji: 'me', hiragana: 'め', katakana: 'メ'},
    {romaji: 'mo', hiragana: 'も', katakana: 'モ'},
  ],
  [
    {romaji: 'ya', hiragana: 'や', katakana: 'ヤ'},
    {romaji: '', hiragana: '', katakana: ''},
    {romaji: 'yu', hiragana: 'ゆ', katakana: 'ユ'},
    {romaji: '', hiragana: '', katakana: ''},
    {romaji: 'yo', hiragana: 'よ', katakana: 'ヨ'},
  ],
  [
    {romaji: 'ra', hiragana: 'ら', katakana: 'ラ'},
    {romaji: 'ri', hiragana: 'り', katakana: 'リ'},
    {romaji: 'ru', hiragana: 'る', katakana: 'ル'},
    {romaji: 're', hiragana: 'れ', katakana: 'レ'},
    {romaji: 'ro', hiragana: 'ろ', katakana: 'ロ'},
  ],
  [
    {romaji: 'wa', hiragana: 'わ', katakana: 'ワ'},
    {romaji: '', hiragana: '', katakana: ''},
    {romaji: '', hiragana: '', katakana: ''},
    {romaji: '', hiragana: '', katakana: ''},
    {romaji: 'wo', hiragana: 'を', katakana: 'ヲ'},
  ],
  [
    {romaji: 'n', hiragana: 'ん', katakana: 'ン'},
    {romaji: '', hiragana: '', katakana: ''},
    {romaji: '', hiragana: '', katakana: ''},
    {romaji: '', hiragana: '', katakana: ''},
    {romaji: '', hiragana: '', katakana: ''},
  ]
];

// List of daku-on and handaku-on kana.
const DAKUON_HANDAKUON_KANA : Kana[][] = [
  [
    {romaji: 'ga', hiragana: 'が', katakana: 'ガ'},
    {romaji: 'gi', hiragana: 'ぎ', katakana: 'ギ'},
    {romaji: 'gu', hiragana: 'ぐ', katakana: 'グ'},
    {romaji: 'ge', hiragana: 'げ', katakana: 'ゲ'},
    {romaji: 'go', hiragana: 'ご', katakana: 'ゴ'},
  ],
  [
    {romaji: 'za', hiragana: 'ざ', katakana: 'ザ'},
    {romaji: 'ji', hiragana: 'じ', katakana: 'ジ'},
    {romaji: 'zu', hiragana: 'ず', katakana: 'ズ'},
    {romaji: 'ze', hiragana: 'ぜ', katakana: 'ゼ'},
    {romaji: 'zo', hiragana: 'ぞ', katakana: 'ゾ'},
  ],
  [
    {romaji: 'da', hiragana: 'だ', katakana: 'ダ'},
    {romaji: 'ji', hiragana: 'ぢ', katakana: 'ヂ'},
    {romaji: 'zu', hiragana: 'づ', katakana: 'ヅ'},
    {romaji: 'de', hiragana: 'で', katakana: 'デ'},
    {romaji: 'do', hiragana: 'ど', katakana: 'ド'},
  ],
  [
    {romaji: 'ba', hiragana: 'ば', katakana: 'バ'},
    {romaji: 'bi', hiragana: 'び', katakana: 'ビ'},
    {romaji: 'bu', hiragana: 'ぶ', katakana: 'ブ'},
    {romaji: 'be', hiragana: 'べ', katakana: 'ベ'},
    {romaji: 'bo', hiragana: 'ぼ', katakana: 'ボ'},
  ],
  [
    {romaji: 'pa', hiragana: 'ぱ', katakana: 'パ'},
    {romaji: 'pi', hiragana: 'ぴ', katakana: 'ピ'},
    {romaji: 'pu', hiragana: 'ぷ', katakana: 'プ'},
    {romaji: 'pe', hiragana: 'ぺ', katakana: 'ペ'},
    {romaji: 'po', hiragana: 'ぽ', katakana: 'ポ'},
  ],
];

// List of you-on kana.
const YOUON_KANA : Kana[][] = [
  [
    {romaji: 'kya', hiragana: 'きゃ', katakana: 'キャ'},
    {romaji: '', hiragana: '', katakana: ''},
    {romaji: 'kyu', hiragana: 'きゅ', katakana: 'キュ'},
    {romaji: '', hiragana: '', katakana: ''},
    {romaji: 'kyo', hiragana: 'きょ', katakana: 'キョ'},
  ],
  [
    {romaji: 'gya', hiragana: 'ぎゃ', katakana: 'ギャ'},
    {romaji: '', hiragana: '', katakana: ''},
    {romaji: 'gyu', hiragana: 'ぎゅ', katakana: 'ギュ'},
    {romaji: '', hiragana: '', katakana: ''},
    {romaji: 'gyo', hiragana: 'ぎょ', katakana: 'ギョ'},
  ],
  [
    {romaji: 'sha', hiragana: 'しゃ', katakana: 'シャ'},
    {romaji: '', hiragana: '', katakana: ''},
    {romaji: 'shu', hiragana: 'しゅ', katakana: 'シュ'},
    {romaji: '', hiragana: '', katakana: ''},
    {romaji: 'sho', hiragana: 'しょ', katakana: 'ショ'},
  ],
  [
    {romaji: 'ja', hiragana: 'じゃ', katakana: 'ジャ'},
    {romaji: '', hiragana: '', katakana: ''},
    {romaji: 'ju', hiragana: 'じゅ', katakana: 'ジュ'},
    {romaji: '', hiragana: '', katakana: ''},
    {romaji: 'jo', hiragana: 'じょ', katakana: 'ジョ'},
  ],
  [
    {romaji: 'cha', hiragana: 'ちゃ', katakana: 'チャ'},
    {romaji: '', hiragana: '', katakana: ''},
    {romaji: 'chu', hiragana: 'ちゅ', katakana: 'チュ'},
    {romaji: '', hiragana: '', katakana: ''},
    {romaji: 'cho', hiragana: 'ちょ', katakana: 'チョ'},
  ],
  [
    {romaji: 'nya', hiragana: 'にゃ', katakana: 'ニャ'},
    {romaji: '', hiragana: '', katakana: ''},
    {romaji: 'nyu', hiragana: 'にゅ', katakana: 'ニュ'},
    {romaji: '', hiragana: '', katakana: ''},
    {romaji: 'nyo', hiragana: 'にょ', katakana: 'ニョ'},
  ],
  [
    {romaji: 'hya', hiragana: 'ひゃ', katakana: 'ヒャ'},
    {romaji: '', hiragana: '', katakana: ''},
    {romaji: 'hyu', hiragana: 'ひゅ', katakana: 'ヒュ'},
    {romaji: '', hiragana: '', katakana: ''},
    {romaji: 'hyo', hiragana: 'ひょ', katakana: 'ヒョ'},
  ],
  [
    {romaji: 'bya', hiragana: 'びゃ', katakana: 'ビャ'},
    {romaji: '', hiragana: '', katakana: ''},
    {romaji: 'byu', hiragana: 'びゅ', katakana: 'ビュ'},
    {romaji: '', hiragana: '', katakana: ''},
    {romaji: 'byo', hiragana: 'びょ', katakana: 'ビョ'},
  ],
  [
    {romaji: 'pya', hiragana: 'ぴゃ', katakana: 'ピャ'},
    {romaji: '', hiragana: '', katakana: ''},
    {romaji: 'pyu', hiragana: 'ぴゅ', katakana: 'ピュ'},
    {romaji: '', hiragana: '', katakana: ''},
    {romaji: 'pyo', hiragana: 'ぴょ', katakana: 'ピョ'},
  ],
  [
    {romaji: 'mya', hiragana: 'みゃ', katakana: 'ミャ'},
    {romaji: '', hiragana: '', katakana: ''},
    {romaji: 'myu', hiragana: 'みゅ', katakana: 'ミュ'},
    {romaji: '', hiragana: '', katakana: ''},
    {romaji: 'myo', hiragana: 'みょ', katakana: 'ミョ'},
  ],
  [
    {romaji: 'rya', hiragana: 'りゃ', katakana: 'リャ'},
    {romaji: '', hiragana: '', katakana: ''},
    {romaji: 'ryu', hiragana: 'りゅ', katakana: 'リュ'},
    {romaji: '', hiragana: '', katakana: ''},
    {romaji: 'ryo', hiragana: 'りょ', katakana: 'リョ'},
  ],
];


/**
 * Creates a kana card component.
 * 
 * The kana card displays the kana character, its romaji, and its katakana
 * depending on the settings.
 */
const KanaCard = (props : {kana : Kana}) => {
  const KanaContext = useModal();

    // Toggle the kana info modal.
  const toggleKanaModal = () => {
    toggleModal(KanaContext, ModalType.KANA);
    KanaContext.setData(props.kana);
  };

  return (
    (props.kana.romaji.length > 0) ?
      <div
        className={styles.KanaCard}
        title={
          `Romaji: ${props.kana.romaji}\nHiragana: ${props.kana.hiragana}\nKatakana: ${props.kana.katakana}`}
        onClick={
          () => {
            (props.kana.hiragana.length === 1) && toggleKanaModal();
          }
        }
      >
        <div className={styles.Romaji}>
          {props.kana.romaji}
        </div>

        <div className={styles.Hiragana}>
          {props.kana.hiragana}
        </div>

        <div className={styles.Katakana}>
          {props.kana.katakana}
        </div>
      </div> :
      <div className={styles.KanaCardFiller}>
        <hr />
      </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */
/**
 * Exports the kana chart page.
 * 
 * The kana chart displays all the kana characters in a grid.
 * Allows the user to click on a kana character to see its details.
 * Kana includes hiragana and katakana.
 */
const KanaChartPage = () => {
  return (
    <div className={styles.KanaChartPage}>
      <h1>Basic Hiragana & Katakana</h1>
      <h2>ひらがな・カタカナ</h2>
      <div className={styles.KanaGrid}>
        {BASIC_KANA.map((kanaGroup : Kana[], index : number) => (
          <div key={index} className={styles.KanaRow}>

            { kanaGroup.map((kana : Kana, index : number) => (
              <KanaCard key={index} kana={kana} />
            ))}

          </div>
        ))}
      </div>
      
      <h1>Daku-on & Handaku-on</h1>
      <h2>濁音・半濁音</h2>
      <div className={styles.KanaGrid}>
        {DAKUON_HANDAKUON_KANA.map((kanaGroup : Kana[], index : number) => (
          <div key={index} className={styles.KanaRow}>

            { kanaGroup.map((kana : Kana, index : number) => (
              <KanaCard key={index} kana={kana} />
            ))}

          </div>
        ))}
      </div>

      <h1>You-on</h1>
      <h2>拗音</h2>
      <div className={styles.KanaGrid}>
        {YOUON_KANA.map((kanaGroup : Kana[], index : number) => (
          <div key={index} className={styles.KanaRow}>

            { kanaGroup.map((kana : Kana, index : number) => (
              <KanaCard key={index} kana={kana} />
            ))}

          </div>
        ))}
      </div>
    </div>
  );
};

export default KanaChartPage;
