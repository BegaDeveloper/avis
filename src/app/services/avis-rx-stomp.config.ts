import { RxStompConfig } from '@stomp/rx-stomp';
import { environment } from '../../environments/environment';

export const avisRxStompConfig: RxStompConfig = {
  brokerURL: environment.webSocketUrl,
  heartbeatIncoming: 15000,
  heartbeatOutgoing: 15000,
  reconnectDelay: 2000,
};

if (!environment.production) {
  avisRxStompConfig.debug = (msg: string): void => {
    console.log(new Date(), msg);
  }
}
