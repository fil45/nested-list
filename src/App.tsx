import "./styles.css";
import useList from "./useList";
import NestedList from "./NestedList";

export default function App() {
  const { state, dispatch } = useList();
  return (
    <div className="App">
      <h1>A Nested List Editor</h1>
      <NestedList state={state} dispatch={dispatch} parentId={null} />
    </div>
  );
}
