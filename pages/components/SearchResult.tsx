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
  console.log(props.resultData);
  
  return (
    <div className={styles.resultPanel}>
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

      { data.japanese.map((japanese: any, index: number) => (
        <div key={index} className={styles.entry}>
          { (japanese.word) ?
            <>
              {japanese.reading && <div className={styles.reading}>{japanese.reading}</div>}
              <div className={styles.word}>{japanese.word}</div>
            </> :
            <div className={styles.word}>{japanese.reading}</div>
          }
        </div>
      ))}
    </div>
  );
};
