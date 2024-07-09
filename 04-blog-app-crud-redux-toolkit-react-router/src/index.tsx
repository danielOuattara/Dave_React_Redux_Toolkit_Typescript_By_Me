import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { Provider } from "react-redux";
import store from "./store";

import { fetchUsers } from "./features/user/userExtraActions";
import { fetchPosts } from "./features/post/postExtraActions";

store.dispatch(fetchUsers());
store.dispatch(fetchPosts());

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <Provider store={store}>
    <App />
  </Provider>,
);
