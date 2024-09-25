import styles from "./Container.module.css";

interface ContainerProps {
  children: React.ReactNode;
}

const Container = ({ children }: ContainerProps) => {
  return <main className={styles.container}>{children}</main>;
};

export default Container;
