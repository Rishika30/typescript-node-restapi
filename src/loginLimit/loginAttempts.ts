import Locks, {ILock} from "../models/locks";

const MAX_ATTEMPTS: number = 3;
const LOCK_DURATION: number = 1;

 export const createLock=(email)=>{
     Locks.find({email:email}).then(lock=>{
     if(lock.length<1){
        const lock= new Locks<ILock>({
          email:email,
          attempts:0,
          isLocked:false,
          unlocksAt:null
        });
        lock.save();
    }
  });
}


 export const checkLocked= (email):boolean=>{
  let a:number;
   Locks.findOne({email}, function(err,lock){
     if(lock.isLocked){
       a=1;
     }else{
       a=0;
     }
   });
   if(a==1){
    return true;
    }
    else{
      return false;
    }
}

export const lockTime= (email)=>{
  let a:number;
    Locks.findOne({email}, function(err,lock){
      if(lock.unlocksAt > new Date()){
        a=1;
      }
      else{
        a=0;
      }
   })
   if(a==0){
     return false;
   }else{
     return true;
   }
}


export const invalidAttempt = async(email) => {
  const lock= await Locks.findOneAndUpdate({email},{$inc: {attempts:1}} , {new:true});
    if(lock.attempts>MAX_ATTEMPTS){
     const d = new Date();
     d.setMinutes(d.getMinutes() + LOCK_DURATION);
     lock.isLocked = true;
     lock.unlocksAt = d;
     lock.save();
  }
};

export const resetLock = (email) => {
  const updates= {attempts:0, isLocked:false, unlocksAt:null};
  const result= Locks.findOneAndUpdate({email}, updates, {new:true});
  console.log(result);
};


