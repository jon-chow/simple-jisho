import { useState, useEffect } from 'react';
import { BsClipboard, BsInfoCircle, BsStar, BsStarFill } from 'react-icons/bs';
import { FaAngleDown } from 'react-icons/fa';

import { setLocalStorage } from '@src/utils/setLocalStorage';

import { useNotifications, MessageType, createMessage } from '@src/contexts/NotificationsProvider';
import { useModal, ModalType, toggleModal } from '@src/contexts/ModalProvider';

import styles from './SearchResult.module.scss';


/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */

/**
 * Creates the SearchResult component. \
 * The SearchResult component contains data on a search.
 * @param props The props of the SearchResult component.
 * @return The SearchResult component.
 */
const SearchResult = (props: any): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const notificationsContext = useNotifications();
  const kanjiContext = useModal();

  const data = props.resultData;
  const mainForm = data.japanese[0];

  /**
   * Copies text to the clipboard.
   * @param text The text to copy to the clipboard.
   * @async
   */
  const copyToClipboard = async (text: string): Promise<void> => {
    const currentText = await navigator.clipboard.readText();

    // Check if text is already copied.
    if (currentText === text) {
      notificationsContext.addMessage(
        createMessage(
          MessageType.INFO,
          "Already Copied!",
          `Already copied "${text}" to clipboard!`,
          3000
        )
      );
      return;
    };
    
    // Copy text to clipboard.
    navigator.clipboard.writeText(text);
    notificationsContext.addMessage(
      createMessage(
        MessageType.INFO,
        "Copied to Clipboard!",
        `Copied "${text}" to clipboard!`,
        3000
      )
    );
  };

  /**
   * Saves or unsaves a word to local storage.
   * @param word The word to save or unsave.
   */
  const saveWord = (word: any): void => {
    const savedWords = JSON.parse(localStorage.getItem('savedWords') || '[]');
    const wordExists = savedWords.some((w: any) => w.slug === word.slug);

    if (wordExists) {
      const newSavedWords = savedWords.filter((w: any) => w.slug !== word.slug);
      setLocalStorage('savedWords', newSavedWords);
      setIsSaved(false);
    } else {
      word = { ...word, savedAt: Date.now() };
      savedWords.push(word);
      setLocalStorage('savedWords', savedWords);
      setIsSaved(true);
    }
  };

  /**
   * Toggles the kanji info modal.
   * @param kanji An array of kanji to display in the modal.
   */
  const toggleKanjiInfoModal = (kanji: any[]): void => {
    kanjiContext.setData(kanji);
    toggleModal(kanjiContext, ModalType.KANJI);
  };

  // Check if word is saved.
  useEffect(() => {
    const savedWords = JSON.parse(localStorage.getItem('savedWords') || '[]');
    const wordExists = savedWords.some((w: any) => w.slug === data.slug);

    setIsSaved(wordExists);
    // Refresh expanded state.
    setIsExpanded(true);
  }, [data]);
  
  return (
    <article className={styles.ResultPanel}>
      {/* Jisho Search */}
      <section className={styles.JishoSearch}>
        <div className={styles.SearchHeader}>
          {/* Main Form */}
          <div className={styles.Word}>
            <FaAngleDown
              className={styles.DropDownButton}
              style={{
                transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)'
              }}
              onClick={() => setIsExpanded(!isExpanded)}
            />
            <div className={styles.VerticalLine} />
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
              </button> }

            <button
              title={isSaved ? "Unsave Term" : "Save Term"}
              onClick={() => saveWord(data)}
            >
              { isSaved ?
                <BsStarFill
                  style={{
                    fill: "rgb(255, 225, 120)",
                    filter: "drop-shadow(0 0 0.25rem rgba(255, 225, 120, 0.5))",
                    animation: `${styles.Favourite} 0.2s ease forwards`
                  }}
                /> :
                <BsStar
                  style={{
                    animation: `${styles.Favourite} 0.2s ease backwards`
                  }}
                /> }
            </button>

            {/* Time Stamp */}
            { (data.savedAt) &&
              <span className={styles.SavedAt}>
                ({new Date(data.savedAt).toLocaleDateString() + ' ' + new Date(data.savedAt).toLocaleTimeString()})
              </span> }
          </div>

          {/* JLPT / Rarity Tags */}
          <div className={styles.Tags}>
            { (data.is_common) ? 
              <span className={styles.Common} style={{background: 'rgba(50, 255, 50, 0.4)'}}>Common</span> :
              <span className={styles.Common} style={{background: 'rgba(50, 50, 255, 0.4)'}}>Uncommon</span> }
            { data.jlpt.map((level: string, index: number) => {
              const levelNum = level.replace('jlpt-n', '');
              let colour;

              switch(levelNum) {
                case '1': colour = 'rgba(255, 50, 50, 0.4)';  break;
                case '2': colour = 'rgba(255, 100, 50, 0.4)'; break;
                case '3': colour = 'rgba(255, 255, 50, 0.4)'; break;
                case '4': colour = 'rgba(50, 255, 50, 0.4)';  break;
                default:  colour = 'rgba(50, 50, 255, 0.4)';
              };

              return (
                <span
                  key={index}
                  className={styles.Jlpt}
                  style={{background: colour}}
                >
                  JLPT N{levelNum}
                </span>
              );
            })}
          </div>
        </div>

        <div
          className={styles.SearchBody}
          style={{ maxHeight: isExpanded ? '100vh' : '0px' }}
        >
          {/* Senses */}
          <div className={styles.Senses}>
            {data.senses.map((sense: any, index: number) => {
              return (
                <div key={index} className={styles.Sense}>
                  <span className={styles.PartOfSpeech}>
                    { sense.parts_of_speech.map((pos: string, i: number) => {
                      return (i === sense.parts_of_speech.length - 1) ? pos : `${pos}, `;
                    })}
                  </span>
                  <span className={styles.Definition}>
                    <span className={styles.DefinitionNumber}>{`${index + 1}. `}</span>
                    { sense.english_definitions.map((definition: string, i: number) => {
                      return (i === sense.english_definitions.length - 1) ? definition : `${definition}; `;
                    })}
                  </span>
                  <div className={styles.Links}>
                    { sense.links.map((link: any, i: number) => (
                      <a
                        key={i}
                        className={styles.WikiLink}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        { link.text } ≫
                      </a>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* Other Forms */}
          { (data.japanese.length > 1) && (
            <div className={styles.OtherForms}>
              <h1 className={styles.FormsHeader}>Other Forms</h1>
              <div className={styles.Forms}>
                { data.japanese.map((japanese: any, index: number): JSX.Element | void => {
                    if (index === 0) return;

                    return ((japanese.word) ?
                      <span key={index} className={styles.FormWord}>
                        {`${japanese.word} ${(japanese.reading) && `【${japanese.reading}】`}${(index !== data.japanese.length - 1) ? '、' : ''}`}
                      </span> :
                      <span key={index} className={styles.FormWord}>
                        {`${japanese.reading}${(index !== data.japanese.length - 1) ? '、' : ''}`}
                      </span>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Example Sentences */}
          { (data.sentences.length > 0) && (
            <div className={styles.Sentences}>
              <h1 className={styles.ExamplesHeader}>Example Sentences</h1>
              <div className={styles.Examples}>
                { data.sentences.map((sentence: any, index: number): JSX.Element => {
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
                  );
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
