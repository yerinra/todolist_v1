const $todoInput = document.querySelector(".todo-input");
const $todoList = document.querySelector(".todo-list");
const $todoFilters = document.querySelector(".todo-filters");

// state
let state = { todos: [] };
let currentFilter = "all";

// functions
const render = () => {
  const _todos = state.todos.filter((todo) =>
    currentFilter === "all"
      ? todo
      : currentFilter === "completed"
      ? !!todo.completed
      : !todo.completed
  );

  $todoList.innerHTML = _todos
    .map(
      ({ id, content, completed }) => `
        <li id="${id}">
          <input type="checkbox" ${completed ? "checked" : ""} />
          <span>${content}</span>
          <button class="todo-remove">X</button>
        </li>
        `
    )
    .join("");
};

const setState = (newState) => {
  state = newState;
  localStorage.setItem("state", JSON.stringify(newState));
  render();
};

const fetchTodo = () => {
  setState(
    JSON.parse(localStorage.getItem("state")) || {
      ...state,
      todos: [
        { id: 3, content: "Javascript", completed: false },
        { id: 2, content: "CSS", completed: true },
        { id: 1, content: "HTML", completed: false },
      ],
    }
  );
};

const generateNextId = () =>
  Math.max(...state.todos.map((todo) => todo.id), 0) + 1;

const addTodo = (content) => {
  setState({
    ...state,
    todos: [
      { id: generateNextId(), content, completed: false },
      ...state.todos,
    ],
  });
};

const toggleTodoCompleted = (id) => {
  setState({
    ...state,
    todos: state.todos.map((todo) =>
      todo.id === +id ? { ...todo, completed: !todo.completed } : todo
    ),
  });
};

const removeTodo = (id) => {
  setState({
    ...state,
    todos: state.todos.filter((todo) => todo.id !== +id),
  });
};

// 할 일 추가
$todoInput.addEventListener("keydown", (e) => {
  const content = e.target.value;
  if (e.key !== "Enter" || content.trim() === "") return;
  if (e.isComposing || e.keyCode === 229) return;

  addTodo(content);
  e.target.value = "";
});

// 할 일 완료
$todoList.addEventListener("change", (e) => {
  // if (!e.target.matches('.todo-list > li > input[type=checkbox]')) return;
  toggleTodoCompleted(e.target.parentNode.id);
});

// 할 일 제거
$todoList.addEventListener("click", (e) => {
  if (!e.target.classList.contains("todo-remove")) return;
  removeTodo(e.target.parentNode.id);
});

// 할 일 필터링
$todoFilters.addEventListener("click", (e) => {
  if (e.target === $todoFilters) return;

  document.querySelector(".active").classList.remove("active");
  e.target.classList.add("active");

  if (e.target === document.querySelector("#all")) {
    currentFilter = "all";
  } else if (e.target === document.querySelector("#completed")) {
    currentFilter = "completed";
  } else if (e.target === document.querySelector("#active")) {
    currentFilter = "active";
  }

  render();
});

window.addEventListener("DOMContentLoaded", fetchTodo);
