import { v4 as uuidv4 } from 'uuid';

function creatId(){
    const id = uuidv4();
    
    return id
}

export default creatId