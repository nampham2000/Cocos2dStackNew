import { _decorator, Component, Node, instantiate, director, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ObjectPool')
export class ObjectPool extends Component {
    public static instance: ObjectPool;
    private pooledObjects: Node[] = [];
    private amountToPool: number = 11;
    @property({type:Prefab}) 
    bulletPrefab: Prefab;
    i:number
    
    start() {
        for(this.i=0;this.i<this.amountToPool;this.i++){
          
            const node = instantiate(this.bulletPrefab);
            node.parent = director.getScene().getChildByName('Canvas').getChildByName('Zoom').getChildByName('Broke');
            node.active=false;
            this.pooledObjects.push(node);
        }
    }

    public GetPooledOjects(){
        for(this.i=0;this.i<this.pooledObjects.length;this.i++){
            if(!this.pooledObjects[this.i].active){
                return this.pooledObjects[this.i];
        }
    }
        return null;
    }

}

