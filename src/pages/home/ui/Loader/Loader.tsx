import styles from './Loader.module.css';

export const Loader: React.FC = () => {
  return (
    <>
      <div className={styles.loaderContainer}>
        <div className={styles.planet}>
          <div className={styles.record}></div>
        </div>
      </div>
      <p className={styles.text}>Подождите, обработка данных</p>
    </>
  );
};
