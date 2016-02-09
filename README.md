# ng-magics

*ng-magics* (full name: *ng-magics-crawl*) is Angular 1.x companion for ScrollMagic, a de facto JavaScript tool for top grade scrolling animation.

[![Build Status](https://travis-ci.org/ex-machine/ng-magics.svg?branch=master)](https://travis-ci.org/ex-machine/ng-magics)

# Description

The module introduces several Angular directives and services to do scrolling sorcery in Angular-friendly, declarative way:

```
<div ng-class="{ activeClass: isActive }>{{ isActive ? 'active' : '' }}</div>
<div magics-scene magics-spy="isActive" magics-spy-progress="progressHandler">{{ progress }}</div>
```

```javascript
// may use built-in `debounce` or `throttle` services for best performance 
$scope.progressHandler = throttle((e) => {
	$scope.progress = Math.round(e.progress * 100) + '%';
	$scope.$apply();
}, 100);
```
Instead of jQuery-fashioned, harder to maintain code:

```
var scene = new ScrollMagic.Scene({
	triggerElement: '#element',
	// manually calculated number
	// or a function that calculates it from responsive elements
	duration: 100  
})
	.setClassToggle('#anotherElement', 'activeClass')
	.on('enter leave', (e) => {
		$('#anotherElement').text(e.type == 'enter' ? 'active' : ''); 
	})
	.on('progress', (e) => {
		$('#element').text(Math.round(e.progress * 100) + '%'); 
	});

new ScrollMagic.Controller()
	.addscene(scene);
```

Even if the full power of ScrollMagic is demanded for some serious black arts, ScrollMagic API is available through Angular services.

## Glossary

### Stage

The stage behind the sequence of scenes which does no actions and holds no logic. Known as [*controller* in *ScrollMagic*](http://scrollmagic.io/docs/ScrollMagic.Controller.html) but renamed to *stage* in *ng-magics* to match its role better and avoid confusion with Angular controllers (it even asked for that in person).

It defines root element for the act (any container, but, more frequently, `window`) and the axis of scrolling. All the relevant scenes are attached to it, the controller also defines default settings for them.

The stage holds global information (current position, direction, container) about the stage. There's not much to say about it besides that.

### Scene

The place where the magic happens [in ScrollMagic](http://scrollmagic.io/docs/ScrollMagic.Scene.html). The scene triggers events on its beginning, continuation and finale, any sort of change (likely visual) can be caused by them.

*ScrollMagic* doesn't perform any visual effects by itself, they have to be implemented by either CSS3 classes or third-party animation library (*TweenMax* or *TweenLite*).

A scene may be some abstract start point and have no end, but *ng-magics* `magics-scene` directive limits the scene to the bounds of specific DOM element.

### Pin	

Fixes the element in viewport during the current scene, until it is unpinned manually, or the scene is over. While *ScrollMagic* can pin an arbitrary element, *ng-magics* `magics-pin` directive is supposed to pin only scene's children.

### Spy

The concept of scene spies is specific to *ng-magics*. A spy directive, `magics-pin` binds scope properties to the events ('enter', 'leave' and 'progress') of the relevant scene.

# Prerequisites

The module depends on *ScrollMagic* (`ScrollMagic` global) and its [*GSAP*](http://scrollmagic.io/docs/animation.GSAP.html) and [*addIndicators*](http://scrollmagic.io/docs/debug.addIndicators.html) (for enabled `magicsProvider.debug`) plugins that should be loaded before the application is bootstrapped.

It also depends on GreenSock *TweenMax* or *TweenLite* libraries  (`TweenMax` or `TweenLite` global) and their [ScrollToPlugin](https://greensock.com/docs/#/HTML5/GSAP/Plugins/ScrollToPlugin/) plugin for ScrollMagic animations, one of the libraries should be loaded before ScrollMagic.

# API



##magicsScene

Creates a new scene or reuses the existing one
on either the stage specified by `magicsStage` directive or 'default' stage.

###Directive Info

###Usage

* as attribute:
    ```
    <ANY
      [magics-scene="string"]
      [magics-scene-options="Object"]>
    ...
    </ANY>
    ```

####Arguments

| Param | Type | Details |
| :--: | :--: | :--: |
| magicsScene<br>*(optional)* | string | <p>Scene name.</p>  |
| magicsSceneOptions<br>*(optional)* | Object | <p>Options that are used on scene creation.</p>  |

##magicsSpy

Sets up a spy for the scene specified
 by either parent `magicsScene` directive or `magicsSpyScene` attribute.

###Directive Info

###Usage

* as attribute:
    ```
    <ANY
      [magics-spy="expression"]
      [magics-spy-scene="string"]
      [magics-spy-progress="expression"]>
    ...
    </ANY>
    ```

####Arguments

| Param | Type | Details |
| :--: | :--: | :--: |
| magicsSpy<br>*(optional)* | expression | <p>Scope variable flag <em>(read-only)</em>.</p>  |
| magicsSpyScene<br>*(optional)* | string | <p>Scene name.</p>  |
| magicsSpyProgress<br>*(optional)* | expression | <p>Scene progress callback function.</p>  |

##magicsStage

Creates a new stage or reuses the existing one.

###Directive Info

###Usage

* as attribute:
    ```
    <ANY
      [magics-stage="string"]
      [magics-stage-options="Object"]>
    ...
    </ANY>
    ```

####Arguments

| Param | Type | Details |
| :--: | :--: | :--: |
| magicsStage<br>*(optional)* | string | <p>Stage name.</p>  |
| magicsStageOptions<br>*(optional)* | Object | <p>Options that have to be passed  to <code>magics.stage</code>.</p>  |



# Example

[A demo is available](https://embed.plnkr.co/Y0IaNluA9fYFKAGQmMhT/), it briefly depicts the features and the concepts behind the module.