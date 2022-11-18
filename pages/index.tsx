import Head from 'next/head'
import styles from '../styles/Home.module.scss'

const appName = "Simple Jisho";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>{appName}</title>
        <meta
          name="description"
          content="A reformatted, simpler version of jisho.org. Look up Japanese words!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <h1>{appName}</h1>
      </header>

      <main className={styles.main}>
        
      </main>

      <footer className={styles.footer}>
        <div>&copy; {new Date().getFullYear()} jon-chow.</div>

        <div>
          <span>This application makes calls to the </span>
          <span>
            <a href="https://jisho.org/" no-referrer='noreferrer' target='blank'>
              jisho.org
            </a>
          </span>
          <span> API.</span>
        </div>
      </footer>
    </div>
  )
}
