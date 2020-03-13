import { Observable, fromEvent } from "rxjs";
import { map, filter, delay, flatMap } from "rxjs/operators";

const output = document.getElementById("output");
const button = document.getElementById("button");

const click = fromEvent(button, "click");

function load(url: string) {
  return Observable.create(observer => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", () => {
      const data = JSON.parse(xhr.responseText);
      observer.next(data);
      observer.complete();
    });
    xhr.open("GET", url);
    xhr.send();
  });
}

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
