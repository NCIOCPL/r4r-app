[Demo](https://gifted-rosalind-be8dbe.netlify.com/)

### Custom Themes

A custom Theme Provider sits on top of the App structure (much like a Redux priovider) and passes down the context chain the custom theme hashmap. 

To use a theme classname instead of a standard one, use a Theme component. Pass it all the same props you normally would, as well as a type prop specifying what type of output element you want the themed element to be.
Make sure you have a className for the Theme component, as this is what it uses to look up the custom classnames from the hashmap.

```
<div onClick={() => {}} className="banana" />
```

becomes:

```
<Theme type="div" className="banana" onClick={() => {}} />
```

Note: Theme component with classnames that are not a part of the hash will not fail, but have no function except to add complexity to the component tree.