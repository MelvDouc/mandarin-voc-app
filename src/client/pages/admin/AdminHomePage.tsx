export default function AdminHomePage() {
  return (
    <>
      <h1>Admin space</h1>
      <ul>
        <li><a href="/admin/topics">Topics</a></li>
        <li><a href="/admin/categories">Categories</a></li>
        <li><a href="/admin/tags">Tags</a></li>
        <li><a href="/admin/users">Users</a></li>
      </ul>
    </>
  );
}