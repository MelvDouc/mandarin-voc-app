// ===== ===== ===== ===== =====
// UTILS
// ===== ===== ===== ===== =====

export type ResultTuple<T> = [data: T, error: null] | [data: null, error: string[]];
export type WithoutId<T> = Omit<T, "id">;

// ===== ===== ===== ===== =====
// DB ENTITIES
// ===== ===== ===== ===== =====

export interface Entity {
  readonly id: number;
}

export interface Topic extends Entity {
  /**
   * @length 50
   */
  title: string;
  /**
   * @text
  */
  content: string;
  /**
   * @length 40
   * @unique
   */
  slug: string;
  category: Category | null;
  tags: Tag[];
}

export interface Category extends Entity {
  /**
   * @length 50
   * @unique
   */
  name: string;
}

export interface Tag extends Entity {
  /**
   * @length 20
   * @unique
   */
  value: string;
}

export interface User extends Entity {
  /**
   * @length 100
   * @unique
   */
  email: string;
  /**
   * @length 255
   */
  password: string;
  /**
   * @length 128
   * @unique
   */
  password_reset_id: string | null;
}