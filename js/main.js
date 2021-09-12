const root = document.getElementById("m");
const b = document.getElementById("b");
const s = document.getElementById("s");
const h = document.getElementById("help");
const X = "👾";
const SS = "🚀";
const PL = "🪐";
function randomNum(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max) + 1;
    return Math.floor(Math.random() * (max - min)) + min;
}
window.g = {
    t: {},
    r: {},
    lvl:{lvl:1},
    shA: 1,
    blA:1,
    scA:1,
    q: 2,
    b:1,
    mb:1,
    bb:2,
    st:120,
    sRow:4,
    sRp: 4,
    s:1,
    tileCount: 0,
    tileSessionCount:0,
    ani: 550,
    tool: "de",
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
        obj.elm.onmousedown = (e)=>{
           if(e.buttons === 2 || g.tool === "sc"){return;}
            obj.elm.classList.add("p"); setTimeout(()=>{obj.elm.classList.remove("p")},g.ani)}
        obj.elm.onmouseup = ()=>{obj.elm.classList.remove("p")}
        obj.elm.onclick = ()=>{this.action(obj)}
        !g.r[obj.row] ? g.r[obj.row] = {[obj.rp]:obj} : g.r[obj.row][obj.rp] = obj;
        g.t[Object.keys(g.t).length] = obj;
        if(randomNum(0,10) > 5){obj.elm.setAttribute("m",1)}
        if(randomNum(0,10) > 5){obj.elm.setAttribute("n",2)}
        if(randomNum(0,10) > 5){obj.elm.setAttribute("o",3)}
        return obj; 
    }
    gainType = (obj, type)=>{
        if(type !== "q"){obj.type=type}
        else{
            let r = randomNum(0,2);
            let p = "sc";
            if(r === 1){p = "sh"}
            if(r === 2){p = "bl"}
            obj.q = p;
        }

    }
    destroy = (obj)=>{
        obj.dd = true;
        this.dead(obj, "d");
    }
    action = (obj)=>{
        let post = true;
        if(g.block){return false}
        
        if(g.tool === "bl" && g.blA > 0 && !obj.dd){
            this.destroy(obj);
            g.ga("bl", -1);
        }
        else if(g.tool ==="sc" && g.scA > 0){
            this.seeAdjacent(obj);
            g.ga("sc", -1);
        }
        else if(g.tool ==="de" && !obj.d || g.tool ==="de" && obj.q){
            
            if(obj.q && !obj.val && obj.elm.getAttribute("r")){
                g.ga(obj.q, 1);
                obj.q = false;
                obj.elm.removeAttribute("q");
            }
            obj.elm.setAttribute("c","true");
            if(obj.type === "b"){
                obj.innerElm.innerHTML = X;
                obj.obj.ani(obj, "b");
                this.revealTile(obj);
                if(g.dmg(-1)){}
                post=false; 
            }
            else if(obj.type === "?") {
                this.cascade(obj);
            }
        }
        else{
            {g.anim(g[g.tool],"g-");}
        }


        if(post){
            this.postAction(obj);
        }
     
    }
    postAction = (obj)=>{
        setTimeout(()=>{g.up();
        if(g.b > 0 && g.blA < 1){warp()}
        },g.ani);
        this.cascade(obj,false);
        
    }
    revealTile = (obj) =>{
        obj.elm.setAttribute("r", "true");
        let anim = "reveal";
        obj.innerElm.classList.add(anim)
        setTimeout(()=>{obj.innerElm.classList.remove(anim)},g.ani);
        g.tilesLeft--;
    }
    cascade = (obj, lim, l) => {
        let prox = this.adjacent(obj);
        this.revealTile(obj);
        let no = 0;
        obj.val = 0;
        if(!obj.b && !obj.dd){obj.innerElm.innerHTML = "";}
        for(let i = 0; i < Object.keys(prox).length; i++){
            let p = prox[i];
            if(p.type === "b" && !p.dd){
                no++;
            }
        }
        if(no > 0 && !obj.d){
            obj.innerElm.innerHTML = no;
            obj.val = no; 
        }
        else if(obj.type === "b" && !obj.dd){return}
        else if(obj.q){
            obj.elm.setAttribute("q", obj.q);
        }
        else {
            if(!lim){
                this.dead(obj);
                for(let i = 0; i < Object.keys(prox).length; i++){
                    if(!prox[i].elm.getAttribute("r") && !obj.dd || prox[i].elm.getAttribute("r") && obj.rev || obj.dd === true && g.b > 0 && prox[i].val > 0 && prox[i].elm.getAttribute("r")){
                        prox[i].rev = false;
                        let d = obj.dd;
                        this.cascade(prox[i], d,d);
                    }   
                }
            }
            if(l){this.dead(obj);}
        }
        if(lim && !l){
            obj.innerElm.innerHTML = "";
            if(no > 0 && obj.type !== "b"){obj.innerElm.innerHTML = no;obj.val = no;}
            else if (obj.type === "b" && !obj.dd){obj.innerElm.innerHTML = X;}            
            this.ani(obj, "rev");
            obj.rev = true;
        }
    }
    dead = (obj, source) => {
        if(!source){source = ""}
        if(source === "d"){
            let clone = {elm: obj.elm.cloneNode(true)};
            obj.elm.appendChild(clone.elm);
            this.ani(clone, "deadB", true);
            obj.innerElm.innerHTML = "";
            obj.q = 0;
        }
        this.ani(obj, "dead " + source);
        obj.d = true;


    }
    seeAdjacent = (obj) => {
        let prox = this.adjacent(obj);
        this.cascade(obj, true);
        for(let i = 0; i < Object.keys(prox).length; i++){
            let p = prox[i];
                this.cascade(p, true);
        }
        
    }
    adjacent = (obj)=>{
        let rp = obj.rp;
        let row = obj.row; 
        let a = {};
        let pushA = (aobj)=>{
            a[Object.keys(a).length] = aobj; 
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
    ani = (obj, animation, kill)=>{
        if(obj.d && animation !== "rev" && obj.d && animation !== "dead d"){return}
        if(obj.ani !== ""){
            obj.ani = "";
            obj.elm.className = "";
        }
        window.requestAnimationFrame(()=>{
            if(animation === "rev"){animation = animation + " " + obj.ani}
            obj.ani = animation;
            obj.elm.className = animation;
            if(animation === "deadB"){
                window.requestAnimationFrame(()=>{
                    let style = obj.elm.style; 
                    style.opacity = 0.1; 
                    style.transform = "scale(0.1)";
                });
            }
            
            setTimeout(()=>{
                if(!obj.d && obj.elm.className === animation){
                    obj.elm.className = "";
                }
                if(obj.d && obj.elm.classList.contains("rev") ||obj.dd){obj.elm.className = "dead " + (obj.dd ? "d" : "");}
                if(kill){if(obj.elm.parentNode){obj.elm.parentNode.removeChild(obj.elm)}}
            },g.ani)
        });

    }
}
g.boot = ()=>{
    ui();
    g.newGame = newGame;
    g.up = updateOverlay; 
    g.end = end;
    setTimeout(()=>{newGame();},g.ani);
    document.body.oncontextmenu = (e)=>{e.preventDefault(); g.tswp()}

    setTimeout(()=>{if(document.monetization && document.monetization.state) { 
        console.log("coil active get free scan");
        g.ga("sc", 1);
     }},g.ani);
    
}
function ui(){
    let newElm = (id)=>{let a = document.createElement("div"); a.id = id ? id : ""; return a;}
    g.aid = newElm("aid");
    s.appendChild(g.aid);
    g.aid.onclick=()=>{h.classList.contains("ninja") ? h.className = "":h.className = "ninja";}
    g.aid.innerHTML = "Help";

    g.wa = newElm("wa");
    g.wa.appendChild(newElm("wa2"));
    g.waN = newElm("waN");
    g.waN.innerHTML = "Preparing warp drive";
    g.wa.appendChild(g.waN);
    s.appendChild(g.wa);
    g.sh = newElm("sh");
    g.sh.appendChild(newElm("sh2"));
    g.shN = newElm("shN");
    g.sh.appendChild(g.shN);
    s.appendChild(g.sh);

    g.mi = newElm("mi");
    g.ss = newElm("ss");
    g.ss.innerHTML = SS;
    g.pl = newElm("pl");
    g.pl.innerHTML = PL; 
    g.mi.appendChild(g.ss);
    g.mi.appendChild(newElm("mp"))
    g.mi.appendChild(g.pl);
    s.appendChild(g.mi);

    g.de = newElm("de");
    g.de.className = "s";
    g.de.innerHTML = "<div>∞</div>";
    g.de.onclick=()=>{g.tswp("de")}
    b.appendChild(g.de);

    g.bl = newElm("bl");
    g.blN = newElm("blN");
    g.bl.appendChild(g.blN);
    g.bl.onclick=()=>{g.tswp("bl")}
    b.appendChild(g.bl);

    g.sc = newElm("sc");
    g.scN = newElm("scN");
    g.sc.appendChild(g.scN);
    g.sc.onclick=()=>{g.tswp("sc")}
    b.appendChild(g.sc);

    g.al = newElm("al");
    s.appendChild(g.al);


    g.dmg = (dmg)=>{

        if(dmg < 0){
            g.sh.style.backgroundColor = "var(--d)";
            g.waN.innerHTML = "Shield down";
            g.anim(document.body, "hit");
            setTimeout(()=>{
                g.sh.style.backgroundColor = "var(--m)";
            }, g.ani)
        }

        if(dmg < 0 && Math.abs(dmg) > g.shA){
            g.shA--;
            end(); 
            return false
        }
        else {g.shA = g.shA + dmg}
  
        if(g.shA > 3){g.shA = 3}
        updateOverlay();
        return true; 
    }
    g.tswp = (t)=>{
        g.sc.className = "";
        g.de.className = "";
        g.bl.className = "";
        if(!t){
            if(g.tool==="de"){t = "bl";}
            else if(g.tool==="bl"){t = "sc";}
            else{t = "de";;}
        }
        g[t].className = "s";
        g.tool = t;
    }
    g.anim = (elm, ani)=>{
        elm.classList.add(ani);
        setTimeout(()=>{elm.classList.remove(ani);},g.ani);
    }
    g.ga = (t,a)=>{
        g.anim(g[t], a < 0 ? "g-" : "gg");
        g[t + "N"].innerHTML = (a > 0 ? " +" : " ") + a;
        g[t + "A"] += a;
        if(g.scA > 3){g.scA = 3}
    }
    
    let help = (text)=>{return "<br>"+text+ ".<br>"}
    h.innerHTML = SS + " needs to reach " + PL + " to win.<br>"; 
    h.innerHTML += help("Use ⛏ to reveal meteoroids and collect loot, don't click " + X + " or you lose shield");
    h.innerHTML += help("Use ⚔ to destroy hostile " + X + " use wisely as you barely have enough each round");
    h.innerHTML += help("Use ◍ to reveal a meteor and all adjacent meteoroids");
    h.innerHTML += help("A number on a revealed meteor indicates how many adjacent "+ X + " it has");
    h.innerHTML += help("Warping will make you lose shields equal to the number of " + X + " left");
    h.innerHTML += help("<br> PC Tips: Right click to cycle tools and use browser-zoom to adjust optimal size");
}
function updateOverlay(){

    g.sh.className="sh" + g.shA;
    g.scN.innerHTML = g.scA;
    g.blN.innerHTML = g.blA;
    g.shN.innerHTML = "";
    if(g.tool != "de" && g[g.tool + "A"] <= 0){
        g.tswp("de");
    }
    let alien = 0; 
    for(let i = 0; i < Object.keys(g.t).length; i++){
        let metor = g.t[i]; 
        if(metor.type ==="b" && !metor.dd){
            alien++;
        }
    }
    g.b=alien; 
    g.al.innerHTML = g.b + " " + X; 
    if(g.b < 1){
        g.al.innerHTML = "";
        warp();
    }
}

function end(win){
    g.block = true;
    if(g.ex){return}
    g.ex = true;
    clearInterval(g.loop);
    setTimeout(()=>{endAni()},g.ani);

    let endAni = ()=>{
        let clone = root.cloneNode(true);
        clone.id="mC";
        clone.className = "z0";
        root.parentNode.appendChild(clone);
    
        if(win){
            g.lvl.lvl++;     
            setTimeout(()=>{
                
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
                clone.className = "";
                setTimeout(()=>{
                    if(g.lvl.lvl < 6){
                        newGame(g.lvl);
                        
                    }
                    else {
                        reset();
                        h.innerHTML = "YOU WIN!<br><br>";
                        let points = (g.scA * 10) + (g.blA * 5) + (g.shA * 20);
                        h.classList = "win";

                        let highscore = localStorage.getItem("score");
                        if(highscore){
                            if(highscore < points){
                                h.innerHTML += "<br> NEW HIGHSCORE - " + points;
                                localStorage.setItem('score', points);
                            }
                            else {
                                h.innerHTML += "<br>Score: " + points;
                            }
                        }
                        else {
                            h.innerHTML += "<br>Score: " + points; 
                            localStorage.setItem('score', points);
                        }
                        h.innerHTML += "<br>Highscore " + (highscore ? highscore : "none");
                        
                        h.innerHTML += "<br><p id='again'>Play again?</p>";
                        document.getElementById("again").onclick=()=>{location.reload()}
                        g.ss.style.transform += " scale(0.1)  rotate(160deg)";
                    }
                   
                    setTimeout(()=>{
                        document.getElementById("m2").className = "";
                        clone.parentNode.removeChild(clone);
                    },g.ani)
                    
                   
                }, g.ani);
            },1)
        }
        else {
            g.waN.innerHTML = "Ship exploded";
            g.ss.style.transform = "translate(0px, 50px) rotate3d(1, 1, 1, 240deg)";
            setTimeout(()=>{
                root.innerHTML="";
                for(let i = 0; i < clone.getElementsByTagName("div").length; i++){
                    let div = clone.getElementsByTagName("div")[i];
                    if(div.parentNode && div.parentNode.className === "row"){
                        div.style.left = randomNum(-150, 150) + "px";
                        div.style.top = randomNum(450, 1050) + "px";
                        div.style.transform = "rotate3d(1, 1, 1, "+randomNum(-360, 360) +"deg)";
                        div.style.backgroundColor = "var(--r)";
                    }
                }
                clone.className = "";
                    setTimeout(()=>{
                        clone.parentNode.removeChild(clone);
                        g.lvl = {lvl:1};
                        g.shA = 1; g.blA = 1; g.scA = 2;
                        newGame(g.lvl);
                    },g.ani * 2)

            },g.ani * 2)
            
        }
    }
}

function reset(){
    clearInterval(g.loop);
    root.innerHTML="";
    g.tileSessionCount = 0; 
    g.t = {};
    g.r = {};
    g.tL = 0; 
    g.block = false;
    g.wa.style.setProperty("--w", "0px");
    g.al.innerHTML = "";
    g.tswp("de")
}
function warp(){
    g.block = true;
    g.wa.style.setProperty("--w", "200px");
    g.waN.innerHTML = "Warping Successful";

    for(let i = 0; i < g.b;  i++){
        if(!g.dmg(-1)){break;}
    }
    if(g.shA > -1){
        end(true);
    }


}
function newGame(lvl){

    if(!lvl){lvl={lvl:1}}
    reset();
    g.mi.classList.add("lvl"+lvl.lvl);
    g.ss.style.transform = "translate("+(45*(lvl.lvl -1))+"px, 0px) rotate(30deg)";
    let ti = g.st + (lvl.lvl * 10);
    g.timer = ti;
    g.tL = ti; 
    g.loop = setInterval(()=>{
        g.tL--; 
        let w = (200 - ((g.timer / 100) * g.tL) * 2);
        g.wa.style.setProperty("--w",  (w < 0 ? 0 : w ) + "px");
        g.waN.innerHTML = "Warping in " + g.tL;
        if(g.tL <= 0){warp();}  
    },1000)

    const rows =  lvl.rows ? lvl.rows: g.sRow + g.lvl.lvl;
    const tr =  lvl.tr ? lvl.tr : g.sRp + g.lvl.lvl;
    g.mb = lvl.b ? lvl.b : g.bb + g.lvl.lvl;
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
    for(let i = 0; i < g.q; i++){
        let ran = randomNum(0, Object.keys(g.t).length - 1);
        let t = g.t[ran];
        if(t.type === "?"){t.obj.gainType(t, "q");} 
    }
    g.b = g.mb - nB;
    g.ga("bl", g.b);
    setTimeout(()=>{document.body.className = "";g.ex = false},1)
    g.up();
}
