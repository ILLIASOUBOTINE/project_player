const demoPlayer = document.querySelector("audio");
let src = document.querySelector("source");
const listAllSongs = document.querySelector("#all_songs");
const listMySongs = document.querySelector("#my_songs");
const navTrack = document.querySelector(".nav_track");
console.dir(listAllSongs);
console.dir(demoPlayer);
console.dir(navTrack);


// window.onload = function(){
//     create(arrSongs);
// } 
// val.onloadeddata = () => {
//     console.log(val.duration)
//   }

// val.loop = true;

let arrUrlSongs = ['5_Nizza-Soldat.mp3','3002-Делить_с_тобой.mp3','basta-mama.mp3'];
let arrTime = [];
let arrSongs =[];

class Song {
    static numSongActive = 0;
    title;
    duration;
    style;
    lang;
    url;
    lastNumActive;
    constructor(title, duration,url) {
        this.title = title;
        this.duration = duration;
        this.url = url;
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
           
            // console.log( Math.round(g.duration));
        };
        i++;
        if (arrUrlSongs.length === i) {
            clearInterval(setInter);
        }
    },10);
}

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

function fooPlay(demoPlayer,arrSongs,numTrack) {
    demoPlayer.src = arrSongs[numTrack].url;
    // demoPlayer.currentTime = 0;
    demoPlayer.play();
}


                   /////////////                   logique                //////////////////////////

getDurationSong(arrUrlSongs);

setTimeout(()=>{
    createSong(arrUrlSongs,arrTime,arrSongs);

    for(let item of arrSongs){
       createItemMusique(listAllSongs, item.title, item.duration);
    }

    
    listAllSongs.addEventListener("click", (e)=>{
        
        if (e.target.localName === "img") {
            let elem = e.target;
            let newItemMusique = elem.parentElement.parentElement.cloneNode(true);
            newItemMusique.lastChild.firstChild.src = "imgs/delete_icon.svg";
            listMySongs.append(newItemMusique);
            elem.classList.add("display_hidden");
        }

        if (e.target.classList.contains("title_item_musique")) {
            // console.log("or");
            let elem = e.target;
            for(let item of arrSongs){
                if(item.title === elem.firstChild.textContent){
                    
                    item.lastNumActive = ++Song.numSongActive;
                    console.log(item.lastNumActive);
                    console.log(Song.numSongActive);
                    demoPlayer.src = item.url;
                    demoPlayer.play();
                } 
             }
        }


    });

    listMySongs.addEventListener("click", (e)=>{
        if (e.target.localName === "img") {
            let elem = e.target;
            for(let item of listAllSongs.children){
               if(item.firstChild.textContent === elem.parentElement.previousSibling.textContent){
                   item.lastChild.firstChild.classList.remove("display_hidden"); 
               } 
            }
            elem.parentElement.parentElement.remove();
        }
    });

    let numTrack = 0;
    let currentTime = 0;
    navTrack.addEventListener("click",(e)=>{
        // console.log(e.target);
        if (e.target.parentElement.className === "play") {
            document.querySelector(".stop").classList.toggle("display_none");
            e.target.parentElement.classList.toggle("display_none");
               
            fooPlay(demoPlayer, arrSongs, numTrack);
            demoPlayer.currentTime = currentTime;
            setInter = setInterval(()=> {
                if (Math.round(demoPlayer.currentTime) >= Math.round(demoPlayer.duration) && arrSongs.length > numTrack ) {
                    numTrack++;
                    fooPlay(demoPlayer, arrSongs, numTrack);
                    
                    
                }else if(arrSongs.length === numTrack){
                    numTrack = 0;
                    fooPlay(demoPlayer, arrSongs, numTrack);
                }
                
            }, 10)
           
            
        }

        if (e.target.parentElement.className === "stop") {
            document.querySelector(".play").classList.toggle("display_none");
            e.target.parentElement.classList.toggle("display_none");
            demoPlayer.pause();
            currentTime = demoPlayer.currentTime;
            clearInterval(setInter);
            
        }

    })
}, 1000);









