import { TelegramWebApps } from 'telegram-webapps-types';

declare global {
  interface Window {
    Telegram: TelegramWebApps.SDK;
  }
}
