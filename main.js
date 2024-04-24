const main = document.querySelector("main");
const demoPlayer = document.querySelector("audio");
const listAllSongs = document.querySelector("#all_songs");
const listMySongs = document.querySelector("#my_songs");
const navTrack = document.querySelector(".nav_track_menu");
const btnAllList = document.querySelector(".btn_all_list");
const btnMyList = document.querySelector(".btn_my_list");
const inputAllList = document.querySelector("#btn_all_list");
const inputMyList = document.querySelector("#btn_my_list");
const inpVolumeMusique = document.querySelector("#volume_musique");
const inpVolumeMusique1 = document.querySelector("#volume_musique1");
const containerElem = document.querySelector(".container1");
const inpSearchAllSong = document.querySelector("#inpSearchAllSong");
const inpSearchMySong = document.querySelector("#inpSearchMySong");
const trackTime = document.querySelector(".track_time");
const trackTimeTotal = document.querySelector(".track_time_total");
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
  volume = 0.1;
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
    }, 100);
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
      clearInterval(setInter1);
      this.play();
    } else {
      this.myDemoPlayer.volume = 0;
      clearInterval(setInervalChangeFond);
      clearInterval(setInter1);
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
      this.oldPlayList = this.playList;

      this.playList = createRadomListSong(this.playList);

      player.numTrack = 0;
      this.reset();
    } else {
      player.numTrack = 0;
      this.playList = this.oldPlayList;
      this.reset();
    }

    if (inputAllList.checked) {
      reordreRandomSongs(listAllSongs);
    } else {
      reordreRandomSongs(listMySongs);
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
    this.stop();
    this.fondActive = !this.fondActive;
    this.play();
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
      if (isNaN(player.myDemoPlayer.duration)) {
      } else {
        trackTime.textContent = fooConverTime(
          Math.round(player.myDemoPlayer.currentTime)
        );
        trackTimeTotal.textContent = fooConverTime(
          Math.round(player.myDemoPlayer.duration)
        );
      }

      let coordX =
        (trackLine.clientWidth * Math.round(player.myDemoPlayer.currentTime)) /
        Math.round(player.myDemoPlayer.duration);

      trackLineRed.style.width = `${coordX}px`;
    } else {
      trackTime.textContent = "0:00";

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
  }, 2000);
}

function reordreRandomSongs(list) {
  if (player.randomSong) {
    for (let song of list.children) {
      for (let i = 0; i < player.playList.length; i++) {
        if (song.firstChild.textContent === player.playList[i].title) {
          song.style.order = `${i}`;
        }
      }
    }
  } else {
    for (let song of list.children) {
      song.style.order = `1`;
    }
  }
}
/////////////                   logique                //////////////////////////

createSong(arrUrlSongs, arrSongs);

for (let item of arrSongs) {
  createItemMusique(listAllSongs, item.title, item.author);
}

const player = new MyPlayer(demoPlayer, arrSongs);

trackLineAnimation();

////////////////////// trackLine //////////////////

trackLine.addEventListener("mousedown", (e) => {
  if (!isNaN(player.myDemoPlayer.duration)) {
    x1 = trackLine.getBoundingClientRect().x;
    x2 = e.pageX;
    player.currentTime = Math.round(
      (x2 - x1) * (player.myDemoPlayer.duration / trackLine.clientWidth)
    );
    player.myDemoPlayer.currentTime = player.currentTime;

    trackTime.textContent = fooConverTime(
      Math.round(
        (x2 - x1) * (player.myDemoPlayer.duration / trackLine.clientWidth)
      )
    );
  }
});

trackLine.addEventListener("mousemove", (e) => {
  x1 = trackLine.getBoundingClientRect().x;
  x2 = e.pageX;
  if (isNaN(player.myDemoPlayer.duration)) {
    trackLine.title = "";
  } else {
    trackLine.title = fooConverTime(
      Math.round(
        (x2 - x1) * (player.myDemoPlayer.duration / trackLine.clientWidth)
      )
    );
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
        if (inputMyList.checked && player.randomSong) {
          player.playList.push(item);
          player.oldPlayList = arrMyList;
          newItemMusique.style.order = `${listMySongs.children.length}`;
        }
        if (arrMyList.length === 1) {
          listMySongs.previousElementSibling.classList.remove("display_none");
        }
      }
    }
    elem.classList.add("display_hidden");
  }

  if (e.target.classList.contains("title_item_musique")) {
    let elem = e.target;
    let i = 0;
    let arrS = arrSongs;
    if (!inputAllList.checked) {
      player.playList = arrSongs;
      player.randomSong = false;
      reordreRandomSongs(listAllSongs);
      reordreRandomSongs(listMySongs);
      document.querySelector(".random").classList.remove("active_nav_track");
    } else if (player.randomSong) {
      arrS = player.playList;
    }
    inputAllList.checked = true;

    for (let item of arrS) {
      if (item.title === elem.firstChild.textContent) {
        document.querySelector(".play").classList.add("display_none");
        document.querySelector(".stop").classList.remove("display_none");
        player.numTrack = i;
        console.log(i);

        player.currentTime = 0;
        clearInterval(setInervalChangeFond);
        clearInterval(setInter1);
        player.play();
      } else {
        i++;
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
          if (inputMyList.checked && player.randomSong) {
            let j = 0;
            for (let delSong of player.playList) {
              if (delSong.title === item1.title) {
                player.playList.splice(j, 1);
              }
              j++;
            }
            player.oldPlayList = arrMyList;
          }

          if (arrMyList.length === 0) {
            listMySongs.previousElementSibling.classList.add("display_none");
            player.playList = arrSongs;
            inputAllList.checked = true;
            player.stop();
            player.numTrack = 0;
            document.querySelector(".play").classList.remove("display_none");
            document.querySelector(".stop").classList.add("display_none");
            player.reset();
          }
        }
        i++;
      }
    }
    elem.parentElement.parentElement.remove();
  }

  if (e.target.classList.contains("title_item_musique")) {
    let elem = e.target;
    let i = 0;
    let arrS = arrMyList;
    if (!inputMyList.checked) {
      player.playList = arrMyList;
      player.randomSong = false;
      reordreRandomSongs(listMySongs);
      reordreRandomSongs(listAllSongs);
      document.querySelector(".random").classList.remove("active_nav_track");
    } else if (player.randomSong) {
      arrS = player.playList;
    }
    inputMyList.checked = true;
    for (let item of arrS) {
      if (item.title === elem.firstChild.textContent) {
        document.querySelector(".play").classList.add("display_none");
        document.querySelector(".stop").classList.remove("display_none");
        player.numTrack = i;

        player.currentTime = 0;
        clearInterval(setInervalChangeFond);
        clearInterval(setInter1);
        player.play();
      } else {
        i++;
      }
    }
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
  if (e.target.parentElement.className === "volume") {
    document
      .querySelector(".volume>.block_volume")
      .classList.toggle("display_none");
    e.target.classList.toggle("active_nav_track");
  }

  if (e.target.parentElement.classList.contains("random")) {
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
  inpVolumeMusique1.value = inpVolumeMusique.value;
});

inpVolumeMusique1.addEventListener("input", (e) => {
  player.setVolum(Number(inpVolumeMusique1.value) / 100);
  inpVolumeMusique.value = inpVolumeMusique1.value;
});

document.querySelector(".volume_img").addEventListener("click", (e) => {
  document.querySelector(".block_volume").classList.toggle("display_none");
  e.target.classList.toggle("active_nav_track");
});

// btnAllList.addEventListener("click", (e) => {

// });

// btnMyList.addEventListener("click", (e) => {

// });

//     Search  All lIst      ////////
inpSearchAllSong.addEventListener("input", (e) => {
  let str = e.target.value;

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
