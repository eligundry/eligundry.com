---
title: "Redux + Hooks = 🤤"
date: "2020-02-05T05:00"
description: How I learned Redux at the exact right time
slug: redux-hooks
location: QueensJS
---

<ResponsiveIFrame 
	src="https://docs.google.com/presentation/d/e/2PACX-1vRtaPvro6rZuE6fu8csqAZ5HQIiUW9Hd-LxuSMOfCt1nOTZzp88GxYRakwHRaqv-rvvwk34lSSkAPqX/embed?start=false&loop=false&delayms=3000" 
	frameBorder="0" 
	width="960" 
	height="569" 
	allowFullScreen={true} 
/>

# Notes / Research / Outline

Please forgive any gramatical errors, these are raw notes for the talk.

## What Do I Know?

### My Path To React

- I am a full stack developer who's has done most of his frontend development work in the jQuery heyday
	- I used to be all about managing state on my own
- I'm very much a hands on learner
	- I'd prefer to learn a new technology making something than reading a book or watching a video
- I missed that transition period between jQuery to React
	- Backbone and whatnot
- I've been following React for a bit (frontend devs at my previous job loved it)
- I have found Twitter to be an unbelievably helpful learning resource
	- All I follow are comedians and developers
	- I follow a bunch of React devs and I read the articles that they promoted around React and really dug the syntax
- To me, React is very similar to PHP
	- If you want to have all your HTML + CSS + JS in one file, you totally can, which is the PHP 4 way!
	- People diss PHP, but they shouldn't. It's a tank who's only mission is to complete that web request for your end user. Who cares if you had a syntax error or didn't define a variable or provided a function the wrong order of arguments, I just need to finish that request so the customer can spend money.
- I started playing around with React and dug the layout of the stuff
- I couldn't get into Redux
	- I was very confused by the `connect` function (still am)
	- I kinda understood actions, but their docs did a very bad job explaining how to use HTTP requests (turns out you need a middleware called Thunk?)
- I only picked up Redux this year on a greenfield app that I'm working on
	- Luckily, Redux had just released it's hooks solution right as we were starting, so we went all in with functional components + hooks

### Hooks

- React's replacement for life cycle methods in functional components
- Allow you to use state in functional components
- Conceptually, all hooks are items in an array ordered by the position in the component which is then ordered by the components position in the tree.
	- This is a very novel way of doing it and very effective
	- This means that hooks can not be nested in `if` statements or loops.
- Enables [Concurrent Mode](https://reactjs.org/docs/concurrent-mode-intro.html)
- You can totally opt-in to them over time! No need to dump your `class` based components at all!
	- This is what Facebook is doing, just roll with it.
- The way that I think about hooks' state is that there are small stores distributed around your app
	- A benefit of this is that you can limit the scope of your renders as there isn't a global state changing that will cascade re-renders down your app

#### `useState`

- The lowest form of state hooks
- Allows for storing values across renders
- IMHO you shouldn't store objects in here, but you totally can
- Returns an array of the current value and a setter for updating the value
- Takes a single argument which is the initial value
- For updating, you can either directly set a value or update the value functionally.
	- Ex: `setCount(current => current + 1)`
	- I like to do it functionally in effects so that I only need to track the setter in my dependency array

#### `useReducer`

- Allows for complex storing of state
- Update through a `dispatch` function
- Follows roughly the same pattern as Redux reducers
- If your state is an object, you should use this
- If you have 2 or more tightly coupled `useState`s or if your next state depends on the previous, you should probably switch to this

#### `useEffect`

- A function that runs after each render of the component (by default)
- Allows for an option return of a function to clean up after itself
	- Ex: You have an effect that binds an event listener to the DOM and you return a function to remove the event listener when the component is unmounted
- It's basically all the life cycle methods in one
- You can control when it runs by passing an array of dependencies as a second argument to it. When the value changes, the effect will be run.
	- I don't think there is a way to set an equality function for these values, so you probably shouldn't use an object here unless there is a guarantee that it stays the same (Immutable.js, immer)
- Has a fun cousin called `useLayoutEffect` that runs after the render to the DOM so that you can do effects based upon DOM sizing
- Please use multiple effects to separate concerns. This is more efficient and much cleaner.
- To put it bluntly, as a lot of guides just don't mention this, this is where you want to do your HTTP requests

#### `useContext`

- https://reactjs.org/docs/hooks-reference.html#usecontext
- Hook that allows you to use a React context object
- What even is a context?
	- Basically, it's an object defined outside of a component. It is passed into `React.createContext` which returns a "provider"
	- This provider is a React component that can be mounted high up in the component tree
	- `useContext` can then subscribe the original context object further down in the tree without prop drilling the value down
- Redux in React is the easiest way to describe a context provider: it has to be mounted way up in the tree and the children can read it indirectly.
- It's global state that won't make you queasy

#### `useCallback`

- This returns a memoized callback function
- You must use this in functions that deal with state and references variables defined in the functional component.
- This is needed because each function has it's own scope and that callbacks defined inside of it might be referencing stale values from previous renders.
- Takes a second argument of dependencies for similar reasons as `useEffect`

#### Making Your Own Hooks!

- Making your own hooks are super fun!
- Using the primitives described above, you can compose them inside of a function and share them all around your application or contain complexity in a large component.

```javascript
function useOrder() {
	const [order, setOrder] = useState(null)
	const fetchOrder = useCallback((orderID) => {
		fetch(`/orders/${orderID}`).then(o => setOrder(o))
	}, [setOrder])

	useEffect(() => {
		document.title = `Order #${order.id}`
	}, [order.id])

	return [order, fetchOrder]
}
```

### Redux

- Is sorta the industry standard when it comes to state management in React
	- Not tightly coupled with React at all
- Follows the Flux pattern of state updates
	- Circular/unidirectional
	- Read state -> render -> dispatch action -> use a reducer to update state from action -> read state -> render
	- `ui = f(state)`
	- You never directly update the state outside of the Reducer
- State storage is basically done in one global object
- State updates happen one at a time
  - This allows for cool stuff like rewinding actions for debugging
- Recently started providing hooks so that you don't need to use the `connect` function for your higher order components

#### The `Provider`

- Context that provides implicit state
- Usually wraps the whole application, which basically gives you global state that won't make you queasy
- Contains the `store` which is a giant object that contains the whole state of your application

#### Class Based Setup

- Higher Order Components
	- You have a component that takes in generic props...
	- ...and you connect Redux to this component by mapping Redux state/dispatchable actions to props
	- In this way, your component can be somewhat generic and you can conditionally change how these dispatches work or which state is being injected into the component, which allows you to reuse it.

#### Hooks Setup

- Higher order components are still a thing
- But, instead of injecting the state/dispatches, you wire it up in the component itself using hooks!

##### [`useSelector`](https://react-redux.js.org/next/api/hooks#useselector)

- This is the hooks version of `mapStateToProps`
- It takes two arguments
	- First is a function that selects the values you want from the state
	- Second is an optional equality function that defines an equality function.
		- This can be used to prevent re-renders.
		- By default, it uses reference equality (`===`), but Redux does provide a `shallowEqual` function that can be tossed in here easily.
- Can easily be combined with `reselect` and `re-reselect`
	- [reselect](https://github.com/reduxjs/reselect)
	- [re-reselect](https://github.com/toomuchdesign/re-reselect)
- Can return more than just objects

```javascript
const user = useSelector(store => store.users.byID[userID])
const tweets = useSelector(store => store.tweets.byUserID[userID])
```

##### `useDispatch`

- [useDispatch](https://react-redux.js.org/next/api/hooks#usedispatch)
- This is the hooks version of `mapDispatchToProps`
- It just returns a `dispatch` function that you can pipe actions into.
- If you are using this in a higher order component, you should wrap your callbacks with `useCallback` to prevent re-renders

```javascript
const dispatch = useDispatch()
const sendTweet = useCallback((tweet) => dispatch({ type: 'SEND_TWEET', tweet }), [dispatch])
```

##### The Community

- [rehooks/awesome-react-hooks](https://github.com/rehooks/awesome-react-hooks)
	- List of all the hooks ever
- [react-use](https://github.com/streamich/react-use)
	- So many good hooks, especially the ones that replicate the existing life cycle methods

### Hooks + Redux

- Personally, for a large app, I'm not sold on hooks being the best solution for large amounts of data storage
	- For example, you have a logged in user who's info you will use everywhere
	- Mapping this out:
		- You'll have their name and picture in the top right hand corner of the app
		- Their name is in the welcome message post login
		- All timestamps need to be converted to their timezone
	- Okay, cool, so we'll fetch the user and have that as a context provider. Because the user is everywhere and pretty static, we can totally wrap the app with that provider.
	- To which I say, yes you totally can, but how far can this go logically? How are you going to deal with your one to many relationships.
	- Let's talk about the widgets that you are selling
	- You have hundreds of widgets. You have a list view and a single item view that you can navigate to from the list view.
	- You can take the provider approach and load all your widgets in to one context and then provide another context that will allow you to view a single widget in another context.
	- But now you have to persist and update these widgets
	- Do you think you can do this better than Redux? Furthermore, do you think you can cultivate an ecosystem of ready made middlewares that make you more efficient/reliable?

<Tweet id="1192420546912432128">
	<blockquote><p lang="en" dir="ltr">local state, yes. but global, no. if you centralize it, it will either turn into a salad or tank performance b/c everything re-renders on every state change. i am seeing people do this recently as some kind of work around, which is pretty sad: <a href="https://t.co/ouhjisVsQ4">https://t.co/ouhjisVsQ4</a></p>&mdash; ☄︎ (@0xca0a) <a href="https://twitter.com/0xca0a/status/1192420546912432128?ref_src=twsrc%5Etfw">November 7, 2019</a></blockquote>
</Tweet>

- Another thing I am skeptical about with hooks is tracing and debugging
	- Let's remember that hooks are just unnamed items in a global array
	- You get a bug report from a user, how do you determine where the bug came from/how they got there?
	- I personally use Sentry, which is able to capture stack traces and allows me to log bread crumbs to help me debug things
	- I have setup Redux to leave me a little log messages on each Redux state change which helps me see obvious bugs and how they lead there
	- I have not seen how you can do something similar with hooks in a built in fashion
		- More to the point, I struggle to debug simple hooks in a local dev environment
		- I've had a few bugs come up with hooks endlessly re-rendering a component from the "inside" (whyDidYouRender did not pick up on it because it only re-rendered the children) that I've had to manually put `console.log`s in all the hooks to determine which one was causing it.
	- Maybe I should fix this up like I'd like [troch/reinspect](https://github.com/troch/reinspect)

```javascript
function useTweets(userID) {
	const dispatch = useDispatch()
	const tweets = useSelector(store => store.tweets.byUserID[userID])
	const sendTweet = useCallback((tweet) => dispatch({ type: 'SEND_TWEET', tweet }), [dispatch])

	return [tweets, sendTweet]
}

const [tweets, sendTweet] = useTweets(34)
```

## What Don't I Know?

### Hooks

- Concurrent mode?
	- What is it?
	- I know that it doesn't work with effects? Why? Maybe I'm wrong about this?
	- How does it work?

### Redux

- How would Suspense even work with it?
- I really need to get a grasp of the `connect` function before I can shit talk it

### Hooks + Redux

- Is it a good idea?
- Does it sorta go against the grain of a unidirectional flow?
- Really need to wrap my head around [memoizing selectors](https://react-redux.js.org/next/api/hooks#using-memoizing-selectors)

### Reselect

- I really need to understand how to combine selectors
