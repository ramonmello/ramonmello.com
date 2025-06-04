import { Component } from "@/features/engine/core/base/Component";

export class AsteroidComponent extends Component {
  static readonly TYPE = "asteroid";
  readonly type = AsteroidComponent.TYPE;

  constructor(public size: number = 30) {
    super();
  }
}
