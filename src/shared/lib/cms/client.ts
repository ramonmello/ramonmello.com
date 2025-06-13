import { CMSClient } from "./types";
import { TinaCMS } from "./adapters/tina";

class CMSFactory {
  private static instance: CMSClient;

  static get(): CMSClient {
    if (!CMSFactory.instance) {
      CMSFactory.instance = new TinaCMS();
    }
    return CMSFactory.instance;
  }
}

export const cms = CMSFactory.get();
