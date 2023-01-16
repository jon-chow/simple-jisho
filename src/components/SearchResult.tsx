import styles from '../styles/SearchResult.module.scss';


/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */
/**
 * Creates the SearchResult component.
 * 
 * The SearchResult component contains data on a search.
 */
const SearchResult = (props: any) => {
  const data = props.resultData;
  const mainForm = data.japanese[0];
  
  return (
    <article className={styles.ResultPanel}>
      {/* Jisho Search */}
      <section className={styles.JishoSearch}>
        {/* Main Form */}
        <div className={styles.Word}>
          <ruby>
            {mainForm.word ? mainForm.word : mainForm.reading}
            <rt>{mainForm.word ? mainForm.reading : ''}</rt>
          </ruby>
        </div>

        {/* JLPT / Rarity Tags */}
        <div className={styles.Tags}>
          { (data.is_common) ? 
            <span className={styles.Common} style={{background: 'rgba(50, 255, 50, 0.4)'}}>Common</span> :
            <span className={styles.Common} style={{background: 'rgba(50, 50, 255, 0.4)'}}>Uncommon</span>
          }
          { data.jlpt.map((level: string, index: number) => {
            const levelNum = level.replace('jlpt-n', '');
            let colour;

            switch(levelNum) {
              case '1':
                colour = 'rgba(255, 50, 50, 0.4)'; break;
              case '2':
                colour = 'rgba(255, 100, 50, 0.4)'; break;
              case '3':
                colour = 'rgba(255, 255, 50, 0.4)'; break;
              case '4':
                colour = 'rgba(50, 255, 50, 0.4)'; break;
              default:
                colour = 'rgba(50, 50, 255, 0.4)';
            }

            return (
              <span
                key={index}
                className={styles.Jlpt}
                style={{background: colour}}
              >
                JLPT N{levelNum}
              </span>
            )
          })}
        </div>

        {/* Senses */}
        <div className={styles.Senses}>
          {data.senses.map((sense: any, index: number) => {
            return (
              <div key={index} className={styles.Sense}>
                <span className={styles.PartOfSpeech}>
                  {sense.parts_of_speech.map((pos: string, i: number) => {
                    if (i === sense.parts_of_speech.length - 1)
                      return pos;
                    else
                      return `${pos}, `;
                  })}
                </span>
                
                <span className={styles.Definition}>
                  <span className={styles.DefinitionNumber}>{`${index + 1}. `}</span>
                  { sense.english_definitions.map((definition: string, i: number) => {
                    if (i === sense.english_definitions.length - 1)
                      return definition;
                    else
                      return `${definition}; `;
                  })}
                </span>
              </div>
            )
          })}
        </div>
        
        {/* Other Forms */}
        { (data.japanese.length > 1) && (
          <div className={styles.OtherForms}>
            <h1 className={styles.FormsHeader}>Other Forms</h1>
            <div className={styles.Forms}>
              { data.japanese.map((japanese: any, index: number) => {
                  if (index === 0) return;

                  return ((japanese.word) ?
                    <span key={index} className={styles.FormWord}>
                      {`${japanese.word} ${(japanese.reading) && `【${japanese.reading}】`}${(index !== data.japanese.length - 1) ? '、' : ''}`}
                    </span> :
                    <span key={index} className={styles.FormWord}>
                      {`${japanese.reading}${(index !== data.japanese.length - 1) ? '、' : ''}`}
                    </span>
                  )
                })}
            </div>
          </div>
        )}

        {/* Example Sentences */}
        { (data.sentences.length > 0) && (
          <div className={styles.Sentences}>
            <h1 className={styles.ExamplesHeader}>Example Sentences</h1>
            <div className={styles.Examples}>
              { data.sentences.map((sentence: any, index: number) => {
                return (
                  <div key={index} className={styles.Example}>
                    <span className={styles.ExampleSentence}>
                        <span>{sentence.kanji}</span>
                        <span>{sentence.kana}</span>
                    </span>

                    <span className={styles.ExampleTranslation}>
                      {sentence.english}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </section>

      {/* Jisho Link */}
      <section className={styles.JishoLink}>
        <a
          href={`https://jisho.org/search/${data.slug}`}
          target="_blank"
          rel="noreferrer"
          title={`${data.slug} on Jisho.org`}
        >
          View on Jisho.org ≫
        </a>
      </section>
    </article>
  );
};

export default SearchResult;
