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


console.dir(listAllSongs);
console.dir(demoPlayer);
console.dir(navTrack);

let arrUrlSongs = ['5_Nizza-Soldat.mp3','3002-Делить_с_тобой.mp3','basta-mama.mp3','Ricky Rich, Gims-Say Oui.mp3',
 'Градусы - О тебе думаю.mp3', 'Ritt Momney, Shane T - Sometime.mp3', 'Dabro - Юность.mp3', 'Artik - Asti - Истеричка.mp3',
'Lina Maly - Schmerz Vereint.mp3', 'Revelle - Feuer Im Kamin.mp3', 'Koffee - West Indies.mp3', 'Gims, Vitaa - Prends Ma Main.mp3',
'Eugénie - Silence.mp3', 'Nothing, Nowhere - Pieces Of You.mp3', 'Debe - Nice Guy.mp3', 'Upsahl - Thriving.mp3', '24kgoldn, Lil Tecca - Prada.mp3',
'Rachel Mae Hannon - Tell Me.mp3', 'Elaine Mai, Loah - Waiting To Breathe.mp3', 'Matt Maltese - We Need To Talk.mp3'];
let arrTime = [];
let arrSongs = [];
let arrMyList = [];
let setInervalChangeFond;
let setInter1;
// let countX = -25;

class Song {
    title;
    author;
    duration;
    style;
    lang;
    url;
    
    constructor(title, author,url) {
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
    oldPlayList = [];

    constructor(myDemoPlayer, playList) {
      this.myDemoPlayer = myDemoPlayer;
      this.playList = playList;
      this.myDemoPlayer.volume = this.volume;
    }

    play(){
        // changeFond();
        
        fooPlay(this.myDemoPlayer, this.playList, this.numTrack, this.historyList);
        this.myDemoPlayer.currentTime = this.currentTime;
        this.myDemoPlayer.play();
        this.active = true;
       
        setInter1 = setInterval(()=> {
            if (this.myDemoPlayer.ended && this.playList.length > this.numTrack  ) {
                this.numTrack++;
                if(this.playList.length > this.numTrack) {
                   fooPlay(this.myDemoPlayer, this.playList, this.numTrack, this.historyList);
                   this.myDemoPlayer.play(); 
                }else {
                    // clearInterval(setInter1);
                    // clearInterval(setInervalChangeFond);
                    this.stop();
                    this.currentTime = 0;
                    this.numTrack = 0;
                    // this.reset();
                    document.querySelector(".play").classList.remove("display_none");
                    document.querySelector(".stop").classList.add("display_none");
                }
            }    
        }, 10)
    }

    stop(){
        this.myDemoPlayer.pause();
        this.currentTime = this.myDemoPlayer.currentTime;
        clearInterval(setInter1);
        clearInterval(setInervalChangeFond);
        this.active = false;
    }

    reset(){
        if (this.active) {
            // this.stop();
            this.currentTime = 0;
            clearInterval(setInervalChangeFond);
            this.play();
        }else {
            this.myDemoPlayer.volume = 0;
            clearInterval(setInervalChangeFond);
            this.play();

            setTimeout(()=>{
                this.stop(); 
                this.currentTime = 0.001; 
                this.myDemoPlayer.currentTime = this.currentTime;
                this.myDemoPlayer.volume = this.volume;
            },100)
            
           
            // document.querySelector(".title_song").textContent = this.playList[this.numTrack].title;
        }
        
        
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

    random(){
        this.randomSong = !this.randomSong;
        if (this.randomSong) {
            this.oldPlayList = [...this.playList];
           this.playList = createRadomListSong(this.playList);
            player.numTrack = 0;
            this.reset(); 
        }else {
            player.numTrack = 0;
            this.playList = this.oldPlayList;
            this.reset();
        }
        
    }



}

function createSong(arr,arrSongs) {
    let i = 0;
    for(let song of arr){
        let propsSong =  song.split(/[-.]/);
        let url = `chansons/${song}`;
        let newSong = new Song(propsSong[1], propsSong[0], url);
        arrSongs.push(newSong);
        // console.log(newSong); 
        i++;
    }
   
}

// function getDurationSong(arrUrlSongs) {
//     let i = 0;
//     const setInter = setInterval(()=> {
//         let g = document.createElement("audio");
//         g.src = `chansons/${arrUrlSongs[i]}`;
//         g.onloadeddata = ()=>{
//         arrTime.push(Math.floor(g.duration));
//         };
//         i++;
//         if (arrUrlSongs.length === i) {
//             clearInterval(setInter);
//         }
//     },10);
// }

function createItemMusique(parent, title, author) {
    let div =  document.createElement("div");
    div.className = "item_musique style_item_list dropdown-item";
    // div.classList.add("item_musique").add("style_item_list").add("dropdown-item");

    let p_title =  document.createElement("p");
    p_title.classList.add("title_item_musique");
    p_title.textContent = title;
    div.append(p_title);

    let p_props =  document.createElement("p");
    p_props.classList.add("props_item_musique");
    // p_props.innerHTML = `<img src="imgs/add_icon.svg" alt=""><span>musique pop</span><span>en</span><span>${(time-time%60)/60}:${time%60}</span>`;
    p_props.innerHTML = `<img src="imgs/add_icon.svg" alt=""><span>${author}</span>`;
    div.append(p_props);
    
    parent.append(div); 
}

function fooPlay(demoPlayer,arrSongs,numTrack,historyList) {
    demoPlayer.src = arrSongs[numTrack].url;
    historyList.push(arrSongs[numTrack]);
    console.log(historyList);
    document.querySelector(".title_song").textContent = arrSongs[numTrack].title;
    // document.querySelector(".title_song").textContent = historyList[historyList.length -1].title;
    
    // demoPlayer.play();
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


const trackTime = document.querySelector(".track_time");
const trackLine = document.querySelector(".track_line");
const trackCircle = document.querySelector(".track_circle");
const trackLineRed = document.querySelector(".track_line_red");



let x1;
let x2;
let y2;
let countX = 0;
let trackCircleActive = false;

let setIntervalTrackLine;

function trackLineAnimation(){
    setIntervalTrackLine = setInterval(() => {
        if (player.myDemoPlayer.currentTime !== 0 ) {
            trackTime.textContent = fooConverTime(Math.round(player.myDemoPlayer.duration - player.myDemoPlayer.currentTime));
            let coordX = trackLine.clientWidth*Math.round(player.myDemoPlayer.currentTime)/Math.round(player.myDemoPlayer.duration);
            trackCircle.style.left = `${coordX }px`;
            trackLineRed.style.width = `${coordX }px`;
        }else {
            trackTime.textContent = '0:00' ;
            trackCircle.style.left = `0px`;
            trackLineRed.style.width = `0px`;
        }
    },10); 

}


function createRadomListSong(arrSongs){
    let newArr = [];
    let maxNum = arrSongs.length;
    let i = 0;
    
    while (i < maxNum) {
       
        let indexRandom = Math.floor(Math.random()*maxNum);
        let elemExist = newArr.filter((elem)=>{
            return elem.title === arrSongs[indexRandom].title;
        });
        if (elemExist.length > 0) {
            // console.log(elemExist);
            
        }else {
            newArr.push(arrSongs[indexRandom]);
            // console.log(arrSongs[indexRandom]);
            i++;  
        }
        
    }

    return newArr;
    
}





// function RadomtSong(arrSongs, prevSong) {
   
//    let maxNum = arrSongs.length;
//    let i = 0;
//    while (i < 1) {

//        let num =Math.floor(Math.random()*maxNum);
       
//         if (arrSongs[num].title !== prevSong.title) {
//             return arrSongs[num];
//         }else {
//             i = 0;
//         }
       
//    }

   
   
// }


                   /////////////                   logique                //////////////////////////

// getDurationSong(arrUrlSongs);

// setTimeout(()=>{
    createSong(arrUrlSongs,arrSongs);

    console.log(createRadomListSong(arrSongs));
    

    for(let item of arrSongs){
       createItemMusique(listAllSongs, item.title, item.author);
    }


    const player = new MyPlayer(demoPlayer, arrSongs);
    
    trackLineAnimation();
        
    
    
    
    ///////////// trackTime ///////////////

   
    
   
    
    // trackCircle.addEventListener("dragstart", (e) => {
    //     // console.log(x1 = e.pageX);
    //     x1 = e.pageX;
    //     y1 = e.pageY;
    //     // console.log(e.pageY);
    // });
   

///////////////  for follow object /////////////

// trackCircle.addEventListener('mousedown', (e) => {
//         x1 = e.pageX +25 ;
        
//         trackCircleActive = true;

       
//         console.log(x1);
//    });

// trackLine.addEventListener('mousemove', (e) => {
// //    setIntervalTrackLine = setInterval(() => {
        
        
//          let delX = e.pageX - x1 ; 
//         console.log( trackCircleActive);
//         if (trackCircleActive && countX >=0 && countX <= trackLine.clientWidth) {
           
//             trackCircle.style.left = `${countX + delX }px`;
//         }
        
            
//             // console.log(e.pageY);
       
//     // }, 100);
//  });

 

// trackCircle.addEventListener('mouseup', (e) => {
//         // x2 = e.clientX;
//         trackCircleActive = false;
//         console.log(trackCircle.offsetLeft);
//         countX = trackCircle.offsetLeft + 25;

//          console.log(x1);
//         // x1 = 0;
       
//        // console.log(e.pageY);
// });

// trackCircle.addEventListener('mousedown', (e) => {
//     x1 = e.pageX +25 ;
    
//     trackCircleActive = true;

   
//     console.log(x1);
// });

// trackLine.addEventListener('mousemove', (e) => {
// //    setIntervalTrackLine = setInterval(() => {
    
    
//      let delX = e.pageX - x1 ; 
//     console.log( trackCircleActive);
//     if (trackCircleActive && countX >=0 && countX <= trackLine.clientWidth) {
       
//         trackCircle.style.left = `${countX + delX }px`;
//     }
    
        
//         // console.log(e.pageY);
   
// // }, 100);
// });



// trackCircle.addEventListener('mouseup', (e) => {
//     // x2 = e.clientX;
//     trackCircleActive = false;
//     console.log(trackCircle.offsetLeft);
//     countX = trackCircle.offsetLeft + 25;

//      console.log(x1);
//     // x1 = 0;
   
//    // console.log(e.pageY);
// });

trackCircle.addEventListener('mousedown', (e) => {
    clearInterval(setIntervalTrackLine);
    x1 = trackCircle.getBoundingClientRect().x + trackCircle.clientWidth/2;
    trackCircleActive = true;
    console.log(trackCircleActive);
    countX = trackLine.clientWidth*Math.round(player.myDemoPlayer.currentTime)/Math.round(player.myDemoPlayer.duration);
});



trackCircle.addEventListener('mousemove', (e) => {
   
    if (trackCircleActive) {
         x2 = e.pageX;
         y2 = e.pageY;
        if (x2 <= trackLine.getBoundingClientRect().x) {
            trackCircle.style.left = `${(0)}px`;
        }else if(x2 >= trackLine.getBoundingClientRect().x + trackLine.getBoundingClientRect().width){
            trackCircle.style.left = `${(trackLine.getBoundingClientRect().width - trackCircle.clientWidth)}px`;
        }else {
            trackCircle.style.left = `${(countX + x2 - x1)}px`;
            // console.log(x2);
        }
        console.log(trackCircleActive); 
      
    }

    
});




//let  fooStopSetinterval;
// function foostop(x2,y2) {
//     fooStopSetinterval = setInterval(()=>{
//         if (trackCircleActive && x2 > trackCircle.getBoundingClientRect().x 
//         &&  x2 < trackCircle.getBoundingClientRect().x + trackCircle.getBoundingClientRect().width 
//         && y2 > trackCircle.getBoundingClientRect().y 
//         && y2 < trackCircle.getBoundingClientRect().y + trackCircle.getBoundingClientRect().height ) {
//             console.log("ok");
//             console.log(x2);
//             console.log(y2);
//         }else {
//             trackCircleActive = false;
//             countX = trackCircle.offsetLeft;
           
//             player.myDemoPlayer.currentTime = countX*Math.round(player.myDemoPlayer.duration)/trackLine.clientWidth;
//             player.currentTime = player.myDemoPlayer.currentTime;
//             trackLineAnimation(); 
//             clearInterval(fooStopSetinterval); 
//              console.log(trackCircleActive);
//         }
//     },100);
// }


trackCircle.addEventListener('mouseup', (e) => {

    trackCircleActive = false;
    
    countX = trackCircle.offsetLeft  ;
    // console.log(x1);
    console.log(trackCircleActive);
    player.myDemoPlayer.currentTime = countX*Math.round(player.myDemoPlayer.duration)/trackLine.clientWidth;
    player.currentTime = player.myDemoPlayer.currentTime;
    // console.log(player.myDemoPlayer.currentTime);
    trackLineAnimation();
})


main.addEventListener('mouseup', (e) => {

    trackCircleActive = false;
    console.log(trackCircleActive + "не тот");
})


 

    // trackCircle.addEventListener("dragend", (e) => {

    //     x2 = e.pageX ;
    //     // console.log(e.pageY);
    //   let countX = coordX + x2 - x1;
    // //    player.stop();
    //     player.currentTime = countX*Math.round(player.myDemoPlayer.duration)/trackLine.clientWidth;
    //    player.myDemoPlayer.currentTime = player.currentTime;
    //     // player.play();
    //     // trackCircle.style.left = `${countX}px`;
    //     // trackLineRed.style.width = `${countX}px`;

    // });

    

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
                        listMySongs.previousElementSibling.classList.remove("display_none");

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
                    inputMyList.checked = false;
                    console.log(player.playList);

                    player.randomSong = false;
                    player.currentTime = 0;
                    clearInterval(setInervalChangeFond);
                    player.play();
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
                            listMySongs.previousElementSibling.classList.add("display_none");
                            player.playList = arrSongs;
                            inputAllList.checked = true;
                            player.numTrack = 0;
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
        console.dir(e.target);
        if (e.target.parentElement.className === "play") {
            document.querySelector(".stop").classList.toggle("display_none");
            e.target.parentElement.classList.toggle("display_none");
            // if(player.playList.length === 0){
            //     player.playList = [...arrSongs];
            // }
            
            console.log(player.playList);
            clearInterval(setInervalChangeFond);
            player.play() 
        }

        if (e.target.parentElement.className === "stop") {
            // console.dir(e.target.parentElement);
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
            // console.dir(e.target.parentElement);
            document.querySelector(".block_volume").classList.toggle("display_none");
            e.target.classList.toggle("active_nav_track");
        }

        if (e.target.parentElement.classList.contains("random")) {
            console.dir(e.target);
            e.target.parentElement.classList.toggle("active_nav_track");

            player.random();
        }



    });

    inpVolumeMusique.addEventListener("input", (e)=>{
        player.setVolum(Number(inpVolumeMusique.value)/100);
    });

    btnAllList.addEventListener("click", (e)=>{
        if (player.randomSong) {
            // player.playList;
            for(let song of listAllSongs.children){
                for (let i = 0; i < player.playList.length; i++) {
                    if (song.firstChild.textContent === player.playList[i].title ) {
                        console.log(song);
                        song.style.order = `${i}`;
                    }
                    
                }
            }
            
        }else {
            for(let song of listAllSongs.children){
                song.style.order = `1`;
            }

            player.playList = arrSongs;
            player.numTrack = 0;
            console.log(player.playList);
           
            player.reset();
        }
        
        
    });

    btnMyList.addEventListener("click", (e)=>{
        
            inputMyList.disabled = false;
            player.playList = arrMyList;
            player.numTrack = 0;
            console.log(player.playList);
         
            player.reset();
       
          
        
           
    });
    

   
// }, 1000);


let arrColor = ['rgb(151, 71, 255)', 'rgb(161, 64, 32)', 'rgb(161, 109, 32)',
'rgb(161, 152, 32)', 'rgb(135, 161, 32)', 'rgb(75, 161, 32)', 'rgb(32, 161, 64)',
'rgb(32, 161, 129)', 'rgb(32, 101, 161)', 'rgb(32, 45, 161)', 'rgb(7, 4, 16)'];

function changeFond() {
    let cout = 0;
    setInervalChangeFond = setInterval(()=>{
        containerElem.style.backgroundColor = arrColor[cout];
        // console.log(arrColor[cout]);
        cout++;
        if (cout === arrColor.length) {
            cout = 0;
        }
    },1000)
}
    

// inpSearchAllSong.addEventListener("input", (e)=>{
//     let str = e.target.value;
//     console.log(str);
//     let resultArr = arrSongs.filter((song)=>{
//       return  song.title.toLowerCase().match(str.toLowerCase());
//     })
//     console.log(resultArr);
// })
          //     Search  All lIst      ////////
inpSearchAllSong.addEventListener("input", (e)=>{
    let str = e.target.value;
    console.log(str);
    for(let song of listAllSongs.children){
        if (song.firstChild.textContent.toLowerCase().match(str.toLowerCase())
        || song.lastChild.lastChild.textContent.toLowerCase().match(str.toLowerCase()) ) {
                
        } else {
             song.classList.add("display_none");
        } 
    }
    
    if (str === '') {
        for(let song of listAllSongs.children){
           song.classList.remove("display_none");
            
        }
    }
})


inpSearchMySong.addEventListener("input", (e)=>{
    let str = e.target.value;
    console.log(str);
    for(let song of listMySongs.children){
        if (song.firstChild.textContent.toLowerCase().match(str.toLowerCase())
        || song.lastChild.lastChild.textContent.toLowerCase().match(str.toLowerCase())) {
                
        } else {
             song.classList.add("display_none");
        } 
    }
    
    if (str === '') {
        for(let song of listMySongs.children){
           song.classList.remove("display_none");
            
        }
    }
})


