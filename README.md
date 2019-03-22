# game...

## requirements
you'll need:

* git
* yarn

## notes
Rendering via. the [HTML5 canvas](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
[MatterJS](https://github.com/liabru/matter-js) Physics engine

Source files are in the `src` directory:

- entity.js - basic entity system
- game_map.js - the map for the agme
- index.js - this is where to start!
- state.js - simple game_state boilerplate stuff

### game loop
There is a game loop in `src/index.js`, specifically the start method of the Game class. This
sets up a loop that runs (hard coded) at 60 fps, i.e. 60 iterations a second.
In this game loop, the update and render methods are invoked. The update method handles
the animations, physics, and positions of entities, whereas the render method is in charge
of rendering the objects and entities to the canvas via. the provided graphics context.

### state system
For now a single game state is hard coded in as it's the only state that is necessary to
focus on currently (`GameState`).

## building

    $ git clone http://github.com/felixangell/project-aids
    $ cd project-aids/
    $ yarn
    $ yarn build

Then open the index.html file in your browser and it should work.