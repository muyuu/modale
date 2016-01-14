# modal UI

this library is browser modal module.

## install

### npm
```npm install ui--modal --save-dev```

### bower
```bower install ui--modal --save```


## usage

### browserify
```
var modal = require('modal');

var modal01 modal({root: "js-modalpattern01"});

var modal02 modal({
  root: "js-modalpattern02",
  width: 1000,
  height: 500
});
```

### other
```
<script src="jquery.js"></script>
<script src="modal.js"></script>
<script src="app.js"></script> // module load

# app.js
var modal01 = uiModal();
```

