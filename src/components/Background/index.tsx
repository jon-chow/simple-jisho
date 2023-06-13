import { useState, useEffect } from 'react';
import Image from 'next/image';

import { getSetting } from '@src/contexts/SettingsProvider';

import { BackgroundData } from '@src/configs/config';

import styles from './Background.module.scss';


/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */

/**
 * Creates the background for the site. \
 * An image background with a blurring overlay.
 * @returns The background component.
 */
const Background = (): JSX.Element => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [image, setImage] = useState(BackgroundData.image);
  const [blur, setBlur] = useState(BackgroundData.blurAmount);

  /**
   * Handles changes to the background image.
   */
  const handleBackgroundChange = (): void => {
    setIsLoaded(getSetting("backgroundImage"));
    setImage(getSetting("backgroundUrl"));
    setBlur(getSetting("backgroundBlur"));
  };

  // Check if the background image is loaded and updates the state.
  useEffect(() => {
    setIsLoaded(getSetting("backgroundImage"));
    setImage(getSetting("backgroundUrl"));
    setBlur(getSetting("backgroundBlur"));

    window.addEventListener("storage_settings", handleBackgroundChange);
    return () => window.removeEventListener("storage_settings", handleBackgroundChange);
  }, []);

  return (
    <div className={styles.Background}>
      { isLoaded ? (
        <>
          <div className={styles.Overlay}
            style={{
              background: BackgroundData.overlayColor,
              backdropFilter: `blur(${blur}px)`
            }}
          />
          <Image
            className={styles.BackgroundImage}
            loader={({ src }) => src}
            unoptimized={true}
            src={image}
            alt=""
            fill={true}
            quality={100}
          />
        </>
      ) : (
        <div className={styles.BackgroundSimple} />
      )}
    </div>
  );
};

export default Background;
