import { Observable, defer, from } from "rxjs";
import { scan, delay, takeWhile, retryWhen } from "rxjs/operators";

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

function loadWithFetch(url: string) {
  return defer(() => from(fetch(url).then(result => result.json())));
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

export { load, loadWithFetch };
