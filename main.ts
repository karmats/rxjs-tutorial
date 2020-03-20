import { fromEvent, from, of, merge, throwError } from "rxjs";
import { flatMap, catchError } from "rxjs/operators";
import { loadWithFetch } from "./loader";

let source = merge(
  of(1),
  from([2, 3, 4]),
  throwError(new Error("Stop")),
  of(5)
).pipe(
  catchError(e => {
    console.log(`caught ${e}`);
    return of(10);
  })
);

source.subscribe(
  value => console.log(`value ${value}`),
  error => console.log(`error ${error}`),
  () => console.log("complete")
);

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

click.pipe(flatMap(() => loadWithFetch("movies.json"))).subscribe(
  renderMovies,
  e => console.log(`error: ${e}`),
  () => console.log("complete")
);
