module.exports = {
    colors:{
        info:'#5050ff',
        success:'#00ff00',
        warning:'#ff8800',
        error:'#ff0000',
    },
    /**
     * Set a pallete or part of a pallet
     * @param {Object} pallet 
     */
    setPallete(pallet){
        for(const [key, color] of Object.entries(module.colors)){
            module.colors[key] = (pallet[key]) ? pallet[key] : color;
        }
    }
}