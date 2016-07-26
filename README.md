# modale

This library is browser modal module.

## install

### npm
```npm install modale --save-dev```

## usage

### browserify
```
var modale = require('modale');

var modal01 modale({root: "js-modalpattern01"});

var modal02 modale({
  root: "js-modalpattern02",
  width: 1000,
  height: 500
});
```

### other
```
<script src="jquery.js"></script>
<script src="modale.js"></script>
<script src="app.js"></script> // module load

# app.js
var modal01 = uiModale();
```

