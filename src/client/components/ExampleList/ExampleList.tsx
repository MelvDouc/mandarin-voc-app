import cssClasses from "./ExampleList.module.scss";

export default function ExampleList({ children }: {
  children?: unknown[];
}) {
  return (
    <ul className={cssClasses.ExampleList}>{children}</ul>
  );
}

ExampleList.Example = ({ children }: {
  children?: unknown;
}) => {
  return (<span>{children}</span>);
};