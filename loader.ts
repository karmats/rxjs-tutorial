import { Observable, defer, from, throwError } from "rxjs";
import { scan, delay, takeWhile, retryWhen } from "rxjs/operators";

function load(url: string) {
  return Observable.create(observer => {
    const xhr = new XMLHttpRequest();
    const onLoad = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        observer.next(data);
        observer.complete();
      } else {
        observer.error(xhr.statusText);
      }
    };
    xhr.addEventListener("load", onLoad);
    xhr.open("GET", url);
    xhr.send();

    return () => {
      console.log("cleanup");
      xhr.removeEventListener("load", onLoad);
      xhr.abort();
    };
  }).pipe(retryWhen(retryStrategy({ attempts: 2, wait: 2000 })));
}

function loadWithFetch(url: string) {
  return defer(() =>
    from(
      fetch(url).then(result => {
        if (result.status === 200) {
          return result.json();
        } else {
          return Promise.reject(result);
        }
      })
    )
  ).pipe(retryWhen(retryStrategy()));
}
function retryStrategy({ attempts = 4, wait = 1000 } = {}) {
  return function(errors) {
    return errors.pipe(
      scan((acc, value: number) => {
        acc += 1;
        if (acc < attempts) {
          return acc;
        }
        throw new Error("" + value);
      }, 0),
      delay(wait)
    );
  };
}

export { load, loadWithFetch };
