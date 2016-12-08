

var envs={
  node: require('./nodeJS.js'),
  browser: require('./browser.js')
};
          
          
/**
 * start listening with the handler
 * @param  {Function({})} fn the handler
 * @return {Function} a function which is used to stop listening
 */
module.exports = function unload(fn){
  var hasListeners = {};
  Object.keys(envs).forEach(function(envKey){
    hasListeners[envKey] = envs[envKey].add(fn); 
  });

  var retFn = function stopListening(){
    Object.keys(hasListeners).forEach(function(envKey){
      envs[envKey].remove(fn);
    });    
  }

}

