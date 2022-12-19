const demoPlayer = document.querySelector("audio");
const listAllSongs = document.querySelector("#all_songs");
const listMySongs = document.querySelector("#my_songs");
const navTrack = document.querySelector(".nav_track");
const btnAllList = document.querySelector(".btn_all_list");
const btnMyList = document.querySelector(".btn_my_list");
const inputAllList = document.querySelector("#btn_all_list");
const inputMyList = document.querySelector("#btn_my_list");
const inpVolumeMusique = document.querySelector(".volume_musique");


console.dir(inpVolumeMusique);
console.dir(demoPlayer);
console.dir(navTrack);

let arrUrlSongs = ['5_Nizza-Soldat.mp3','3002-Делить_с_тобой.mp3','basta-mama.mp3'];
let arrTime = [];
let arrSongs = [];
let arrMyList = [];

class Song {
    title;
    duration;
    style;
    lang;
    url;
    
    constructor(title, duration,url) {
        this.title = title;
        this.duration = duration;
        this.url = url;
    }
}

class MyPlayer {
    myDemoPlayer;
    loopSong = false;
    volume = 0.5;
    numTrack = 0;
    currentTime = 0;
    playList = [];
    historyList = [];

    constructor(myDemoPlayer, playList) {
      this.myDemoPlayer = myDemoPlayer;
      this.playList = playList;
      this.myDemoPlayer.volume = this.volume;
    }

    play(){
        fooPlay(this.myDemoPlayer, this.playList, this.numTrack, this.historyList);
        this.myDemoPlayer.currentTime = this.currentTime;
        const setInter1 = setInterval(()=> {
            if (this.myDemoPlayer.ended && this.playList.length > this.numTrack  ) {
                this.numTrack++;
                if(this.playList.length > this.numTrack) {
                   fooPlay(this.myDemoPlayer, this.playList, this.numTrack, this.historyList); 
                }else {
                    clearInterval(setInter1);
                    this.numTrack = 0;
                }
            }    
        }, 10)
    }

    stop(){
        this.myDemoPlayer.pause();
        this.currentTime = this.myDemoPlayer.currentTime;
        //  clearInterval(setInter1);
    }

    reset(){
        this.currentTime = 0;
        this.play();
    }

    loop(){
        this.loopSong = !this.loopSong;
        this.myDemoPlayer.loop = this.loopSong;
    }

    next(){
        if (this.numTrack < this.playList.length - 1) {
           ++this.numTrack; 
        }else { 
            this.numTrack = 0;
        }
        this.reset();
    }

    prev(){
        if (this.numTrack > 0) {
           --this.numTrack; 
        }else { 
            this.numTrack = this.playList.length - 1;
        }
        this.reset();
    }

    setVolum(vol){
        this.volume = vol;
        this.myDemoPlayer.volume = this.volume;
    }



}

function createSong(arr,arrTime,arrSongs) {
    let i = 0;
    for(let song of arr){
        let propsSong =  song.split(/[-.]/);
        let url = `chansons/${song}`;
        let newSong = new Song(propsSong[1], arrTime[i], url);
        arrSongs.push(newSong);
        console.log(newSong); 
        i++;
    }
   
}

function getDurationSong(arrUrlSongs) {
    let i = 0;
    const setInter = setInterval(()=> {
        let g = document.createElement("audio");
        g.src = `chansons/${arrUrlSongs[i]}`;
        g.onloadeddata = ()=>{
        arrTime.push(Math.floor(g.duration));
        };
        i++;
        if (arrUrlSongs.length === i) {
            clearInterval(setInter);
        }
    },10);
}

// async function getDurationSong(arrUrlSongs) {
   
//     for(let item of arrUrlSongs) {
//         let g = document.createElement("audio");
//         g.src = `chansons/${item}`;
//         g.onloadeddata = ()=>{
//         let time = await (Math.floor(g.duration));
//             arrTime.push(time);
//         };
//     }
// }

// async function getDurSong(item){
//     let g = document.createElement("audio");
//     g.src = `chansons/${item}`;
//     g.onloadeddata = ()=>{
//       let time = await (Math.floor(g.duration));
//       arrTime.push(time);
//     };
    
// }

function createItemMusique(parent, title,time ) {
    let div =  document.createElement("div");
    div.className = "item_musique style_item_list dropdown-item";
    // div.classList.add("item_musique").add("style_item_list").add("dropdown-item");

    let p_title =  document.createElement("p");
    p_title.classList.add("title_item_musique");
    p_title.textContent = title;
    div.append(p_title);

    let p_props =  document.createElement("p");
    p_props.classList.add("props_item_musique");
    p_props.innerHTML = `<img src="imgs/add_icon.svg" alt=""><span>musique pop</span><span>en</span><span>${(time-time%60)/60}:${time%60}</span>`;
    div.append(p_props);
    
    parent.append(div); 
}

function fooPlay(demoPlayer,arrSongs,numTrack,historyList) {
    demoPlayer.src = arrSongs[numTrack].url;
    historyList.push(arrSongs[numTrack]);
    console.log(historyList);
    document.querySelector(".title_song").textContent = historyList[historyList.length -1].title;
    
    demoPlayer.play();
}

function fooConverTime(sec) {
    let s = sec%60;
    let m = (sec - s)/60;
    if(s >= 10){
        return `${m}:${s}`;
    }else {
        return `${m}:0${s}`;
    }
}


                   /////////////                   logique                //////////////////////////

getDurationSong(arrUrlSongs);

setTimeout(()=>{
    createSong(arrUrlSongs,arrTime,arrSongs);

    for(let item of arrSongs){
       createItemMusique(listAllSongs, item.title, item.duration);
    }

    const player = new MyPlayer(demoPlayer, arrSongs);

    ///////////// trackTime ///////////////

    const trackTime = document.querySelector(".track_time");
    const trackLine = document.querySelector(".track_line");
    const trackCircle = document.querySelector(".track_circle");
    const trackLineRed = document.querySelector(".track_line_red");
    let coordX = 0;
    // console.dir(trackLine);
    setIntervalTrack = setInterval(() => {
        if (player.myDemoPlayer.currentTime !== 0) {
            trackTime.textContent = fooConverTime(Math.round(player.myDemoPlayer.duration 
            - player.myDemoPlayer.currentTime));
            coordX = trackLine.clientWidth*Math.round(player.myDemoPlayer.currentTime)/Math.round(player.myDemoPlayer.duration);
            trackCircle.style.left = `${coordX - 25}px`;
            trackLineRed.style.width = `${coordX - 25}px`;
        }else {
            trackTime.textContent = '0:00' ;
            trackCircle.style.left = `-25px`;
            trackLineRed.style.width = `0px`;
        }
    }, 10)

    ///////////// trackTime ///////////////
    
    listAllSongs.addEventListener("click", (e)=>{
        
        if (e.target.localName === "img") {
            let elem = e.target;
            let newItemMusique = elem.parentElement.parentElement.cloneNode(true);
            newItemMusique.lastChild.firstChild.src = "imgs/delete_icon.svg";
            listMySongs.append(newItemMusique);
            for(let item of arrSongs){
                if(item.title === newItemMusique.firstChild.textContent){
                    arrMyList.push(item);
                    if (arrMyList.length === 1) {
                        btnMyList.classList.remove("display_hidden");
                        
                    }
                    console.log(arrMyList);
                } 
            }
            elem.classList.add("display_hidden");
        }

        if (e.target.classList.contains("title_item_musique")) {
            // console.log("or");
            let elem = e.target;
            for(let item of arrSongs){
                if(item.title === elem.firstChild.textContent){
                    document.querySelector(".play").classList.add("display_none");
                    document.querySelector(".stop").classList.remove("display_none");
                    player.playList = [item];
                    player.numTrack = 0;
                    inputAllList.checked = false;
                    console.log(player.playList);
                    
                    player.reset();
                } 
             }
        }


    });

    listMySongs.addEventListener("click", (e)=>{
        if (e.target.localName === "img") {
            let elem = e.target;
            for(let item of listAllSongs.children){
               if(item.firstChild.textContent === elem.parentElement.previousSibling.textContent){
                //    console.dir(elem.parentElement.parentElement);
                    item.lastChild.firstChild.classList.remove("display_hidden"); 
               } 
               let i = 0;
               for(let item1 of arrMyList){
                    if(item1.title === elem.parentElement.previousSibling.textContent){
                        arrMyList.splice(i,1);
                        if (arrMyList.length === 0) {
                            btnMyList.classList.add("display_hidden");
                        }
                        // console.log(arrMyList);
                    } 
                    i++;
                }
            }
            elem.parentElement.parentElement.remove();
        }
    });

    
    navTrack.addEventListener("click",(e)=>{
        // console.dir(e.target.parentElement);
        if (e.target.parentElement.className === "play") {
            document.querySelector(".stop").classList.toggle("display_none");
            e.target.parentElement.classList.toggle("display_none");
            // if(player.playList.length === 0){
            //     player.playList = [...arrSongs];
            // }
            
            console.log(player.playList);
            player.play() 
        }

        if (e.target.parentElement.className === "stop") {
            // console.dir(e.target.parentElement);
            document.querySelector(".play").classList.toggle("display_none");
            e.target.parentElement.classList.toggle("display_none");
            
            player.stop();
        }

        if (e.target.parentElement.className === "reset") {
            // console.dir(e.target.parentElement);
            document.querySelector(".play").classList.add("display_none");
            document.querySelector(".stop").classList.remove("display_none");

            player.reset();
        }

        if (e.target.parentElement.classList.contains("loop")) {
            e.target.parentElement.classList.toggle("active_nav_track");
           
            player.loop();
        }

        if (e.target.parentElement.className === "next") {
            // console.dir(e.target.parentElement);
            document.querySelector(".play").classList.add("display_none");
            document.querySelector(".stop").classList.remove("display_none");

            player.next();
        }

        if (e.target.parentElement.className === "prev") {
            // console.dir(e.target.parentElement);
            document.querySelector(".play").classList.add("display_none");
            document.querySelector(".stop").classList.remove("display_none");

            player.prev();
        }

        if (e.target.classList.contains("volume_img")) {
            // console.dir(e.target.parentElement);
            document.querySelector(".block_volume").classList.toggle("display_none");
            e.target.classList.toggle("active_nav_track");
        }



    });

    inpVolumeMusique.addEventListener("input", (e)=>{
        player.setVolum(Number(inpVolumeMusique.value)/100);
    });

    btnAllList.addEventListener("click", (e)=>{
        player.playList = arrSongs;
        player.numTrack = 0;
        console.log(player.playList);
                    
        player.reset();
    });

    btnMyList.addEventListener("click", (e)=>{
        if (arrMyList.length > 0) {
            inputMyList.disabled = false;
            player.playList = arrMyList;
            player.numTrack = 0;
            console.log(player.playList);
            player.reset();
        }else {
            inputMyList.disabled = true;
            player.playList = arrSongs;
            inputMyList.checked = false;
            player.stop();
            btnMyList.classList.add("display_hidden");
        }
    });
    

}, 1000);









