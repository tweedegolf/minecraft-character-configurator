### Minecraft Character Configurator

There are 2 versions of the configurator: one made with [react-three](https://github.com/Izzimach/react-three) and another made with [react-three-renderer](https://github.com/toxicFork/react-three-renderer). This shows you the different approach of these libraries.

### Installation

Install livereload:

  - install [guard livereload](https://github.com/guard/guard-livereload)

To install dependencies for each version of the configurator you have enter the `react-three` and the `react-three-renderer` folder subsequently and run:

  - npm install

### Run and build

You can start livereload by running this command in the root folder:

  - run `bundle exec guard`


If you want to watch or build one of the versions of the configurator, you have to cd into the acccording folder and run:

 - `npm run watch` starts a local webserver and watchify
 - `npm run build` builds app and generates source map

The local webserver for the react-three version runs at port 8000 and the react-three-renderer version at port 8001.
