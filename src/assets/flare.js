	/**
	 * @constructs FlareExample
	 * 
	 * @param {Element} canvas - a canvas element object on the html page that's rendering this example.
	 * @param {onReadyCallback} ready - callback that's called after everything's been properly initialized.
	*/
	function FlareExample(canvas, ready)
	{
		this._ViewCenter = [0,0];
		this._ViewSize = {width:0,height:0};
		this._Scale = 1;
		this.animationName = '';
		/** Build and initialize the Graphics object. */
		this._Graphics = new Flare.Graphics(canvas);
		this._Graphics.initialize( () =>
		{
			this._LastAdvanceTime = Date.now();
			this._ViewTransform = mat2d.create();
			this._AnimationInstance = null;
			this._Animation = null;
			this._SoloSkaterAnimation = null;

			const _This = this;
			
			/** Start the render loop. */
			_ScheduleAdvance(_This);
			_Advance(_This);
			
			/** Call-back. */
			ready();
		},"../build/");
	}

	/**
	 * Advance the current viewport and, if present, the AnimationInstance and Actor.
	 * 
	 * @param {Object} _This - the current viewer.
	 */
	function _Advance(_This)
	{

		const now = Date.now();
		const elapsed = (now - _This._LastAdvanceTime)/1000.0;
		_This._LastAdvanceTime = now;

		const actor = _This._ActorInstance;

		if(_This._AnimationInstance)
		{
			const ai = _This._AnimationInstance;
			/** Compute the new time and apply it */
			ai.time = ai.time + elapsed;
			ai.apply(_This._ActorInstance, 1);
		}

		if(actor)
		{
			_This._Scale = _This._ViewSize.width/actor.width
			const graphics = _This._Graphics;
		
			const w = graphics.viewportWidth;
			const h = graphics.viewportHeight;

			const vt = _This._ViewTransform;
			vt[0] = _This._Scale;
			vt[3] = _This._Scale;
			vt[4] = (-_This._ViewCenter[0] * _This._Scale + w/2);
			vt[5] = (-_This._ViewCenter[1] * _This._Scale + h/2);
			/** Advance the actor to its new time. */
			actor.advance(elapsed);
		}

		_Draw(_This, _This._Graphics);
		/** Schedule a new frame. */
		_ScheduleAdvance(_This);
	}

	/**
	 * Performs the drawing operation onto the canvas.
	 * 
	 * @param {Object} viewer - the object containing the reference to the Actor that'll be drawn.
	 * @param {Object} graphics - the renderer.
	 */
	function _Draw(viewer, graphics)
	{
		if(!viewer._Actor)
		{
			return;
		}

		graphics.clear([0, 0, 0, 0]);
		graphics.setView(viewer._ViewTransform);
		viewer._ActorInstance.draw(graphics);
		graphics.flush();
	}

	/** Schedule the next frame. */
	function _ScheduleAdvance(viewer)
	{
		clearTimeout(viewer._AdvanceTimeout);
		window.requestAnimationFrame(function()
			{
				_Advance(viewer);
			}
		);
	}

	/**
	 * Loads the Flare file from disk.
	 * 
	 * @param {string} url - the .flr file location.
	 * @param {onSuccessCallback} callback - the callback that's triggered upon a successful load.
	 */ 
	FlareExample.prototype.load = function(url, callback)
	{
		const loader = new Flare.ActorLoader();
		const _This = this;
		loader.load(url, function(actor)
		{
			if(!actor || actor.error)
			{
				callback(!actor ? null : actor.error);
			}
			else
			{
				_This.setActor(actor);
				callback();
			}
		});
	};

	/**
	 * Cleans up old resources, and then initializes Actors and Animations, storing the instance references for both.
	 * This is the final step of the setup process for a Flare file.
	 */
	FlareExample.prototype.setActor = function(actor)
	{
		/** Cleanup */
		if(this._Actor)
		{
			this._Actor.dispose(this._Graphics);
		}
		if(this._ActorInstance)
		{
			this._ActorInstance.dispose(this._Graphics);
		}
		
		/** Initialize all the Artboards within this Actor. */
		actor.initialize(this._Graphics);

		/** Creates new ActorArtboard instance */
		const actorInstance = actor.makeInstance();
		actorInstance.initialize(this._Graphics);
		
		this._Actor = actor;
		this._ActorInstance = actorInstance;
		if(actorInstance)
		{
			/** ActorArtboard.initialize() */
			actorInstance.initialize(this._Graphics);
			if(actorInstance._Animations.length)
			{
				/** Instantiate the Animation. */
				this._Animation = actorInstance.getAnimation(this.animationName);
				if(this._Animation){
					this._AnimationInstance = new Flare.AnimationInstance(this._Animation._Actor, this._Animation);
				}else{
					console.log('没有对应动画',this.animationName)
				}
				if(!this._AnimationInstance) 
				{
					console.log("NO ANIMATION IN HERE!?"); 
					return;
				}

			}
		}
	};

	/** Set the renderer's viewport to the desired width/height. */
	FlareExample.prototype.setSize = function(width, height)
	{
		this._ViewSize = {width:width, height:height};
		this._Graphics.setSize(width, height);
		this._ViewCenter = [width/2, height/2]
	};

	FlareExample.prototype.setAnimationName = function(name)
	{
		this.animationName = name;
		if(this._Actor){
			this.setActor(this._Actor);
		}
	};

	export default FlareExample;