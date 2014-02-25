# MongoDB Shell Extensions
Collection of utilities to make the life inside of the MongoDB shell a little bit easier

# How to Install
Install as a global module of npm
```
npm install --global mongodb-shell-extensions
```
Or you can download `mongorc.js` from the latest release and copy it in your home directory as `.mongorc`
```
curl -sL https://github.com/gabrielelana/mongodb-shell-extensions/releases/download/0.1.1/mongorc.js | ~/.mongorc
```

Now you have a `.mongorc` file in your home directory that contains all the extensions. This file will be loaded automatically in the next MongoDB shell session

The next time you'll start a MongoDB shell you should see a message like this (the message will not be displayed if the shell is in quiet mode `mongo --quiet`)
```
$ mongo
MongoDB shell version: 2.4.8
connecting to: test
+ MongoDB Shell Extensions by Gabriele Lana <gabriele.lana@gmail.com>
>
```

# How to Disable
If you want to temporary disable the extensions you can start the MongoDB shell with the `--norc` flag
```
$ mongo --norc
MongoDB shell version: 2.4.8
connecting to: test
>
```

# How to Use
...TODO...
