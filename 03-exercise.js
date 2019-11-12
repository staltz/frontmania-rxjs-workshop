const fs = require("fs");
const {} = require("rxjs");
const {} = require("rxjs/operators");

/**
 * Exercise: choose either Easy version or the Hard version of the
 * function "listAllFiles" and convert it (the internals of the function)
 * from callbacks to Observables.
 *
 * It's okay to use only methods that you have learned so far.
 */

function listAllFiles_Easy(outputFile, cb) {
  fs.readdir("./", (err1, files) => {
    if (err1) {
      cb(err1);
    } else {
      files.forEach(filename => {
        console.log(filename);
      });
      cb(null);
    }
  });
}

function listAllFiles_Hard(outputFile, cb) {
  fs.unlink(outputFile, err1 => {
    fs.readdir("./", (err2, files) => {
      if (err2) {
        cb(err2);
      } else {
        let appended = 0;
        files.forEach(filename => {
          fs.appendFile(
            outputFile,
            filename + "\n",
            { encoding: "utf-8" },
            err3 => {
              if (err3) {
                cb(err3);
              } else {
                appended += 1;
                if (appended === files.length) {
                  cb(null);
                }
              }
            }
          );
        });
      }
    });
  });
}

// call listAllFiles_Easy or listAllFiles_Hard
listAllFiles_Easy("./03-output.txt", err => {
  if (err) {
    console.error("Failed because: " + err);
    process.exit(1);
  } else console.log("done");
});
