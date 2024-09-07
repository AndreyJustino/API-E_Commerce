import { v4 as uuidv4 } from 'uuid';

function creatCod(){
    const code = uuidv4();
    
    return code
}

export default creatCod