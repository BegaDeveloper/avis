import { RxStompService } from './rx-stomp.service';
import { avisRxStompConfig } from './avis-rx-stomp.config';

export function RxStompServiceFactory() {
  const rxStomp = new RxStompService();
  rxStomp.configure(avisRxStompConfig);
  rxStomp.activate();
  return rxStomp;
}
