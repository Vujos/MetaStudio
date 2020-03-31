import { Injectable }           from '@angular/core';
import { HeroProfileComponent } from './hero-profile.component';
import { AdItem }               from './ad-item';

@Injectable()
export class AdService {
  getAds() {
    return [
      new AdItem(HeroProfileComponent, {})
    ];
  }
}
