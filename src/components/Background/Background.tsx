import { useState, useEffect } from 'react';
import Image from 'next/image';

import { getSetting } from '@/contexts/SettingsProvider';

import { BackgroundData } from '@/configs/config';

import styles from './Background.module.scss';


/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */
/**
 * Creates the background for the page.
 * 
 * An image background with a blurring overlay.
 */
const Background = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Handle background image toggles.
  const handleBackgroundChange = () => {
    setIsLoaded(getSetting("backgroundImage"));
  };

  // Check if the background image is loaded and updates the state.
  useEffect(() => {
    setIsLoaded(getSetting("backgroundImage"));

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
              backdropFilter: `blur(${BackgroundData.blurAmount}px)`
            }}
          />
          <Image
            className={styles.BackgroundImage}
            loader={({ src }) => src}
            unoptimized={true}
            src={BackgroundData.image}
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
