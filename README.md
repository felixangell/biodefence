# game...
A nightly build of the master branch is deployed [here](https://biodefence.netlify.com/)

## building
### requirements
you'll need:

* git
* yarn

### build & run

    $ git clone http://github.com/felixangell/biodefence
    $ cd biodefence/
    $ yarn

### watch
This will compile the javascript as you update it. So as you are you changing the code
this will run in the background and compile any new changes. All you have to do is reload
the web browser.

    $ yarn d

If you open `localhost:3000` in your browser the game should be running.

## notes
Rendering via. the [HTML5 canvas](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
[MatterJS](https://github.com/liabru/matter-js) Physics engine

Source files are in the `src` directory:

- entity.js - basic entity system
- game_map.js - the map for the agme
- index.js - this is where to start!
- state.js - simple game_state boilerplate stuff

Entities in the physics engine are rendered from the centre? So we take off half the width andh eight
from the x/y position when rendering.

### game loop
There is a game loop in `src/index.js`, specifically the start method of the Game class. This
sets up a loop that runs (hard coded) at 60 fps, i.e. 60 iterations a second.
In this game loop, the update and render methods are invoked. The update method handles
the animations, physics, and positions of entities, whereas the render method is in charge
of rendering the objects and entities to the canvas via. the provided graphics context.

### state system
For now a single game state is hard coded in as it's the only state that is necessary to
focus on currently (`GameState`).
