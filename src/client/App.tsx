import FlashMessageList from "$/client/components/FlashMessageList/FlashMessageList.jsx";
import Header from "$/client/components/Header/Header.jsx";
import AdminHomePage from "$/client/pages/admin/AdminHomePage.jsx";
import AddCategoryPage from "$/client/pages/admin/categories/AddCategoryPage.jsx";
import CategoryListPage from "$/client/pages/admin/categories/CategoryListPage.jsx";
import UpdateCategoryPage from "$/client/pages/admin/categories/UpdateCategoryPage.jsx";
import TagListPage from "$/client/pages/admin/tags/TagListPage.jsx";
import AddTopicPage from "$/client/pages/admin/topics/AddTopicPage.jsx";
import TopicListPage from "$/client/pages/admin/topics/TopicListPage.jsx";
import UpdateTopicPage from "$/client/pages/admin/topics/UpdateTopicPage.jsx";
import CreateUserPage from "$/client/pages/admin/users/CreateUserPage.jsx";
import UserListPage from "$/client/pages/admin/users/UserListPage.jsx";
import LogInPage from "$/client/pages/auth/LogInPage.jsx";
import PasswordResetPage from "$/client/pages/auth/PasswordResetPage.jsx";
import HomePage from "$/client/pages/HomePage.jsx";
import ResourcesPage from "$/client/pages/ResourcesPage.jsx";
import TopicPage from "$/client/pages/TopicPage.jsx";
import auth from "$/client/state/auth.js";
import { addFlashMessage, getFlashMessages } from "$/client/state/flash-messages.js";
import type { FlashMessage } from "$/client/types.js";
import { redirect, Route, Router } from "client-side-router";
import { obs } from "reactfree-jsx";
import cssClasses from "./App.module.scss";

export default function App() {
  const flashMessageObs = obs<FlashMessage[]>([]);

  const onNavigationStarted = async ({ path }: {
    path: string;
  }) => {
    if (path.startsWith("/admin") && !auth.isLoggedIn()) {
      addFlashMessage("error", "You're not logged in.");
      throw redirect("/log-in");
    }
  };

  const onNavigationComplete = () => {
    flashMessageObs.value = getFlashMessages();
  };

  return (
    <div className={cssClasses.App}>
      <Header />
      <main>
        <Router
          onNavigationStarted={onNavigationStarted}
          onNavigationComplete={onNavigationComplete}
        >
          <Route path="/" component={HomePage} title="Home" />
          <Route path="/resources" component={ResourcesPage} title="Resources" />
          <Route path="/topics/:slug" component={TopicPage} title="Topic" />
          <Route path="/log-in" component={LogInPage} title="Log in" />
          <Route path="/reset-password/:id/:passwordResetId" component={PasswordResetPage} title="Update your password" />
          <Route path="/admin" component={AdminHomePage} title="Admin" />
          <Route path="/admin/topics" component={TopicListPage} title="Admin | Topics" />
          <Route path="/admin/topics/add" component={AddTopicPage} title="Admin | Add a topic" />
          <Route path="/admin/topics/update/:id" component={UpdateTopicPage} title="Admin | Update a topic" />
          <Route path="/admin/categories" component={CategoryListPage} title="Admin | Categories" />
          <Route path="/admin/categories/add" component={AddCategoryPage} title="Admin | Add a category" />
          <Route path="/admin/categories/update/:id" component={UpdateCategoryPage} title="Admin | Update a category" />
          <Route path="/admin/tags" component={TagListPage} title="Admin | Tags" />
          <Route path="/admin/users" component={UserListPage} title="Admin | Users" />
          <Route path="/admin/users/create" component={CreateUserPage} title="Admin | Add a user" />
        </Router>
        <FlashMessageList flashMessageObs={flashMessageObs} />
      </main>
    </div>
  );
}