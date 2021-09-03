const root = document.getElementById("m");
const b = document.getElementById("b");
function randomNum(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max) + 1;
    return Math.floor(Math.random() * (max - min)) + min;
}
window.g = {
    t: {},
    r: {},
    lvl:1,
    b:1,
    mb:1,
    sRow:4,
    sRp: 4,
    tileCount: 0,
    tileSessionCount:0,
    ani: 500,
    throttle: false,
}
const g = window.g; 
class tile{
    constructor(t){
        if(!t){t={row:0}}
        let obj = {
            type:t.type ? t.type : "?",
            elm: document.createElement("div"),
            innerElm: document.createElement("div"),
            id: window.tileCount,
            row: t.row || t.row === 0 ? t.row : 99, 
            rp: t.rp || t.rp === 0 ? t.rp : 99,
            d: t.done ? t.done: false,
            b: 0, 
            ani: "",
        }
        g.tileCount++;
        g.tileSessionCount++;
        obj.obj = this;
        obj.elm.appendChild(obj.innerElm);
       // obj.elm.onmousedown = ()=>{this.seeAdjacent(obj)}
        obj.elm.onclick = ()=>{this.action(obj)}
        !g.r[obj.row] ? g.r[obj.row] = {[obj.rp]:obj} : g.r[obj.row][obj.rp] = obj;
        g.t[Object.keys(g.t).length] = obj;
        return obj; 
    }
    gainType = (obj, type)=>{
        obj.type=type;
//        console.log(obj)
    }
    action = (obj)=>{
        let post = true; 
        if(obj.type === "b"){
            obj.obj.ani(obj, "b");
            this.revealTile(obj);
            g.end();
            post=false; 
        }
        else if(obj.type === "?") {
            this.cascade(obj);
        }
        if(post){
            this.postAction();
        }
     
    }
    postAction = ()=>{
        g.up();
    }
    revealTile = (obj) =>{
        obj.elm.setAttribute("r", "true");
        g.tilesLeft--;
    }
    cascade = (obj) => {
        let prox = this.adjacent(obj);
        this.revealTile(obj);
        let no = 0; 
        for(let i = 0; i < Object.keys(prox).length; i++){
            let p = prox[i];
            if(p.type === "b"){
                no++;
            }
        }
        if(no > 0){
            obj.innerElm.innerHTML = no;
        }
        else {
            this.dead(obj);
            for(let i = 0; i < Object.keys(prox).length; i++){
                if(!prox[i].elm.getAttribute("r")){
                    this.cascade(prox[i]);
                }   
            }
        }
    }
    dead = (obj) => {
        this.ani(obj, "dead");
        obj.d = true; 
    }
    seeAdjacent = (obj) => {
        let prox = this.adjacent(obj);

        for(let i = 0; i < Object.keys(prox).length; i++){
            let p = prox[i];
            if(!p.d){
                if(p.type==="b"){
                    p.obj.ani(p, "b");
                }
                else {
                    p.obj.ani(p, "adjacent");
                }
               
            }
        }
    }
    adjacent = (obj)=>{
        let rp = obj.rp;
        let row = obj.row; 
        let a = {};
        let pushA = (aobj)=>{
            if(!aobj.d){
                a[Object.keys(a).length] = aobj; 
            }
        }
        if(row - 1 >= 0){
            if(rp - 1 >= 0){ pushA(g.r[row-1][rp - 1]);}
            pushA(g.r[row-1][rp]);
            if(rp + 1 < g.tr){ pushA(g.r[row-1][rp + 1]);}
        }
        if(rp - 1 >= 0){pushA(g.r[row][rp - 1]);}
        if(rp + 1 < g.tr){pushA(g.r[row][rp + 1]);}

        if(row + 1 < g.rows){
            if(rp - 1 >= 0){ pushA(g.r[row+1][rp - 1]);}
            pushA(g.r[row+1][rp]);
            if(rp + 1 < g.tr){ pushA(g.r[row+1][rp + 1]);}
        }

        return a; 
    }
    ani = (obj, animation)=>{
        if(obj.d){return}
        if(obj.ani !== ""){
            obj.ani = "";
            obj.elm.className = "";
        }
        window.requestAnimationFrame(()=>{
            obj.ani = animation;
            obj.elm.className = animation;
            setTimeout(()=>{
                if(!obj.d && obj.elm.className === animation){
                    obj.ani = "";
                    obj.elm.className = "";
                }
            },g.ani)
        });

    }
}
function boot(){
    g.newGame = newGame;
    g.up = updateOverlay; 
    g.end = end;
    newGame();

}
function updateOverlay(){
    b.innerHTML = g.b + " / "+ g.tilesLeft;
    if(g.b === g.tilesLeft || g.tilesLeft === 0){
        g.end(true);
    }
}
function end(win){

    let clone = root.cloneNode(true);
    clone.id="mC";
    clone.className = "z0";
    root.parentNode.appendChild(clone);

    if(win){
        g.lvl++;     
        setTimeout(()=>{
            reset();
            clone.className = "";
            document.getElementById("m2").className = "tron";
            for(let i = 0; i < clone.getElementsByTagName("div").length; i++){
                let div = clone.getElementsByTagName("div")[i];
                if(div.parentNode && div.parentNode.className === "row"){
                    div.style.backgroundColor = "var(--g)"
                    div.style.top = randomNum(-500, 500) + "px";
                    div.style.left = randomNum(-500, 500) + "px";
                    div.style.transform = "rotate3d(1, 1, 1, "+randomNum(-360, 360) +"deg)";
                }
            }
            setTimeout(()=>{
                newGame({});
                setTimeout(()=>{
                    document.getElementById("m2").className = "";
                    clone.parentNode.removeChild(clone);
                },1)
                
               
            }, 750);
        },1)
        console.log("win");
    }
    else {
        setTimeout(()=>{
            reset();
            clone.className = "";
            document.body.style.backgroundColor = "var(--r)";
            for(let i = 0; i < clone.getElementsByTagName("div").length; i++){
                let div = clone.getElementsByTagName("div")[i];
                if(div.parentNode && div.parentNode.className === "row"){
                    div.style.left = randomNum(-100, 100) + "px";
                    div.style.top = randomNum(100, 400) + "px";
                    div.style.transform = "rotate3d(1, 1, 1, "+randomNum(-360, 360) +"deg)";
                    div.style.backgroundColor = "var(--r)";
                }
            }
            setTimeout(()=>{
                g.lvl = 0;
                newGame({});
                setTimeout(()=>{
                    clone.parentNode.removeChild(clone);
                },1)
                
               
            }, 750);
        },1)
        
    }
}
function reset(){
    document.body.style.backgroundColor = "var(--b)";
    root.innerHTML="";
    b.innerHTML = "";
    g.tileSessionCount = 0; 
    g.tileSessionCount = 0;
    g.t = {};
    g.r = {};
}
function newGame(lvl){
    if(!lvl){lvl={}}
    reset();
    const rows =  lvl.rows ? lvl.rows: g.sRow + g.lvl;
    const tr =  lvl.tr ? lvl.tr : g.sRp + g.lvl;
    g.mb = lvl.b ? lvl.b : g.mb + g.lvl;
    g.tr = tr; 
    g.rows = rows; 

    for(let i = 0; i < rows; i++){
        let row = document.createElement("div");
        row.className = "row";
        for(let q = 0; q < tr; q++){
                let obj = {
                    row:i,
                    rp: q,
                }
                let t = new tile(obj); 
                row.appendChild(t.elm);
         }
            root.appendChild(row);
    }
    nB = 0; 
    for(let i = 0; i < g.mb; i++){
        let ran = randomNum(0, Object.keys(g.t).length - 1);
        let t = g.t[ran];
        if(t.type === "b"){nB--}
        else {
            t.obj.gainType(t, "b");
        }
        
    }
    b.innerHTML = g.mb + " / "+ g.tileSessionCount
    g.tilesLeft = g.tileSessionCount;
    g.b = g.mb - nB;

    g.up();
}