import { _decorator, Component, Label, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Views')
export class Views extends Component {
  @property(Label)
    score:Label
 
  public get Score() : Label {
    return this.score
  }
  
  public set ScoreValue(v : Label) {
    this.score = v;
  }

  @property(Label)
  bestscore:Label

  public get BestScore() : Label {
    return this.bestscore
  }

  public set Bescorevalue(v : Label) {
    this.bestscore = v;
  }

  @property(Sprite)
  gamOverSprite:Sprite

  public get GameOverSprite() : Sprite {
    return this.gamOverSprite
  }

  public set GameOverSprite1(v : Sprite) {
    this.gamOverSprite = v;
  }

  @property(Sprite)
  gamStartSprite:Sprite

  public get GameStartSprite() : Sprite {
    return this.gamStartSprite
  }

  public set GameStartSprite1(v : Sprite) {
    this.gamStartSprite = v;
  }

}


