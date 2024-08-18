import cssClasses from "./TranslationList.module.scss";

export default function TranslationList({ children }: {
  children?: unknown;
}) {
  return (
    <ul className={cssClasses.TranslationList}>{children}</ul>
  );
}