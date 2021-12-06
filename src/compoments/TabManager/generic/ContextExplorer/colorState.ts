var colorState = false;

function colored() {
  return colorState;
};

function changeState() {
  colorState = ! colorState;
};

module.exports = {
  colored,
  changeState
}