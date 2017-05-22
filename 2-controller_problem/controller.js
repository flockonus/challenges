document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp':
      moveUp();
      break;
    case 'ArrowDown':
      moveDown();
      break;
    default:
      break;
  }
});

// If you're creating any joint helpers, can do that as well

function moveUp() {
  // Modify code here!
  let selected = document.getElementsByClassName('selected')[0];
  selected.classList.remove('selected');

  let randomElement = document.getElementById(`${Math.floor(Math.random()*20)}`)
  randomElement.classList.add('selected');
}

function moveDown() {
  // Modify code here!
  let selected = document.getElementsByClassName('selected')[0];
  selected.classList.remove('selected');

  let randomElement = document.getElementById(`${Math.ceil(Math.random()*20)}`)
  randomElement.classList.add('selected');
}