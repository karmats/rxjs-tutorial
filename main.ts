import { Observable, fromEvent } from "rxjs";
import {
  map,
  filter,
  delay,
  flatMap,
  retryWhen,
  scan,
  takeWhile
} from "rxjs/operators";

const output = document.getElementById("output");
const button = document.getElementById("button");

const click = fromEvent(button, "click");

function load(url: string) {
  return Observable.create(observer => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        observer.next(data);
        observer.complete();
      } else {
        observer.error(xhr.statusText);
      }
    });
    xhr.open("GET", url);
    xhr.send();
  }).pipe(retryWhen(retryStrategy({ attempts: 2, wait: 2000 })));
}

function renderMovies(movies: any) {
  movies.forEach(m => {
    const div = document.createElement("div");
    div.innerText = m.title;
    output.appendChild(div);
  });
}

function retryStrategy({ attempts = 5, wait = 1000 }) {
  return function(errors) {
    return errors.pipe(
      scan((acc, value: number) => {
        console.log(acc, value);
        return acc + 1;
      }, 0),
      takeWhile(acc => acc < attempts),
      delay(wait)
    );
  };
}

click.pipe(flatMap(() => load("moviess.json"))).subscribe(
  renderMovies,
  e => console.log(`error: ${e}`),
  () => console.log("complete")
);
