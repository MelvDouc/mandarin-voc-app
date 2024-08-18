import cssClasses from "./Button.module.scss";

export default function Button({ children, color, $init, ...props }: {
  children?: unknown;
  color?: "red" | "green" | "blue";
} & JSX.IntrinsicElements["button"]) {
  return (
    <button
      {...props}
      $init={(element) => {
        $init && $init(element);
        element.classList.add(cssClasses.Button);
        switch (color) {
          case "red":
            element.classList.add(cssClasses.Red);
            break;
          case "green":
            element.classList.add(cssClasses.Green);
            break;
          case "blue":
            element.classList.add(cssClasses.Blue);
        }
      }}
    >{children}</button>
  );
}