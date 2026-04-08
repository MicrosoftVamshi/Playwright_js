async function captureNextDialogMessage(page, timeoutMs = 7000) {
  return new Promise((resolve) => {
    let done = false;

    const timer = setTimeout(() => {
      if (done) return;
      done = true;
      resolve(null); // no dialog appeared within timeout
    }, timeoutMs);

    page.once("dialog", async (dialog) => {
      if (done) return;
      done = true;
      clearTimeout(timer);

      const msg = dialog.message();
      try {
        await dialog.accept();
      } catch (e) {
        // ignore "already handled"
      }
      resolve(msg);
    });
  });
}

module.exports = { captureNextDialogMessage };
