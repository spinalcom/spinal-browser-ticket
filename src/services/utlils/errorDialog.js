export function errorDialog(title, comfimText, msg, error) {
  const h = this.$createElement;
  const msgText = [h('span', null, msg)]
  if (error) {
    msgText.push(
      h('br', null, null),
      h('i', { style: 'color: teal' }, error)
    )
  }

  this.$msgbox({
    title,
    message: h('p', null, msgText),
    confirmButtonText: comfimText,
    closeOnClickModal: false,
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        window.location = "/html/drive/";
        done();
      } else {
        done();
      }
    }
  })
}

export default errorDialog;
