import { useState, useEffect } from 'react';
import { BsClipboard, BsInfoCircle, BsStar, BsStarFill } from 'react-icons/bs';

import { useNotifications, MessageType } from '@/contexts/NotificationsProvider';
import { useModal, ModalType, toggleModal } from '@/contexts/ModalProvider';

import styles from './SearchResult.module.scss';


/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */
/**
 * Creates the SearchResult component.
 * 
 * The SearchResult component contains data on a search.
 */
const SearchResult = (props: any) => {
  const [isSaved, setIsSaved] = useState(false);

  const notificationsContext = useNotifications();
  const kanjiContext = useModal();

  const data = props.resultData;
  const mainForm = data.japanese[0];

  const copyToClipboard = (text: string) => {
    // const currentText = await navigator.clipboard.readText();
    // if (currentText === text) return;
    
    navigator.clipboard.writeText(text);

    const message: MessageProps = {
      id: notificationsContext.hashMessage(),
      type: MessageType.INFO,
      title: "Copied to Clipboard!",
      message: `Copied "${text}" to clipboard!`,
      duration: 3000,
    };
    notificationsContext.pushMessage(message);
  };

  const saveWord = (word: any) => {
    const savedWords = JSON.parse(localStorage.getItem('savedWords') || '[]');
    const wordExists = savedWords.some((w: any) => w.slug === word.slug);

    if (wordExists) {
      const newSavedWords = savedWords.filter((w: any) => w.slug !== word.slug);
      localStorage.setItem('savedWords', JSON.stringify(newSavedWords));
      setIsSaved(false);
    } else {
      savedWords.push(word);
      localStorage.setItem('savedWords', JSON.stringify(savedWords));
      setIsSaved(true);
    }
  };

  // Toggle the kanji info modal.
  const toggleKanjiInfoModal = (kanji: any[]) => {
    kanjiContext.setData(kanji);
    toggleModal(kanjiContext, ModalType.KANJI);
  };

  // Check if word is saved.
  useEffect(() => {
    const savedWords = JSON.parse(localStorage.getItem('savedWords') || '[]');
    const wordExists = savedWords.some((w: any) => w.slug === data.slug);

    setIsSaved(wordExists);
  }, [data]);
  
  return (
    <article className={styles.ResultPanel}>
      {/* Jisho Search */}
      <section className={styles.JishoSearch}>
        <div className={styles.SearchHeader}>
          {/* Main Form */}
          <div className={styles.Word}>
            <ruby>
              {mainForm.word ? mainForm.word : mainForm.reading}
              <rt>{mainForm.word ? mainForm.reading : ''}</rt>
            </ruby>

            <button
              title="Copy to Clipboard"
              onClick={() => copyToClipboard(mainForm.word ? mainForm.word : mainForm.reading)}
            >
              <BsClipboard />
            </button>

            {/* Kanji Info */}
            { (data.kanji.length > 0) &&
              <button
                title="Kanji Info"
                onClick={() => toggleKanjiInfoModal(data.kanji)}
              >
                <BsInfoCircle />
              </button>
            }

            <button
              title={isSaved ? "Unsave Term" : "Save Term"}
              onClick={() => saveWord(data)}
            >
              { isSaved ?
                <BsStarFill
                  style={{
                    fill: "rgb(255, 225, 120)",
                    filter: "drop-shadow(0 0 0.25rem rgba(255, 225, 120, 0.5))",
                    animation: `${styles.Favourite} 0.25s ease-in-out forwards`
                  }}
                /> :
                <BsStar
                  style={{
                    animation: `${styles.Favourite} 0.25s ease-in-out backwards`
                  }}
                />
              }
            </button>
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
                case '1': colour = 'rgba(255, 50, 50, 0.4)';  break;
                case '2': colour = 'rgba(255, 100, 50, 0.4)'; break;
                case '3': colour = 'rgba(255, 255, 50, 0.4)'; break;
                case '4': colour = 'rgba(50, 255, 50, 0.4)';  break;
                default:  colour = 'rgba(50, 50, 255, 0.4)';
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
        </div>

        <div className={styles.SearchBody}>
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
        </div>
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
