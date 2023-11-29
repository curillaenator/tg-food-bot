export const useTelegram = () => {
  const tg = window.Telegram?.WebApp;

  const toggleCTA = () => {
    tg.MainButton?.isVisible ? tg.MainButton.hide() : tg.MainButton.show();
  };

  return {
    tg,
    tgUser: tg.initDataUnsafe.user,
    tgQueryId: tg.initDataUnsafe.query_id,
    toggleCTA,
  };
};
