global.findObj = function(array, attr, value){
    return new Promise(resolve => {
        for(var i = 0; i < array.length; i += 1) {
            if(array[i][attr] === value) {
                resolve(i);
            }
        }
        resolve(-1);
    })
}