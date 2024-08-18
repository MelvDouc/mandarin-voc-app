import cssClasses from "./Dialog.module.scss";

export default function Dialog({ className, children, ...props }: JSX.IntrinsicElements["dialog"] & {
  children?: unknown;
}) {
  return (
    <dialog {...props} className={cssClasses.Dialog}>{children}</dialog>
  );
}