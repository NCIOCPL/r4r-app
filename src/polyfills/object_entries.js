/* 
MDN Object.entries polyfill
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries#Polyfill
*/

export default (() => {
    if (!Object.entries) {
        console.log('Polyfilling Object.entries()')
        Object.entries = function( obj ){
          var ownProps = Object.keys( obj ),
              i = ownProps.length,
              resArray = new Array(i); // preallocate the Array
          while (i--)
            resArray[i] = [ownProps[i], obj[ownProps[i]]];
          
          return resArray;
        };
    }
})()