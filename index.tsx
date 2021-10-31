let React = {
  createElement: (tag, props, ...children) => {
    if (typeof tag === "function") {
      try {
        return tag(props);
      } catch ({ promise, key }) {
        promise.then((data) => {
          promiseCache.set(key, data);
          rerender();
        });
        return { tag: "h1", props: { children: ["I am  loading..."] } };
      }
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

const promiseCache = new Map();

const createResource = (thingThatReturnASomething, key) => {
  if (promiseCache.has(key)) {
    return promiseCache.get(key);
  }
  throw { promise: thingThatReturnASomething(), key };
};

const App = () => {
  const [name, setName] = useState("gk");
  const [age, setAge] = useState(0);
  const dogPhotoUrl = createResource(
    () =>
      fetch("https://dog.ceo/api/breeds/image/random")
        .then((res) => res.json())
        .then((payload) => payload.message),
    "dogPhoto"
  );

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
      <h3>
        <img src={dogPhotoUrl} alt="my dog" />
      </h3>
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
