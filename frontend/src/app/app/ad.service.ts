import { Injectable }           from '@angular/core';
import { ProjectManagerComponent } from './project-manager.component';
import { AdItem }               from './ad-item';

@Injectable()
export class AdService {
  getAds() {
    return [
      new AdItem(ProjectManagerComponent, {})
    ];
  }
}
