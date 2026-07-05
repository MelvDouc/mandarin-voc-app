import classNames from "classnames";
import cssClasses from "./Trl.module.scss";

export default function Trl({ value, id, highlightedId, setHighlightedId }: {
  value: string;
  id: number;
  highlightedId: number | null;
  setHighlightedId: (id: number | null) => void;
}) {
  const className = classNames({
    [cssClasses.Trl]: true,
    [cssClasses.highlighted]: highlightedId === id
  });

  return (
    <span
      className={className}
      onMouseEnter={() => setHighlightedId(id)}
      onMouseLeave={() => setHighlightedId(null)}
    >{value}</span>
  );
}