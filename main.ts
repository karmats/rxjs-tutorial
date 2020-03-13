import { Observable, fromEvent } from "rxjs";
import { map, filter, delay } from "rxjs/operators";

const circle = document.getElementById("circle");

const source = fromEvent(document, "mousemove");

function onNext(value) {
  circle.style.left = value.x;
  circle.style.top = value.y;
}
source
  .pipe(
    map((e: MouseEvent) => ({ x: e.clientX, y: e.clientY })),
    filter(value => value.x < 500),
    delay(300)
  )
  .subscribe(
    onNext,
    e => console.log(`error: ${e}`),
    () => console.log("complete")
  );
