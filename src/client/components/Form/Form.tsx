import cssClasses from "./Form.module.scss";

export default function Form({ children, ...props }: FormProps) {
  return (
    <form className={cssClasses.Form} {...props}>{children}</form>
  );
}

Form.Row = ({ children }: ChildrenOnlyProps) => {
  return (
    <section className={cssClasses.FormRow}>{children}</section>
  );
};

Form.Column = ({ children }: ChildrenOnlyProps) => {
  return (
    <article className={cssClasses.FormColumn}>{children}</article>
  );
};

Form.Input = <T extends object,>({ bind, $init, children, ...props }: JSX.IntrinsicElements["input"] & ChildrenOnlyProps & {
  bind?: [T, keyof T];
}) => {
  return (
    <input
      {...props}
      $init={(element) => {
        $init && $init(element);
        if (bind) {
          const [obj, key] = bind;
          element.addEventListener("input", () => (obj[key] as string) = element.value);
        }
      }}
    />
  );
};

Form.Textarea = <T extends object,>({ bind, $init, children, ...props }: JSX.IntrinsicElements["textarea"] & ChildrenOnlyProps & {
  bind?: [T, keyof T];
}) => {
  return (
    <textarea
      {...props}
      $init={(element) => {
        $init && $init(element);
        if (bind) {
          const [obj, key] = bind;
          element.addEventListener("input", () => (obj[key] as string) = element.value);
        }
      }}
    ></textarea>
  );
};

interface ChildrenOnlyProps {
  children?: unknown;
}

type FormProps = ChildrenOnlyProps & JSX.IntrinsicElements["form"];