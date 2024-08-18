import cssClasses from "./Hanzi.module.scss";

export default function Hanzi({ zh, py }: {
  zh: string;
  py: string;
}) {
  const pinyin = py.split(",");

  return (
    <span className={cssClasses.Hanzi}>
      {zh
        .split(",")
        .map((ch, i) => (
          <ruby title={pinyin[i]}>{ch}<rp>(</rp><rt>{pinyin[i]}</rt><rp>)</rp></ruby>
        ))}
    </span>
  );
}