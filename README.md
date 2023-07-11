# Note
This is pretty much a fork of mistval's [kanji_images](https://github.com/mistval/kanji_images). \
I just added these files to my own repo so I can use them for this project.

As for the stroke order images, these came from [kanjivg2svg](https://github.com/Kimtaro/kanjivg2svg). \

# kanji_images
PNGs and stroke order GIFs of most kanji.

The files are named with the unicode code point of the character in hex. For example you can get the png file name for 犬 like this in JavaScript:

```js
const fileName = '犬'.codePointAt(0).toString(16) + '.png';
```

## About

The gifs were generated using [Kanimaji](http://maurimo.github.io/kanimaji/index.html) which uses [KanjiVG](http://kanjivg.tagaini.net/projects.html). You can use those if you want different resolutions, colors, etc.

The pngs were generated using [node-canvas](https://www.npmjs.com/package/canvas). I think the font is Meiryo, I don't remember.