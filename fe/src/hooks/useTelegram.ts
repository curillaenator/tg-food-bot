import {} from '../';

export const useTelegram = () => {
  const tg = window.Telegram.WebApp;

  const toggleCTA = () => {
    tg.MainButton.isVisible ? tg.MainButton.hide() : tg.MainButton.show();
  };

  return {
    tg,
    toggleCTA,
  };
};
