import api from "$/client/utils/api.js";
import type { User } from "$/global-types.js";

export default async function UserListPage() {
  const [users, error] = await api.get<Pick<User, "id" | "email">[]>("/auth/users");

  if (error)
    return (<p>{error[0]}</p>);

  return (
    <>
      <h1>Users</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(({ id, email }) => (
            <tr>
              <td>{id}</td>
              <td>{email}</td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}