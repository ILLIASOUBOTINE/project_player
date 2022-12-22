const main = document.querySelector("main");
const demoPlayer = document.querySelector("audio");
const listAllSongs = document.querySelector("#all_songs");
const listMySongs = document.querySelector("#my_songs");
const navTrack = document.querySelector(".nav_track_menu");
const btnAllList = document.querySelector(".btn_all_list");
const btnMyList = document.querySelector(".btn_my_list");
const inputAllList = document.querySelector("#btn_all_list");
const inputMyList = document.querySelector("#btn_my_list");
const inpVolumeMusique = document.querySelector(".volume_musique");
const containerElem = document.querySelector(".container");
const inpSearchAllSong = document.querySelector("#inpSearchAllSong");
const inpSearchMySong = document.querySelector("#inpSearchMySong");
const trackTime = document.querySelector(".track_time");
const trackLine = document.querySelector(".track_line");
const trackCircle = document.querySelector(".track_circle");
const trackLineRed = document.querySelector(".track_line_red");

let arrUrlSongs = [
  "Ricky Rich, Gims-Say Oui.mp3",
  "Lina Maly - Schmerz Vereint.mp3",
  "Градусы - О тебе думаю.mp3",
  "Ritt Momney, Shane T - Sometime.mp3",
  "Dabro - Юность.mp3",
  "Elaine Mai, Loah - Waiting To Breathe.mp3",
  "Artik - Asti - Истеричка.mp3",
  "Revelle - Feuer Im Kamin.mp3",
  "3002-Делить_с_тобой.mp3",
  "Koffee - West Indies.mp3",
  "Gims, Vitaa - Prends Ma Main.mp3",
  "Eugénie - Silence.mp3",
  "Nothing, Nowhere - Pieces Of You.mp3",
  "5_Nizza-Soldat.mp3",
  "Debe - Nice Guy.mp3",
  "Upsahl - Thriving.mp3",
  "24kgoldn, Lil Tecca - Prada.mp3",
  "Rachel Mae Hannon - Tell Me.mp3",
  "basta-mama.mp3",
  "Matt Maltese - We Need To Talk.mp3",
];

let arrColor = [
  "rgb(151, 71, 255)",
  "rgb(161, 64, 32)",
  "rgb(161, 109, 32)",
  "rgb(161, 152, 32)",
  "rgb(135, 161, 32)",
  "rgb(75, 161, 32)",
  "rgb(32, 161, 64)",
  "rgb(32, 161, 129)",
  "rgb(32, 101, 161)",
  "rgb(32, 45, 161)",
  "rgb(7, 4, 16)",
];

let x1;
let x2;
let y2;
let countX = 0;
let trackCircleActive = false;
let setIntervalTrackLine;
let arrTime = [];
let arrSongs = [];
let arrMyList = [];
let setInervalChangeFond;
let setInter1;

class Song {
  title;
  author;
  duration;
  style;
  lang;
  url;

  constructor(title, author, url) {
    this.title = title;
    this.author = author;
    this.url = url;
  }
}

class MyPlayer {
  myDemoPlayer;
  loopSong = false;
  active = false;
  volume = 0.5;
  numTrack = 0;
  currentTime = 0;
  playList = [];
  historyList = [];
  randomSong = false;
  fondActive = true;
  oldPlayList = [];

  constructor(myDemoPlayer, playList) {
    this.myDemoPlayer = myDemoPlayer;
    this.playList = playList;
    this.myDemoPlayer.volume = this.volume;
    }

  play() {
    if (this.fondActive) {
      changeFond();
    }
    fooPlay(this.myDemoPlayer, this.playList, this.numTrack, this.historyList);
    this.myDemoPlayer.currentTime = this.currentTime;
    this.myDemoPlayer.play();
    this.active = true;

    setInter1 = setInterval(() => {
      if (this.myDemoPlayer.ended && this.playList.length > this.numTrack) {
        this.numTrack++;
        if (this.playList.length > this.numTrack) {
          fooPlay(
            this.myDemoPlayer,
            this.playList,
            this.numTrack,
            this.historyList
          );
          this.myDemoPlayer.play();
        } else {
          this.stop();
          this.currentTime = 0;
          this.numTrack = 0;

          document.querySelector(".play").classList.remove("display_none");
          document.querySelector(".stop").classList.add("display_none");
        }
      }
    }, 10);
  }

  stop() {
    this.myDemoPlayer.pause();
    this.currentTime = this.myDemoPlayer.currentTime;
    clearInterval(setInter1);
    clearInterval(setInervalChangeFond);
    this.active = false;
  }

  reset() {
    if (this.active) {
      this.currentTime = 0;
      clearInterval(setInervalChangeFond);
      this.play();
    } else {
      this.myDemoPlayer.volume = 0;
      clearInterval(setInervalChangeFond);
      this.play();

      setTimeout(() => {
        this.stop();
        this.currentTime = 0.001;
        this.myDemoPlayer.currentTime = this.currentTime;
        this.myDemoPlayer.volume = this.volume;
      }, 100);
    }
  }

  loop() {
    this.loopSong = !this.loopSong;
    this.myDemoPlayer.loop = this.loopSong;
  }

  next() {
    if (this.numTrack < this.playList.length - 1) {
      ++this.numTrack;
    } else {
      this.numTrack = 0;
    }
    this.reset();
  }

  prev() {
    if (this.numTrack > 0) {
      --this.numTrack;
    } else {
      this.numTrack = this.playList.length - 1;
    }
    this.reset();
  }

  setVolum(vol) {
    this.volume = vol;
    this.myDemoPlayer.volume = this.volume;
  }

  random() {
    this.randomSong = !this.randomSong;
    if (this.randomSong) {
      this.oldPlayList = [...this.playList];
      this.playList = createRadomListSong(this.playList);
      player.numTrack = 0;
      this.reset();
    } else {
      player.numTrack = 0;
      this.playList = this.oldPlayList;
      this.reset();
    }
  }

  rewindMinus() {
    this.myDemoPlayer.currentTime = this.myDemoPlayer.currentTime - 10;
    this.currentTime = this.myDemoPlayer.currentTime;
  }

  rewindPlus() {
    this.myDemoPlayer.currentTime = this.myDemoPlayer.currentTime + 10;
    this.currentTime = this.myDemoPlayer.currentTime;
  }

  stopScreen() {
    if (this.active) {
      this.stop();
      this.fondActive = !this.fondActive;
      this.play();
    } else {
      this.fondActive = !this.fondActive;
    }
    
  }

  mute() {
    this.myDemoPlayer.muted = !this.myDemoPlayer.muted;
  }
}

function createSong(arr, arrSongs) {
  let i = 0;
  for (let song of arr) {
    let propsSong = song.split(/[-.]/);
    let url = `chansons/${song}`;
    let newSong = new Song(propsSong[1], propsSong[0], url);
    arrSongs.push(newSong);

    i++;
  }
}

function createItemMusique(parent, title, author) {
  let div = document.createElement("div");
  div.className = "item_musique style_item_list dropdown-item";

  let p_title = document.createElement("p");
  p_title.classList.add("title_item_musique");
  p_title.textContent = title;
  div.append(p_title);

  let p_props = document.createElement("p");
  p_props.classList.add("props_item_musique");

  p_props.innerHTML = `<img src="imgs/add_icon.svg" alt=""><span>${author}</span>`;
  div.append(p_props);

  parent.append(div);
}

function fooPlay(demoPlayer, arrSongs, numTrack, historyList) {
  demoPlayer.src = arrSongs[numTrack].url;
  historyList.push(arrSongs[numTrack]);

  document.querySelector(".title_song").textContent = arrSongs[numTrack].title;
  document.querySelector(".author_song").textContent =
    arrSongs[numTrack].author;

  for (let item of listAllSongs.children) {
    item.classList.remove("item_musique_active");
  }
  if (listMySongs.children.length > 0) {
    for (let item of listMySongs.children) {
      item.classList.remove("item_musique_active");
    }
  }

  if (inputAllList.checked) {
    for (let item of listAllSongs.children) {
      if (arrSongs[numTrack].title === item.firstChild.textContent) {
        item.classList.add("item_musique_active");
      }
    }
  } else if (!inputAllList.checked && !inputMyList.checked) {
    for (let item of listAllSongs.children) {
      if (arrSongs[numTrack].title === item.firstChild.textContent) {
        item.classList.add("item_musique_active");
      }
    }
  } else if (inputMyList.checked) {
    for (let item of listMySongs.children) {
      if (arrSongs[numTrack].title === item.firstChild.textContent) {
        item.classList.add("item_musique_active");
      }
    }
  }
}

function fooConverTime(sec) {
  let s = sec % 60;
  let m = (sec - s) / 60;
  if (s >= 10) {
    return `${m}:${s}`;
  } else {
    return `${m}:0${s}`;
  }
}

function trackLineAnimation() {
  setIntervalTrackLine = setInterval(() => {
    if (player.myDemoPlayer.currentTime !== 0) {
      trackTime.textContent = fooConverTime(
        Math.round(
          player.myDemoPlayer.duration - player.myDemoPlayer.currentTime
        )
      );
      let coordX =
        (trackLine.clientWidth * Math.round(player.myDemoPlayer.currentTime)) /
        Math.round(player.myDemoPlayer.duration);
      trackCircle.style.left = `${coordX}px`;
      trackLineRed.style.width = `${coordX}px`;
    } else {
      trackTime.textContent = "0:00";
      trackCircle.style.left = `0px`;
      trackLineRed.style.width = `0px`;
    }
  }, 10);
}

function createRadomListSong(arrSongs) {
  let newArr = [];
  let maxNum = arrSongs.length;
  let i = 0;

  while (i < maxNum) {
    let indexRandom = Math.floor(Math.random() * maxNum);
    let elemExist = newArr.filter((elem) => {
      return elem.title === arrSongs[indexRandom].title;
    });
    if (elemExist.length > 0) {
    } else {
      newArr.push(arrSongs[indexRandom]);

      i++;
    }
  }

  return newArr;
}

function changeFond() {
  let cout = 0;
  setInervalChangeFond = setInterval(() => {
    containerElem.style.backgroundColor = arrColor[cout];

    cout++;
    if (cout === arrColor.length) {
      cout = 0;
    }
  }, 1000);
}
/////////////                   logique                //////////////////////////

createSong(arrUrlSongs, arrSongs);



for (let item of arrSongs) {
  createItemMusique(listAllSongs, item.title, item.author);
}

const player = new MyPlayer(demoPlayer, arrSongs);

trackLineAnimation();

trackCircle.addEventListener("mousedown", (e) => {
  clearInterval(setIntervalTrackLine);
  x1 = trackCircle.getBoundingClientRect().x + trackCircle.clientWidth / 2;
  trackCircleActive = true;

  countX =
    (trackLine.clientWidth * Math.round(player.myDemoPlayer.currentTime)) /
    Math.round(player.myDemoPlayer.duration);
});

trackCircle.addEventListener("mousemove", (e) => {
  if (trackCircleActive) {
    x2 = e.pageX;
    y2 = e.pageY;
    if (x2 <= trackLine.getBoundingClientRect().x) {
      trackCircle.style.left = `${0}px`;
      trackTime.textContent = "0:00";
    } else if (
      x2 >=
      trackLine.getBoundingClientRect().x +
        trackLine.getBoundingClientRect().width
    ) {
      trackCircle.style.left = `${
        trackLine.getBoundingClientRect().width - trackCircle.clientWidth
      }px`;
    } else {
      trackCircle.style.left = `${countX + x2 - x1}px`;
      trackTime.textContent = fooConverTime(
        Math.round(
          (countX + x2 - x1) *
            (player.myDemoPlayer.duration / trackLine.clientWidth)
        )
      );
    }
  }
});

trackCircle.addEventListener("mouseup", (e) => {
  trackCircleActive = false;
  countX = trackCircle.offsetLeft;
  player.myDemoPlayer.currentTime =
    (countX * Math.round(player.myDemoPlayer.duration)) / trackLine.clientWidth;
  player.currentTime = player.myDemoPlayer.currentTime;

  trackLineAnimation();
});

trackCircle.addEventListener("mouseleave", (e) => {
  if (trackCircleActive) {
    trackCircleActive = false;

    countX = trackCircle.offsetLeft;
    player.myDemoPlayer.currentTime =
      (countX * Math.round(player.myDemoPlayer.duration)) /
      trackLine.clientWidth;
    player.currentTime = player.myDemoPlayer.currentTime;
    trackLineAnimation();
  }
});

///////////// trackTime ///////////////

listAllSongs.addEventListener("click", (e) => {
  if (e.target.localName === "img") {
    let elem = e.target;
    let newItemMusique = elem.parentElement.parentElement.cloneNode(true);
    newItemMusique.lastChild.firstChild.src = "imgs/delete_icon.svg";
    listMySongs.append(newItemMusique);
    for (let item of arrSongs) {
      if (item.title === newItemMusique.firstChild.textContent) {
        arrMyList.push(item);
        if (arrMyList.length === 1) {
          btnMyList.classList.remove("display_hidden");
          listMySongs.previousElementSibling.classList.remove("display_none");
        }
      }
    }
    elem.classList.add("display_hidden");
  }

  if (e.target.classList.contains("title_item_musique")) {
    let elem = e.target;
    for (let item of arrSongs) {
      if (item.title === elem.firstChild.textContent) {
        document.querySelector(".play").classList.add("display_none");
        document.querySelector(".stop").classList.remove("display_none");
        player.playList = [item];
        player.numTrack = 0;
        inputAllList.checked = false;
        inputMyList.checked = false;
        document.querySelector(".random").classList.remove("active_nav_track");
        player.randomSong = false;

        player.randomSong = false;
        player.currentTime = 0;
        clearInterval(setInervalChangeFond);
        player.play();
      }
    }
  }
});

listMySongs.addEventListener("click", (e) => {
  if (e.target.localName === "img") {
    let elem = e.target;
    for (let item of listAllSongs.children) {
      if (
        item.firstChild.textContent ===
        elem.parentElement.previousSibling.textContent
      ) {
        item.lastChild.firstChild.classList.remove("display_hidden");
      }
      let i = 0;
      for (let item1 of arrMyList) {
        if (item1.title === elem.parentElement.previousSibling.textContent) {
          arrMyList.splice(i, 1);
          if (arrMyList.length === 0) {
            btnMyList.classList.add("display_hidden");
            listMySongs.previousElementSibling.classList.add("display_none");
            player.playList = arrSongs;
            inputAllList.checked = true;
            player.numTrack = 0;
          }
        }
        i++;
      }
    }
    elem.parentElement.parentElement.remove();
  }
});

navTrack.addEventListener("click", (e) => {
  if (e.target.parentElement.className === "play") {
    document.querySelector(".stop").classList.toggle("display_none");
    e.target.parentElement.classList.toggle("display_none");
    clearInterval(setInervalChangeFond);
    player.play();
  }

  if (e.target.parentElement.className === "stop") {
    document.querySelector(".play").classList.toggle("display_none");
    e.target.parentElement.classList.toggle("display_none");

    player.stop();
  }

  if (e.target.parentElement.className === "reset") {
    player.reset();
  }

  if (e.target.parentElement.classList.contains("loop")) {
    e.target.parentElement.classList.toggle("active_nav_track");

    player.loop();
  }

  if (e.target.parentElement.className === "next") {
    player.next();
  }

  if (e.target.parentElement.className === "prev") {
    player.prev();
  }

  if (e.target.classList.contains("volume_img")) {
    document.querySelector(".block_volume").classList.toggle("display_none");
    e.target.classList.toggle("active_nav_track");
  }

  if (e.target.parentElement.classList.contains("random")) {
    console.dir(e.target);

    if (inputAllList.checked || inputMyList.checked) {
      e.target.parentElement.classList.toggle("active_nav_track");
      player.random();
    }
  }

  if (e.target.parentElement.className === "rewind_minus") {
    player.rewindMinus();
  }

  if (e.target.parentElement.className === "rewind_plus") {
    player.rewindPlus();
  }

  if (e.target.parentElement.classList.contains("stop_screen")) {
    e.target.classList.toggle("active_nav_track");
    player.stopScreen();
  }

  if (e.target.parentElement.classList.contains("mute")) {
    e.target.classList.toggle("active_nav_track");
    player.mute();
  }
});

inpVolumeMusique.addEventListener("input", (e) => {
  player.setVolum(Number(inpVolumeMusique.value) / 100);
});

btnAllList.addEventListener("click", (e) => {
  if (player.randomSong) {
    for (let song of listAllSongs.children) {
      for (let i = 0; i < player.playList.length; i++) {
        if (song.firstChild.textContent === player.playList[i].title) {
          song.style.order = `${i}`;
        }
      }
    }
  } else {
    for (let song of listAllSongs.children) {
      song.style.order = `1`;
    }

    player.playList = arrSongs;
    player.numTrack = 0;
    player.reset();
  }
});

btnMyList.addEventListener("click", (e) => {
  if (player.randomSong) {
    for (let song of listMySongs.children) {
      for (let i = 0; i < player.playList.length; i++) {
        if (song.firstChild.textContent === player.playList[i].title) {
          console.log(song);
          song.style.order = `${i}`;
        }
      }
    }
  } else {
    for (let song of listMySongs.children) {
      song.style.order = `1`;
    }

    inputMyList.disabled = false;
    player.playList = arrMyList;
    player.numTrack = 0;
    console.log(player.playList);

    player.reset();
  }
});

//     Search  All lIst      ////////
inpSearchAllSong.addEventListener("input", (e) => {
  let str = e.target.value;
  console.log(str);
  for (let song of listAllSongs.children) {
    if (
      song.firstChild.textContent.toLowerCase().match(str.toLowerCase()) ||
      song.lastChild.lastChild.textContent
        .toLowerCase()
        .match(str.toLowerCase())
    ) {
    } else {
      song.classList.add("display_none");
    }
  }

  if (str === "") {
    for (let song of listAllSongs.children) {
      song.classList.remove("display_none");
    }
  }
});

inpSearchMySong.addEventListener("input", (e) => {
  let str = e.target.value;
  console.log(str);
  for (let song of listMySongs.children) {
    if (
      song.firstChild.textContent.toLowerCase().match(str.toLowerCase()) ||
      song.lastChild.lastChild.textContent
        .toLowerCase()
        .match(str.toLowerCase())
    ) {
    } else {
      song.classList.add("display_none");
    }
  }

  if (str === "") {
    for (let song of listMySongs.children) {
      song.classList.remove("display_none");
    }
  }
});
