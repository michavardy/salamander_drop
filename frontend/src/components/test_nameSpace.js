const arr1 = [1,5,7,9,12,3,9,5]
function plus2(num){return num+2}
arr1.map(async (x, index, arr)=>{console.log(Math.round(100*(index/arr.length)))})
