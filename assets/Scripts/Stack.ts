import { _decorator, Color, Component, director, EventKeyboard, Input, input, KeyCode, Node, RigidBody2D, Sprite, Vec2, Vec3 } from 'cc';
import { ObjectPool } from './ObjectPool';
import { Model } from './Model';
import { Views } from './View';
import GameClient from '@dattenlagiday/oc_gamecenter_sdk_pkg';
const { ccclass, property } = _decorator;

@ccclass('Stack')
export class Stack extends Component {
  private theStack: Node[];
  private BOUNDS_SIZE = 3.5;
  private tileSpeed = 2.5; 
  private stackIndex: number;
  private tileTransition = 0.0;
  private deltaTime = 0;
  private scoreCount = 0;
  private lastilePosition:Vec3
  private ERROR_MARGIN=0.1
  private combo=0
  private stackBounds:Vec2=new Vec2(this.BOUNDS_SIZE,this.BOUNDS_SIZE);
  private desiresPosition:Vec3;
  private currentTileColor: Color;
  private STACK_MOVING_SPEED=1;
  private down;
  private scoresa=0
  private isdead=false;
  private CountStart=0
  bestScore:number[]=[];
  volumPoint:number[]=[]
  @property({type:ObjectPool})
  objectPool: ObjectPool
  @property(Model)
  GameModel:Model
  @property(Views)
  GameView:Views
  gameClient:GameClient;
  matchId:string
    // public async start():Promise<void> {
    // if(this.gameClient===undefined)
    // {
    // this.gameClient = new GameClient("642d38dedc7fdb5a28069dc5","2f1f64c8-4774-4c95-8292-c31cad454546");
    // await this.gameClient.initAsync()
    //   .then(() => {console.log(this.gameClient.match)})
    //   .catch((err) => console.log(err));
    // }
    // await this.gameClient.match
    //   .startMatch()
    //   .then((data) => {this.matchId=data.matchId})
    //   .catch((error) => console.log(error));
    start(){
    
    this.GameView.GameOverSprite.node.active=false;
    this.GameView.GameStartSprite.node.active=true;
    director.pause();

    this.theStack = new Array<Node>(this.GameModel.stack.children.length);
    this.theStack[0]=this.GameModel.stack.children[1]
    for (let i = 0; i < this.GameModel.stack.children.length; i++) {
        this.theStack[i] = this.GameModel.stack.children[i] ;
      }
    this.stackIndex = this.theStack.length - 1;
   
    this.volumPoint.push(1)
    let volumepos=localStorage.getItem('VolumPoint')
    if(volumepos){
      this.volumPoint=JSON.parse(volumepos);
      this.GameModel.clickSound.volume=this.volumPoint[this.volumPoint.length-1];
      this.GameModel.gamoverSound.volume=this.volumPoint[this.volumPoint.length-1];
          
    }
    let bestscore=localStorage.getItem('BestScoreStack');
    if(bestscore){
        this.bestScore=JSON.parse(bestscore);
        this.GameView.BestScore.string='Best Score: ' +(Math.max(...this.bestScore))
    }
  }

  update(deltaTime: number) 
  
    {
      if(this.CountStart==0)
      {
        input.off(Input.EventType.KEY_DOWN)
      }else{
        input.on(Input.EventType.KEY_DOWN, this.onMouseDown, this);
      }
      this.deltaTime = deltaTime;
      this.GameView.BestScore.string='BestScore: ' +(Math.max(...this.bestScore))
      this.MoveTile();
      console.log(this.CountStart);
      if(this.desiresPosition){
      this.GameModel.stack.position = Vec3.lerp(this.GameModel.stack.position, this.GameModel.stack.position, this.desiresPosition, this.STACK_MOVING_SPEED * this.deltaTime);
      this.GameModel.broke.position=Vec3.lerp(this.GameModel.stack.position, this.GameModel.stack.position, this.desiresPosition, this.STACK_MOVING_SPEED * this.deltaTime);
      }
    }
    private onMouseDown(event: EventKeyboard) {
      if (event.keyCode==KeyCode.SPACE) {
        if(this.PlaceTile())
        {
          this.Spawn()
          this.scoreCount++
          this.GameView.Score.string='Score:'+this.scoreCount
          this.SaveBestScore();
          this.GameModel.clickSound.play();      
        } else {
            this.EndGame();
          }
      }
    }

    private Spawn() {
        // Lấy vị trí của ô cuối cùng
      this.lastilePosition = this.theStack[this.stackIndex].position;
      this.stackIndex--;
       
      if (this.stackIndex < 0) {
          this.stackIndex = this.GameModel.stack.children.length - 1;
      }
      
       if(this.scoreCount>=5)
      {
        this.scoresa++
        this.down=new Vec3(0, -50, 0).multiplyScalar(this.scoresa);
      }
      this.desiresPosition = new Vec3(this.down)
    
        // Tạo màu ngẫu nhiên
      const red = this.randomRange(0, 255);
      const green = this.randomRange(0, 255);
      const blue = this.randomRange(0, 255);
      this.currentTileColor = new Color(red, green, blue);
      // Gán màu cho ô spawn ra
      const tile = this.theStack[this.stackIndex];
      tile.position = new Vec3(0, this.scoreCount, 0);
      tile.scale = new Vec3(this.stackBounds.x, 1, this.stackBounds.y);
      tile.getComponent(Sprite).color=this.currentTileColor;
    }
    
    private randomRange(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    private PlaceTile(): boolean {
      const t: Node = this.theStack[this.stackIndex];
      if (this.lastilePosition && t.position) {
        const deltaX: number = this.lastilePosition.x - t.position.x;
        if (Math.abs(deltaX) > this.ERROR_MARGIN) {
          //CUT THE TILE
          this.combo = 0;
          this.stackBounds.x -= Math.abs(deltaX);
          if (this.stackBounds.x <= 0) {
              return false;
          }
          const middle: number = (this.lastilePosition.x + t.position.x) / 2;
          t.scale = new Vec3(this.stackBounds.x, 1, this.stackBounds.y);
          this.createTile(new Vec3((t.position.x-this.lastilePosition.x>0) 
          ?t.position.x+(t.scale.x/2)
          :t.position.x-(t.scale.x/2)
          ,t.position.y),
          new Vec3(Math.abs(deltaX),1));
          t.position = new Vec3(middle, this.scoreCount); 
        }else {
          // PERFECT CUT
          this.combo++;
          t.scale = new Vec3(this.stackBounds.x, 1, this.stackBounds.y);
          t.position = new Vec3(this.lastilePosition.x, this.scoreCount);
        }
      }
        return true;
    }
    private MoveTile(): void {
      if(this.isdead)
        return;
     
      this.tileTransition += this.deltaTime * this.tileSpeed;
      const tilePosition = new Vec3(Math.sin(this.tileTransition) * this.BOUNDS_SIZE, this.scoreCount);
      this.theStack[this.stackIndex].setPosition(tilePosition);
      
    }
    private createTile(pos:Vec3,scale:Vec3)
    {
      if(this.objectPool.GetPooledOjects() != null)
      { 
        let Object =  this.objectPool.GetPooledOjects()
        Object.setScale(scale)
        Object.setPosition(pos)
        Object.active=true;
        Object.getComponent(Sprite).color=this.currentTileColor;
        this.scheduleOnce(() => {
        Object.active=false;
        Object.setScale(4, 1, 0) 
        Object.setPosition(0,0,0)
        Object.getComponent(RigidBody2D).linearVelocity=new Vec2(0,0);
        }, 4);; // Thời gian bắt đầu của đối tượng
      }
    }
    private SaveBestScore():void{
      this.bestScore.push(this.scoreCount)
      localStorage.setItem('BestScoreStack',JSON.stringify(this.bestScore))  
    }

    private EndGame(): void {
      this.isdead=true;
      this.theStack[this.stackIndex].addComponent(RigidBody2D);
      this.GameView.GameOverSprite.node.active=true;
      this.GameModel.gamoverSound.play()
      input.off(Input.EventType.KEY_DOWN)
      this.CountStart=0;

      this.gameClient.match
        .completeMatch(this.matchId, { score:this.scoreCount})
        .then((data) => {})
        .catch((error) => console.log(error));
    }

    private SoundMute()
      {
        this.GameModel.GameOverSound.volume=0;
        this.GameModel.ClickSound.volume=0;
        this.volumPoint.push(0)
        localStorage.setItem('VolumPoint',JSON.stringify(this.volumPoint)) 
      }

    private SoundBasic()
    {
      this.GameModel.gamoverSound.volume=1
      this.GameModel.clickSound.volume=1;
      this.volumPoint.push(1)
      localStorage.setItem('VolumPoint',JSON.stringify(this.volumPoint)) 
    }

    private Replay()
    {
      director.loadScene('Main')
      this.GameView.gamStartSprite.node.active=false;
      this.CountStart=0;
    }

    private Start()
    {
      this.GameView.gamStartSprite.node.active=false;
      director.resume();
      this.CountStart=1;
    }

}


