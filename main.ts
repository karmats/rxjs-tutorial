import { Observable } from "rxjs";
import { map, filter } from "rxjs/operators";

const numbers = [1, 5, 10];

const source = new Observable(observer => {
  let index = 0;
  const produceValue = () => {
    observer.next(numbers[index++]);

    if (index < numbers.length) {
      setTimeout(produceValue, 250);
    } else {
      observer.complete();
    }
  };
  produceValue();
});

source
  .pipe(
    map((n: number) => n * 2),
    filter(n => n > 4)
  )
  .subscribe(
    value => console.log(`value: ${value}`),
    e => console.log(`error: ${e}`),
    () => console.log("complete")
  );
