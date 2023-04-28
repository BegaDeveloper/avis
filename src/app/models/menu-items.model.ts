export interface MenuItem {
  name: string;
  icon: string;
  path: string;
}

export const ADMIN_ITEMS: MenuItem[] = [
  { name: 'Korisnici', icon: './assets/icons/korisnici.svg', path: '/main/users' },
  { name: 'Podešavanja', icon: './assets/icons/settings.svg', path: '/main/settings' },
  { name: 'Audio kontroleri', icon: './assets/icons/audio-controller.svg', path: '/main/audio-controller' },
];

export const CONTROLLER_ITEMS: MenuItem[] = [
  { name: 'Stanice', icon: './assets/icons/stanice.svg', path: '/main/stations' },
  { name: 'Rute', icon: './assets/icons/rute.svg', path: '/main/routes' },
  { name: 'Vozovi', icon: './assets/icons/voz.svg', path: '/main/trains' },
  { name: 'Operatori', icon: './assets/icons/operatori.svg', path: '/main/operators' },
  {
    name: 'Specijalni dani',
    icon: './assets/icons/special_day.svg',
    path: '/main/special-days',
  },
  {
    name: 'Nedeljni rasporedi',
    icon: './assets/icons/nedeljni.svg',
    path: '/main/weekly-schedules',
  },
  {
    name: 'Intervali plana',
    icon: './assets/icons/interval.svg',
    path: '/main/interval-plan',
  },
  { name: 'Planovi', icon: './assets/icons/planovi.svg', path: '/main/plans' },
  { name: 'Info table', icon: './assets/icons/peron.svg', path: '/main/display-track-realization' },
  { name: 'Realizacija', icon: '/assets/icons/realization.svg', path: '/main/realization' },
  { name: 'Poruke', icon: '/assets/icons/chat.svg', path: '/main/messages' },
  { name: 'Audio poruke', icon: '/assets/icons/audio.svg', path: '/main/audio-messages' },
];

export const OPERATOR_ITEMS: MenuItem[] = [
  { name: 'Info table', icon: './assets/icons/peron.svg', path: '/main/display-track-realization' },
  { name: 'Realizacija', icon: '/assets/icons/realization.svg', path: '/main/realization' },
  { name: 'Poruke', icon: '/assets/icons/chat.svg', path: '/main/messages' },
];
