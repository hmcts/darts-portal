const path = require('path');
const fs = require('fs');

function localArray(name) {
  const filename = `${name}.json`;
  const filePath = path.join('./darts-api-stub/data', filename);
  return {
    v: [],
    get value() {
      if (!fs.existsSync(filePath)) {
        console.log(`Local file, '${filename}', doesn't exist, so needs to be created`);
        fs.closeSync(fs.openSync(filePath, 'w'));
        fs.writeFileSync(filePath, '[]');
      }
      const data = JSON.parse(fs.readFileSync(filePath));
      // When pushing to array, we need to check if it's been updated
      if (this.v !== data) {
        if (this.v.length === 0) {
          this.v = data;
        } else {
          // Prevent the file from going over a certain length
          // Set to 200
          if (this.v.length > 200) {
            this.v.shift();
          }
          fs.writeFileSync(filePath, JSON.stringify(this.v, null, 2));
        }
      }
      return this.v;
    },
    set value(newValue) {
      try {
        fs.writeFileSync(filePath, JSON.stringify(newValue, null, 2));
      } catch (e) {
        console.error(e);
      }
    },
  };
}

module.exports = { localArray };
