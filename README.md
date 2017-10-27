Explain how to setup this theme in a hugo site project

 - Hugo Theme Built on [Material Components for the Web][1]
 - Takes advantage of shortcodes for Front Matter (markdown) to build in content components

# Production Dependencies if publishing to Netlify

If you prebuild before using the theme, you will not have to worry about the build process for the theme.

***If you are going to build yourself*** use `yarn` commands.
Start dev watch build in a separate terminal window. 

Run `hugo server` from your hugo site terminal
```
$ yarn start

```
Run build of dist folder (minified)
```
$ yarn build
```

Run build of dist folder (un-minified with maps)
```
$ yarn buildu
```

Enjoy the theme template! Make changes!

***Note: This theme is open sourced under the MIT license, but all asset copyrights stay with their associated owner unless otherwise stated.*** (ie the ADARTA favicon.ico)

[1]: https://material.io/components/web/ "Material Components for the Web"
