import fs from 'fs';

(() => {
   fs.readFile('tsconfig.json', 'utf8', (err, readResponse) => {
    if (err) { throw new Error(err); }
    const data = JSON.parse(readResponse);
    data.compilerOptions.module = 'commonjs';
    fs.writeFile('tsconfig.json', JSON.stringify(data), () => {});
  });
})();