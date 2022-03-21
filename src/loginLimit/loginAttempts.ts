import Locks, {ILock} from "../models/locks";

const MAX_ATTEMPTS: number = 3;
const LOCK_DURATION: number = 1;

 export const createLock= async(email)=>{
     const lock= await Locks.find({email:email});
     if(lock.length<1){
        const lock= new Locks<ILock>({
          email:email,
          attempts:0,
          isLocked:false,
          unlocksAt:null
        });
        await lock.save();
    }
}


 export const checkLocked= async(email)=>{
   const lock= await Locks.findOne({email});
     if(lock.isLocked){
      return true;
     }else{
       return false;
     }
}

export const lockTime= async(email)=>{
    const lock= await Locks.findOne({email});
      if(lock.unlocksAt > new Date()){
        return true;
      }
      else{
        return false;
      }
}


export const invalidAttempt = async(email) => {
  const lock= await Locks.findOneAndUpdate({email},{$inc: {attempts:1}} , {new:true});
    if(lock.attempts>=MAX_ATTEMPTS){
     const d = new Date();
     d.setMinutes(d.getMinutes() + LOCK_DURATION);
     lock.isLocked = true;
     lock.unlocksAt = d;
     await lock.save();
  }
};

export const resetLock = async(email) => {
  const updates= {attempts:0, isLocked:false, unlocksAt:null};
  const result= await Locks.findOneAndUpdate({email}, updates, {new:true});
  console.log(result);
};


