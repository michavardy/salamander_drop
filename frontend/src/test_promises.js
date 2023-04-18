const nums = [1,2,3,4,5,6]

function loadValue(n){
    return new Promise((resolve, reject)=>{
        if (true){
            setTimeout(()=>{resolve(                
                {index:n,
                square:n**2,
                plus2:n+2
            })},300)}
        else{
            reject('rejected_value')
        }
        
    })
}

function divided_by_3_promise(n){
    return new Promise ((resolve, reject)=>{
        setTimeout(()=>{
            resolve(n/3)
        }, 400)
    })
}

function minus1(n){
    return n-1
}

async function extractValue(){
    const value = await Promise.all(nums.map((n)=>{
        return loadValue(n)
    }))
    const newValue = await Promise.allSettled(value).then((result)=>{
                        resolvedValue = result
                            .filter((res)=> res.status === "fulfilled")
                            .map((res)=>{
                                const m1 =  minus1(res.value.plus2);
                                return {
                                    ... res.value, 
                                    min1:m1
                                }
                            })
                        return resolvedValue
                    })
    const newValue2 = await Promise.all(newValue.map(async (nv)=>{
        const db3 = await divided_by_3_promise(nv.index)
        return {
            ...nv,
            db3
        } 
            
    }))
    console.log('value')
    console.log(value)
    console.log('newValue')
    console.log(newValue)
    console.log('newValue2')
    console.log(newValue2)
}

extractValue()