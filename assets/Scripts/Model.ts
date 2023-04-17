import { _decorator, AudioSource, Component, Node } from 'cc';


const { ccclass, property } = _decorator;

@ccclass('Model')
export class Model extends Component {
   @property(AudioSource)
   clickSound:AudioSource

   public get ClickSound() : AudioSource {
      return this.clickSound
   }
   
   public set value(v : AudioSource) {
      this.clickSound = v;
   }
   @property(AudioSource)
   gamoverSound:AudioSource

   public get GameOverSound() : AudioSource {
   return this.gamoverSound
   }

   public set GameOverSoundVal(v : AudioSource) {
   this.gamoverSound = v;
   }

   @property(Node)
   stack:Node
   
   public get Stack() : Node {
      return this.stack
   }
   
   public set StackValue(v : Node) {
      this.stack = v;
   }

   @property(Node)
   broke:Node
   
   public get Broke () : Node {
      return this.stack
   }
   
   public set BrokeValue(v : Node) {
      this.stack = v;
   }


}


