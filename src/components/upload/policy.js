import request from '@/utils/request.js'
export function policy() {
   return  new Promise((resolve,reject)=>{
       request.get("thirdparty/oss/policy", {
           params: request.adornParams({})
       }).then(res => {
           resolve(res)
       })

    });


}