import Image from 'next/image';

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
  return (
    <div className={styles.Background}>
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
        alt="Background"
        fill={true}
        quality={100}
      />
    </div>
  );
};

export default Background;
