const fs = require("fs");
const { bindNodeCallback, from, forkJoin, concat} = require("rxjs");
const { map, flatMap, catchError } = require("rxjs/operators");

/**
 * Exercise: choose either Easy version or the Hard version of the
 * function "listAllFiles" and convert it (the internals of the function)
 * from callbacks to Observables.
 *
 * It's okay to use only methods that you have learned so far.
 */

const readdir$ = bindNodeCallback(fs.readdir);
const unlink$ = bindNodeCallback(fs.unlink);
const appendFile$ = bindNodeCallback(fs.appendFile);

function listAllFiles_Easy(outputFile, cb) {
  readdir$("./")
    .pipe(flatMap(from))
    .subscribe(
      x => console.log(x),
      err => cb(err),
      () => cb(null)
    );
}

function listAllFiles_Hard(outputFile, cb) {
  unlink$(outputFile)
    .pipe(
      flatMap(() => readdir$("./")),
      catchError(() => readdir$("./")),
      map(files =>
        files.map(filename =>
          appendFile$(outputFile, filename + "\n", { encoding: "utf-8" })
        )
      ),
      // forkJoin here replicates the behavior of the callback-based code:
      flatMap(manyObservables => forkJoin(manyObservables)),
      // but concat is a better choice to avoid reordering bugs:
      // flatMap(manyObservables => concat(...manyObservables))
    )
    .subscribe(
      () => {},
      err => cb(err),
      () => cb(null)
    );
}

// call listAllFiles_Easy or listAllFiles_Hard here
listAllFiles_Easy("./03-output.txt", err => {
  if (err) {
    console.error("Failed because: " + err);
    process.exit(1);
  } else console.log("done");
});
