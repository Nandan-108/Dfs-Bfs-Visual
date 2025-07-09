var htmlcode = "";
var nofrows = document.getElementById("nofrows");
var nofcols = document.getElementById("nofcols");
var mainDiv = document.getElementById("main");
var submit = document.getElementById("updrowcol");
var start = document.getElementById("start");
var end = document.getElementById("end");
var selectblocks = document.getElementById("selectblocks");
var deselectblocks = document.getElementById("deselectblocks");
var startBFS = document.getElementById("startbfs");
var startDFS = document.getElementById("startdfs");
var resetAll = document.getElementById("resetall");
var resetTraversal = document.getElementById("resettraversal");

var startSelected = false, endSelected = false, selectblockSelected=false, deselectblockSelected = false;
var nr = 5, nc = 10;

var grid;

var startNode = -1, endNode = -1, isBlock = [];
var graph = new Array();
var visitedColor = "#01d601", unvisitedColor = "rgb(47, 22, 22)", startNodeColor ="green", endNodeColor = "red", blockNodeColor = "black", pathColor="hsl(27deg 90% 55%)";

var doingBFS = false, doingDFS = false, graphReseted = true;
var time = 0;
var dim = (mainDiv.clientWidth-nc*4)/nc;

// updates the Graph with new number of rows and cols
function updateDiv(){
    htmlcode = "";
    for (var i = 0;i<nr;i++){
        htmlcode += `<div class= "row">`
        for (var j = 0;j<nc;j++){
            htmlcode +=`<div class="col" id="grid_`
            htmlcode+=i*nc+j;
            htmlcode+=`">`;
            // htmlcode+=i*nc+j;
            htmlcode+=`</div>`;
        }
        htmlcode+= `</div>`;
    }
    if (htmlcode!=""){
        mainDiv.innerHTML = htmlcode;
        grid = getNewGridDiv();
        evlistener();
        resetAll.click();
    }
}


function getNewGridDiv(){
    var newgrid = [nc*nr];
    dim = (mainDiv.clientWidth-nc)/nc;

    var rows = document.getElementsByClassName('row');
    for (let i = 0; i<rows.length;i++){
        rows[i].style.height = dim+"px";
    }

    graph = new Array(nr*nc,);
    for (let i = 0;i<nc*nr;i++) graph[i] = new Array();
    for (var i = 0;i<nr;i++){                
        for (var j = 0;j<nc;j++){
            let node = i*nc+j;
            newgrid[node] = document.getElementById("grid_"+(node));
            newgrid[node].style.width = dim+"px";

            // Crates graph
            if (j+1<nc) {
                graph[node].push(node+1);
                graph[i*nc+j+1].push(node);
            }
            if (i+1<nr) {
                graph[node].push(node+nc);
                graph[node+nc].push(node);
            }
        }
    }
    return newgrid;
}

// add event listner to grid cells for selecting start, end and blocks
function evlistener(){
    for (var i = 0;i<nr;i++){                
        for (var j = 0;j<nc;j++){
            let node = i*nc+j;
            // grid[node].blockSelected = 'on';
            grid[node].addEventListener("click", function(){
                if (startSelected) {
                    if (startNode!=-1) grid[startNode].style.backgroundColor = unvisitedColor;
                    grid[node].style.backgroundColor = startNodeColor;
                    startNode = node;
                    if (isBlock[node]) isBlock[node] = false;
                    if (endNode==node) endNode = -1;
                };
                if (endSelected) {
                    if (endNode!=-1) grid[endNode].style.backgroundColor = unvisitedColor
                    grid[node].style.backgroundColor = endNodeColor;
                    endNode = node;
                    if (isBlock[node]) isBlock[node] = false;
                    if (startNode==node) startNode = -1;
                }
                if (selectblockSelected) {
                    grid[node].style.backgroundColor = blockNodeColor;
                    isBlock[node] = true;
                    if (startNode===node) startNode = -1;
                    if (endNode===node) endNode = -1;
                }
                if (deselectblockSelected) {
                    if (isBlock[node]){
                        grid[node].style.backgroundColor = unvisitedColor;
                        isBlock[node] = false;
                    }
                }
            });
            
            grid[node].addEventListener('mouseover', (e)=>{
                if (selectblockSelected && e.ctrlKey) {
                    if (!isBlock[node]){
                        grid[node].style.backgroundColor = blockNodeColor;
                        isBlock[node] = true;
                        if (startNode===node) startNode = -1;
                        if (endNode===node) endNode = -1;
                    }
                }
                else if (deselectblockSelected && e.ctrlKey) {
                    if (isBlock[node]){
                        grid[node].style.backgroundColor = unvisitedColor;
                        isBlock[node] = false;
                    }
                }

            });
        }
    }

}

updateDiv();

console.log(htmlcode)

submit.addEventListener('click', function (){
    if (!isNaN(nofrows.valueAsNumber)) nr = nofrows.valueAsNumber;
    if (!isNaN(nofcols.valueAsNumber)) nc = nofcols.valueAsNumber;
    updateDiv();
})

start.addEventListener('click', function (){
    if (startSelected){
        start.style.backgroundColor = "#d7f5e4";
        startSelected = false;
    }
    else {
        start.style.backgroundColor = "rgb(158 183 170)";
        startSelected = true;
        selectblockSelected = false;
        deselectblockSelected = false;
        endSelected = false;
        end.style.backgroundColor = "#d7f5e4";
        deselectblocks.style.backgroundColor = "#d7f5e4";
        selectblocks.style.backgroundColor = "#d7f5e4";
    }
})
selectblocks.addEventListener('click', function (){
    if (selectblockSelected){
        selectblocks.style.backgroundColor = "#d7f5e4";
        selectblockSelected = false;
    }
    else {
        selectblocks.style.backgroundColor = "rgb(158 183 170)";
        selectblockSelected = true;
        deselectblockSelected = false;
        endSelected = false;
        startSelected = false;
        start.style.backgroundColor = "#d7f5e4";
        end.style.backgroundColor = "#d7f5e4";
        deselectblocks.style.backgroundColor = "#d7f5e4";
    }
})
deselectblocks.addEventListener('click', function (){
    if (deselectblockSelected){
        deselectblocks.style.backgroundColor = "#d7f5e4";
        deselectblockSelected = false;
    }
    else {
        deselectblocks.style.backgroundColor = "rgb(158 183 170)";
        deselectblockSelected = true;
        selectblockSelected = false;
        endSelected = false;
        startSelected = false;
        start.style.backgroundColor = "#d7f5e4";
        end.style.backgroundColor = "#d7f5e4";
        selectblocks.style.backgroundColor = "#d7f5e4";
    }
})
end.addEventListener('click', function (){
    if (endSelected){
        end.style.backgroundColor = "#d7f5e4";
        endSelected = false;
    }
    else {
        end.style.backgroundColor = "rgb(158 183 170)";
        endSelected = true;
        startSelected = false;
        selectblockSelected = false;
        deselectblockSelected = false;
        start.style.backgroundColor = "#d7f5e4";
        deselectblocks.style.backgroundColor = "#d7f5e4";
        selectblocks.style.backgroundColor = "#d7f5e4";
    }
})


startBFS.addEventListener('click', async function(){

    if (startNode===-1 || endNode===-1 || doingBFS || doingDFS || !graphReseted) return;
    doingBFS = true;
    graphReseted = false;
    time = 0;
    var par = new Array(nc*nr), dist = new Array(nc*nr);
    dist[startNode] = 0;
    par[startNode] = startNode;
    
    
    resetAll.disabled = true;
    resetTraversal.disabled = true;

    var queue = []
    queue.push(startNode);
    
    while(queue.length>0){
        let x = queue.shift();
        for (let i = 0;i<graph[x].length;i++){
            if (isNaN(par[graph[x][i]]) && !isBlock[graph[x][i]]){
                dist[graph[x][i]] = dist[x]+1;
                par[graph[x][i]] = x;
                if (graph[x][i]==endNode){
                    doingBFS = false;
                    traceBack(par, endNode, dist[endNode]+5);
                    return;
                }
                time = dist[graph[x][i]];
                updateNode(graph[x][i], dist[graph[x][i]], visitedColor);
                queue.push(graph[x][i]);
            }
        }
    }
    doingBFS = false;
    setTimeout(() => {
        resetAll.disabled = false;
        resetTraversal.disabled = false;
    }, time*40);
})

startDFS.addEventListener('click', async function(){
    if (startNode===-1 || endNode===-1 || doingBFS || doingDFS || !graphReseted) return;
    doingDFS = true;
    graphReseted = false;
    var par = new Array(nc*nr), dist = new Array(nc*nr);
    dist[startNode] = 0;
    par[startNode] = startNode;
    var found = false;
    let time = 0;

    // 
    resetAll.disabled = true;
    resetTraversal.disabled = true;
     dfs(startNode, startNode);
    // 
    function dfs(x, parent){
        par[x] = parent;
        
        for (let i = 0;i<graph[x].length;i++){
            if (isNaN(par[graph[x][i]]) && !isBlock[graph[x][i]]){
                if (found){
                    return;
                }
                dist[graph[x][i]] = dist[x]+1;
                par[graph[x][i]] = x;
                if (graph[x][i]==endNode){
                    found = true;
                    // traceBack(par, endNode, time+(dist[endNode]));
                    return;
                }

                updateNode(graph[x][i], time++, visitedColor);
                dfs(graph[x][i], x);
            }
        }  
    }
    time+=5;
    doingDFS = false;
    if (found) {
        traceBack(par, endNode, time);
    }
    else {
        setTimeout(() => {
            resetAll.disabled = false;
            resetTraversal.disabled = false;
        }, time*40);
    }
})

function traceBack(par, endNode, time){
    let node = par[endNode];
    while(true){
        updateNode(node, (time++), pathColor);
        node = par[node];
        if (node === par[node]) break;
    }
    setTimeout(() => {
        resetAll.disabled = false;
        resetTraversal.disabled = false;
    }, time*40);
}

resetAll.addEventListener('click', function(){
    if (doingBFS || doingDFS) return;
    startNode = -1, endNode = -1;
    //recolor grid
    for (let i = 0;i<nc*nr;i++) {
        grid[i].style.backgroundColor = unvisitedColor;
        isBlock[i] = false;
    }
    graphReseted = true;
})
resetTraversal.addEventListener('click', ()=>{
    if (doingBFS || doingDFS) return;
    for (let i = 0;i<nc*nr;i++) {
        if (i===startNode || i === endNode || isBlock[i]) continue;
        grid[i].style.backgroundColor = unvisitedColor;
    }
    graphReseted = true;
})

function updateNode(node, time, color){
    setTimeout(() => {
        grid[node].style.backgroundColor = color;
    }, (time)*40);
}
