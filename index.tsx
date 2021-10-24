let React = {
  createElement: (tag, props, ...children) => {
    if (typeof tag === "function") {
      return tag(props);
    }
    const element = { tag, props: { ...props, children } };

    return element;
  },
};

const states = [];
let stateCursor = 0;

const useState = (initialState) => {
  const FROZEN_CURSOR = stateCursor;
  states[FROZEN_CURSOR] = states[FROZEN_CURSOR] || initialState;
  const setState = (newState) => {
    states[FROZEN_CURSOR] = newState;
    rerender();
  };
  stateCursor++;
  return [states[FROZEN_CURSOR], setState];
};

const App = () => {
  const [name, setName] = useState("gk");
  const [age, setAge] = useState(0);

  return (
    <div className="react-2021">
      <h1>Hello, {name}!</h1>
      <input
        value={name}
        onchange={(e) => setName(e.target.value)}
        type="text"
        placeholder="name"
      />
      <button type="button" onclick={() => setAge(age + 1)}>
        Add
      </button>
      <button type="button" onclick={() => setAge(age - 1)}>
        Des
      </button>
      <p>my age is {age}</p>
    </div>
  );
};

const rerender = () => {
  stateCursor = 0;
  document.getElementById("root").firstChild.remove();
  render(<App />, document.querySelector("#root"));
};

const render = (element, container) => {
  if (["string", "number"].includes(typeof element)) {
    container.appendChild(document.createTextNode(element));
    return;
  }
  const dom = document.createElement(element.tag);

  Object.keys(element.props)
    ?.filter((prop) => prop !== "children")
    .forEach((key) => {
      dom[key] = element.props[key];
    });

  element.props.children?.forEach((child) => render(child, dom));
  container.appendChild(dom);
};

render(<App />, document.getElementById("root"));
