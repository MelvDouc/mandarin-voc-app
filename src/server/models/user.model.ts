import type { User } from "$/global-types.js";
import Model from "$/server/core/Model.js";
import passwordService from "$/server/services/auth.service.js";
import { insertInto, selectFrom, update } from "mysql-query-maker";
import { z } from "zod";

const PasswordSchema = z.string()
  .min(8, "Password should be at least 8 characters long.")
  .max(50, "Password should be at most 50 characters long.");

const UserSchema = z.object({
  email: z.string().email("Please provide a valid email address."),
  password: PasswordSchema
});

class UserModel extends Model {
  @Model.asyncWrapper(() => ["Users unavailable."])
  async findAll() {
    const sql = selectFrom("user")
      .column("id")
      .column("email")
      .orderBy("id")
      .getSql();
    const users = await this.query<Pick<User, "id" | "email">>(sql);
    return this.asTuple(users);
  }

  @Model.asyncWrapper()
  async findOneByEmail(email: string) {
    const sql = selectFrom("user")
      .column("*")
      .where("email = :email")
      .getSql({ email });
    const users = await this.query<User>(sql);

    if (users.length === 0)
      throw new Error("Invalid credentials.");

    return this.asTuple(users[0]);
  }

  @Model.asyncWrapper()
  async findOneByCredentials({ email, password }: Pick<User, "email" | "password">) {
    const [user, error] = await this.findOneByEmail(email);

    if (error)
      throw error;

    const passwordCheck = await passwordService.checkPassword(password, user.password);

    if (!passwordCheck)
      throw new Error("Invalid credentials.");

    return this.asTuple(user);
  }

  @Model.asyncWrapper()
  async add(user: Pick<User, "email" | "password">) {
    UserSchema.parse(user);
    const hashedPassword = await passwordService.hashPassword(user.password);
    const header = await this.execute(
      insertInto("user")
        .columns(["email", "password"])
        .value([user.email, hashedPassword])
        .getSql()
    );
    return this.asTuple(header.insertId);
  }

  @Model.asyncWrapper()
  async updatePassword(id: number, passwordResetId: number, newPassword: string) {
    PasswordSchema.parse(newPassword);
    const hashedPassword = await passwordService.hashPassword(newPassword);
    await this.execute(
      update("user")
        .set("password", ":hashedPassword")
        .set("password_reset_id", "NULL")
        .where("id = :id AND password_reset_id = :passwordResetId")
        .getSql({ id, passwordResetId, hashedPassword })
    );
    return this.nullTuple();
  }

  @Model.asyncWrapper()
  async setPasswordResetId(id: number) {
    const pri = passwordService.generateResetId();
    await this.execute(
      update("user")
        .set("password_reset_id", ":pri")
        .where("id = :id")
        .getSql({ pri, id })
    );
    return this.asTuple([pri, null]);
  }
}

const userModel = new UserModel();
export default userModel;