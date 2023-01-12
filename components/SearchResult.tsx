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
        {/* JLPT / Rarity Tags */}
        <div className={styles.Tags}>
          { (data.is_common) ? 
            <span className={styles.Common} style={{background: 'rgba(50, 255, 50, 0.4)'}}>Common</span> :
            <span className={styles.Common} style={{background: 'rgba(50, 50, 255, 0.4)'}}>Uncommon</span>
          }
          { data.jlpt.map((level: string, index: number) => {
            const levelNum = level.replace('jlpt-n', '');
            let colour = 'rgba(255, 50, 50, 0.4)';

            switch(levelNum) {
              case '1':
                colour = 'rgba(255, 50, 50, 0.4)';
                break;
              case '2':
                colour = 'rgba(255, 100, 50, 0.4)';
                break;
              case '3':
                colour = 'rgba(255, 255, 50, 0.4)';
                break;
              case '4':
                colour = 'rgba(50, 255, 50, 0.4)';
                break;
              default:
                colour = 'rgba(50, 50, 255, 0.4)';
            }

            return (
              <span key={index} className={styles.Jlpt} style={{background: colour}}>
                JLPT N{levelNum}
              </span>
            )
          })}
        </div>

        {/* Main Form */}
        <div className={styles.Entry}>
          { (mainForm.word) ?
            <>
              {mainForm.reading && <div className={styles.Reading}>{mainForm.reading}</div>}
              <div className={styles.Word}>{mainForm.word}</div>
            </> :
            <div className={styles.Word}>{mainForm.reading}</div>
          }
        </div>

        {/* Senses */}
        <div className={styles.Senses}>
          {data.senses.map((sense: any, index: number) => {
            return (
              <div key={index} className={styles.Sense}>
                {sense.parts_of_speech.map((pos: string, index: number) => {
                  return (
                    <span key={index}>
                      {pos}
                    </span>
                  )
                })}
                
                {sense.english_definitions.map((definition: string, index: number) => {
                  return (
                    <span key={index} className={styles.Definition}>
                      {definition}
                    </span>
                  )
                })}
              </div>
            )
          })}
        </div>
        
        {/* Other Forms */}
        { (data.japanese.length > 1) && (
          <div className={styles.OtherForms}>
            <br />
            Other Forms:

            <div className={styles.Forms}>
              { data.japanese.map((japanese: any, index: number) => {
                  if (index === 0) return;

                  return (
                    <span key={index} className={styles.Form}>
                        { (japanese.word) ?
                          <>
                            <span className={styles.FormWord}>
                              {japanese.word}
                              { (japanese.reading) && 
                                <span>
                                  {`【${japanese.reading}】`}
                                </span>
                              }
                            </span>
                          </> :
                          <span className={styles.FormWord}>
                            {`${japanese.reading}`}
                          </span>
                        }
                        <span>{(index != data.japanese.length - 1) ? ' 、' : ''}</span>
                    </span>
                  )
                })
              }
            </div>
          </div>
        )}
      </section>

      {/* Jisho Link */}
      <section className={styles.JishoLink}>
        <a href={`https://jisho.org/search/${data.slug}`} target="_blank" rel="noreferrer">
          View on Jisho.org ≫
        </a>
      </section>
    </article>
  );
};

export default SearchResult;
