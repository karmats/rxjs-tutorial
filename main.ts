import { fromEvent } from "rxjs";
import { flatMap } from "rxjs/operators";
import { load } from "./loader";

const output = document.getElementById("output");
const button = document.getElementById("button");

const click = fromEvent(button, "click");

function renderMovies(movies: any) {
  movies.forEach(m => {
    const div = document.createElement("div");
    div.innerText = m.title;
    output.appendChild(div);
  });
}

click.pipe(flatMap(() => load("movies.json"))).subscribe(
  renderMovies,
  e => console.log(`error: ${e}`),
  () => console.log("complete")
);

// const subscription = load("movies.json").subscribe(
//   renderMovies,
//   e => console.log(`error: ${e}`),
//   () => console.log("complete")
// );
// subscription.unsubscribe();
