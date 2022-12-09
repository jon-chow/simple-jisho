import styles from '../../styles/SearchResult.module.scss';

/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */
/**
 * Exports the SearchResult component.
 * 
 * The SearchResult component contains data on a search.
 */
export default function SearchResult(props: any) {
  const data = props.resultData;
  const mainForm = data.japanese[0];
  console.log(props.resultData);
  
  return (
    <div className={styles.resultPanel}>
      {/* JLPT / Rarity Tags */}
      <div className={styles.tags}>
        { (data.is_common) ? 
          <span className={styles.common} style={{background: 'rgba(50, 255, 50, 0.4)'}}>Common</span> :
          <span className={styles.common} style={{background: 'rgba(50, 50, 255, 0.4)'}}>Uncommon</span>
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
            <span key={index} className={styles.jlpt} style={{background: colour}}>
              JLPT N{levelNum}
            </span>
          )
        })}
      </div>

      {/* Main Form */}
      <div className={styles.entry}>
        { (mainForm.word) ?
          <>
            {mainForm.reading && <div className={styles.reading}>{mainForm.reading}</div>}
            <div className={styles.word}>{mainForm.word}</div>
          </> :
          <div className={styles.word}>{mainForm.reading}</div>
        }
      </div>

      {/* Senses */}
      <div className={styles.senses}>
        {data.senses.map((sense: any, index: number) => {
          return (
            <div key={index} className={styles.sense}>
              {sense.parts_of_speech.map((pos: string, index: number) => {
                return (
                  <span key={index} className={styles.pos}>
                    {pos}
                  </span>
                )
              })}
              
              {sense.english_definitions.map((definition: string, index: number) => {
                return (
                  <span key={index} className={styles.definition}>
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
        <div className={styles.otherForms}>
          <br />
          Other Forms:

          <div className={styles.forms}>
            { data.japanese.map((japanese: any, index: number) => {
                if (index === 0) return;

                return (
                  <span key={index} className={styles.form}>
                      { (japanese.word) ?
                        <>
                          <span className={styles.formWord}>
                            {japanese.word}
                            { (japanese.reading) && 
                              <span>
                                {`【${japanese.reading}】`}
                              </span>
                            }
                          </span>
                        </> :
                        <span className={styles.formWord}>
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
    </div>
  );
};
