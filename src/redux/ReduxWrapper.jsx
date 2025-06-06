import { Provider } from "react-redux";
import store from "./store";


const ReduxWrapper = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxWrapper;
