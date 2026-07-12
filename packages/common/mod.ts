export const enum ExceptionKind {
  Database,
  NotFound,
  Form,
  Other
}

export type DatabaseException = {
  kind: ExceptionKind.Database;
  message: string;
};

export type NotFoundException = {
  kind: ExceptionKind.NotFound;
};

export type FormException = {
  kind: ExceptionKind.Form;
  messages: Record<string, string[]>;
};

export type OtherException = {
  kind: ExceptionKind.Other;
  message?: string;
};

export type Exception = DatabaseException | NotFoundException | FormException | OtherException;

export type Result<T> = [data: T, exception: null] | [data: null, exception: Exception];

export type Topic = {
  slug: string;
  title: string;
  zhml: string;
};
