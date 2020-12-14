"use strict";
const container = document.querySelector(".data-container");

// Draw the arrow between the trees given start point (fromx, fromy)
//, end point (tox, toy) and length of the arrow (r) 
function draw_arrow(context, fromx, fromy, tox, toy, r){
    var x_center = fromx;
    var y_center = fromy;

    var angle,angle1,angle2;
    var x;
    var y;

    r = r/2;
    var size;
    context.beginPath();
    context.strokeStyle = 'black';

    angle = Math.atan2(toy-fromy,tox-fromx)
    size = Math.sqrt((toy-fromy) * (toy-fromy) +(tox-fromx)*(tox-fromx));
    x = r*Math.cos(angle) + x_center;
    y = r*Math.sin(angle) + y_center;

    context.moveTo(x, y);
    tox = tox - (r+1)*Math.cos(angle);
    toy = toy - (r+1)*Math.sin(angle);
    context.lineTo(tox, toy);

    context.moveTo(tox, toy);
    angle1 = angle -(6/10)*(2*Math.PI)
    x = 5*Math.cos(angle1) + tox;
    y = 5*Math.sin(angle1) + toy;
    context.lineTo(x, y);

    context.moveTo(tox, toy);
    angle2 = angle + (6/10)*(2*Math.PI)
    x = 5*Math.cos(angle2) + tox;
    y = 5*Math.sin(angle2) + toy;
    context.lineTo(x, y);

    context.closePath();

    //context.fill();
    context.stroke();
}

// Draw the circle given center point (startX, startY), radius(size) and color (color)
function draw_circle(context, startX, startY, size,color = '#B8D9FE') {
    context.beginPath();
    context.fillStyle = color;
    context.arc(startX, startY, size, 0, 2 * Math.PI);
    context.strokeStyle = color;
    context.fill();
    context.closePath(); 
    context.stroke();
}

//Draw test given center location (startX, startY), text content (t) and text color (textColor)
function draw_text1 (context, startX, startY,t,textColor){

    context.beginPath();
    context.fill();
    context.strokeStyle = '#ffffff';
    context.font = 'bold 10pt Calibri';
    context.textAlign = 'center';
    context.fillStyle = textColor;
    context.textBaseline = "middle";
    context.fillText(t, startX, startY);
    context.closePath();
}

//Draw the number for each node
function draw_text (context, startX, startY,num){
    draw_text1 (context, startX, startY,num,'white');
}

//Draw the node given the current center (fromx, fromy), next node center location (tox, toy),
//radius (r), number index of the node (num), a flag represents if it has a next node (flag), node color (color)
//Each node consits of a circle with a node number in the center and ad arrow pointed to the netx node if it has
function draw_node(context, fromx, fromy, tox, toy, r,num,flag = 1,color = '#B8D9FE'){
    draw_circle(context, fromx, fromy, r/2,color = color);
    draw_text (context, fromx, fromy,num)
    if (flag==1){
        draw_arrow(context, fromx, fromy, tox, toy, r);
    }
}

// draw the double ended queue
function draw_deque(context,color,upx,upy,w,h,num){

    context.beginPath();
    context.fillStyle = color;
    context.rect(upx,upy,w,h);
    context.strokeStyle = color;
    context.fill();
    context.stroke();
    draw_text (context, upx+w/2, upy+h/2,num);
    context.closePath();
    
    
}

//Set the probability of 'spawn/forking' of each node, given the lengh of this task set
function probaFork(x) {
    return (1-(1/x));
}

//Class node, represents the information of the nodes:
/*
index: index of the node
next: next node
prev: ancestor node but not the paret node
child: child node
parent: parent node
parentSet: all the parents and ancestors of the node
color: the color label of the node
x: x location of the node center
y: y location of the node center
!!!!!!!!

o1
|
o2
| \
o3  o6
|    \
o4    o7
|    /
|   /
o5
next is different from the child:
o3 is the next of o2;
o6 is teh child of o2;
prev is different from the parent:
o4 is the prev of o5;
o2 is parent of o6;
o7 is parent of o5;
!!!!!!!!
*/
class Node{
    index;
    next = null;
    prev = null;
    child = null;
    parent = null;
    parentSet = [];
    color = 'r';
    x;
    y;
    constructor(index, parentSet = []) {
        this.index = index;
        this.parentSet = parentSet;
    }

    set_prev(prev){
        this.prev = prev;
    }

    set_parentSet(parent){
        this.parentSet.push(parent);
    }

    set_next(n){
        this.next = n;
    }

    set_child(n){
        this.child = n;
    }

    set_parent(n){
        this.parent = n;
    }

    set_color(c){
        this.color = c;
    }

    set_xy(x,y){
        this.x = x;
        this.y = y;
    }

}

// The whole tree sets
class treeInf{
    tree;
    treeSet
    constructor(tree,treeSet) {
        this.tree = tree;
        this.treeSet = treeSet;
    }

}

// The information of each single tree
class singleTreeInf{
    tree;
    length;
    parentInf;
    lastY;
    constructor(tree,length,parentInf = null) {
        this.tree = tree;
        this.length = length;
        this.parentInf = parentInf;
    }
}

//Draw the tree given the critical path length (maxDepth), number of nodes
// (maxNode) and nnumber of task sets (taskSetNum) 
function generateTree(maxNode = 30,maxDepth = 10, taskSetNum = 3){
    var i = 0;
    var treeInfSet = [];

    // For each task set
    for (var count = 0; count < taskSetNum; count++){
        var treeSet = new Array();
        var tree = new Array(); // save the root node of each tree set
        var root = new Node(0);
        tree[0] = root;
        var n_pre = root;
        var n_next;
        // draw the critical path 
        for(i = 1;i<maxDepth;i++){
            n_next = new Node(i);
            tree[i] = n_next;
            n_pre.set_next(n_next);
            n_next.set_prev(n_pre);
            n_pre = n_next;
        
        }
        console.log(root);

        treeSet[0] = new singleTreeInf(root,maxDepth);
        var lastTree = 0;
        var nextCount = 1;
        while (i < maxNode){
        
            var l = 0;
            if (lastTree >= treeSet.length){
                break;
            }

            console.log(treeSet[lastTree]);
            console.log(tree);

            var n = treeSet[lastTree].tree;
        
            // the last and the second last node can not have children
            while (i < maxNode && l < treeSet[lastTree].length - 2){
            //fork the child by some probability
                if (Math.random() < probaFork(treeSet[lastTree].length)){
                    var newChild = new Node(i);
                    tree[i] = newChild;
                    var newLength = Math.round(Math.random()*( treeSet[lastTree].length - 3 - l) + 1);
                    n.set_child(newChild);
                    treeSet[nextCount] = new singleTreeInf(newChild,newLength,lastTree);
                    nextCount = nextCount + 1;
                    newChild.set_parent(n);
                    console.log('the first node in the child',newChild);
                
                    //create the new path
                    for (var j = 0; j < newLength - 1; j++) {
                        i = i + 1;
                        newChild.set_next(new Node(i));
                        newChild.next.set_prev(newChild);
                        newChild = newChild.next;   
                        tree[i] = newChild;      
                    }

                    //choose which node to return back and set up it
                    i = i + 1;
                    var nodeP = n;
                    var stopCount = newLength + Math.round(Math.random()*( treeSet[lastTree].length - 2 - l - newLength) + 1);
                    console.log('node', n, 'length', treeSet[lastTree].length, 'l', l,'newLength',newLength, 'stopCount', stopCount);
                    for (var j = 0; j < stopCount;  j++){
                        nodeP = nodeP.next;
                    }
                    newChild.set_child(nodeP);
                    nodeP.set_parentSet(newChild);

                }
                n = n.next;
                l = l + 1;
            }
            lastTree++;
        }
        //set up the new tree set decrease the length by 1.5
        treeInfSet[count] = new treeInf(tree,treeSet);
        maxNode = Math.ceil(maxNode/1.5);
        maxDepth = Math.floor(maxDepth/1.5);
    }
    return treeInfSet; 
}

// Draw the task sets given the whole task sets
function drawTree(context,tree){

    var myCanvas = document.getElementById("myCanvas");
    var myCanvas_rect = myCanvas.getBoundingClientRect();
    var widths = myCanvas_rect.width;
    var heights = myCanvas_rect.height;

    var width = 100;
    x = width;
    var treeTotal = tree;
    for (var countj = 0; countj < treeTotal.length; countj ++){

    var treeSet = treeTotal[countj].treeSet;
    var tree = treeTotal[countj].tree;
   
    var pRoot ;
    var yStart;  // y location
    var nextY = 20; // y location for the first node in each task set
    var nodeInterval = 80; // node interval 
    var nodeSize = 40; // node size
    var p;

    for ( var i = 0; i < treeSet.length; i++){

        pRoot = treeSet[i].tree;
        
        if (pRoot.index != treeSet[i].tree.index)
            console.log("something error!");
        var count = 0;
        p = pRoot;
        var x;
        if (p.parent == null){
            yStart = nextY;
            x =   x + width;
        }
        else{
            if (treeSet[i - 1].parentInf == treeSet[i].parentInf || (treeSet[i - 1].parentInf != null && treeSet[i].parentInf != null && treeSet[treeSet[i - 1].parentInf].parentInf == treeSet[treeSet[i].parentInf].parentInf)){
                yStart = treeSet[i - 1].lastY > p.parent.y + nodeInterval ? treeSet[i - 1].lastY : p.parent.y + nodeInterval;
            }
            else{
                yStart = p.parent.y + nodeInterval;
                x = x + width;
            }
            
        }
        while (p != null){
            var flag = 1;
            if (p.next == null)
                flag = 0;
            draw_node(context, x, yStart, x, yStart + nodeInterval, nodeSize, p.index,flag);
            p.set_xy(x,yStart);
            yStart += nodeInterval;
            p = p.next;
            count ++;
        }
        treeSet[i].lastY = yStart;
    }
    
    //draw the arrow to the child node
    for (i = 0; i < tree.length; i ++){
        if (tree[i].child != null)
            draw_arrow(context, tree[i].x, tree[i].y, tree[i].child.x, tree[i].child.y, nodeSize);
    }
    x = x + 60;
    }
}

// class Task
/*
x: x location of center
y: y location of center
taskNode: tasknode

*/
class Task{
    x;
    y;
    taskNode;
    constructor(x,y,taskNode) {
        this.x = x;
        this.y = y;
        this.taskNode = taskNode;
    }
}

var colors = ['green','red','magenta','DeepPink','DarkViolet','Indigo','yellow'];

//Traverse the tree with only one processor
async function traversTreeOne(context,tree,delay = 300){
    console.log("traverse tree one");
    if (delay && typeof delay !== "number") {
        alert("sort: First argument must be a typeof Number");
        return;
    }
    var treeNum = tree.length;

    var upx = 5, upy = 5, w = 60, h = 30;
    var n = tree[0];
    var taskSet = [];
    var x,y,index;
    var color = 'green';
    await new Promise(resolve =>
        setTimeout(() => {
          resolve();
        }, delay)
      );

    while(n!=null){
        
        x = n.x;
        y = n.y;
        index = n.index;
        draw_node(context, n.x, n.y, 0, 0, 40, n.index, 0, color);
        if (n.child == null )
            n = n.next;
        else{
            if(n.child.index < n.index){
                //if return back to the parent path, pop the task node from the double ended deque
                console.assert(n.next==null);
                n = taskSet.pop();
                upy = upy - h;
                draw_deque(context,'white',upx,upy,w,h,0);
                
            }
            else{
                // if forks a child, pudh the next node in the deque and continue to work on the child node
                taskSet.push(n.next);
                draw_deque(context,color,upx,upy,w,h,n.next.index);
                n = n.child;
                upy = upy + h;
            }
        }
        await new Promise(resolve =>
            setTimeout(() => {
              resolve();
            }, delay)
          );
        // Draw teh finished node black
        draw_node(context, x, y, 0, 0, 40, index, 0, 'black');
    }

}

// the information of next node
class nextNode{
    node;
    taskDeque;
    constructor(node, taskDeque) {
        this.node = node;
        this.taskDeque = taskDeque;
    }
}

//find the next node of the given tree node (n), and the task set (taskDequeSingle)
function traverse(context, n, taskDequeSingle,color,upx = 5){    
    var w = 60, h = 30;
    var upy = 5;   
    for(var countj = 0; countj < n.parentSet.length; countj++){
        if (n.parentSet[countj].color == 'r'){
            //console.log("reach here 1");
            var nextNodeSingle = new nextNode(n, taskDequeSingle);
            return nextNodeSingle;  
        }
    }
    if(n.prev != null && n.prev.color == 'r'){
        //console.log("reach here 2");
        var nextNodeSingle = new nextNode(n, taskDequeSingle);
        return nextNodeSingle; 
    }

    draw_node(context, n.x, n.y, 0, 0, 40, n.index, 0, color);
    
    if (n.child == null){
        n = n.next;
    }
    else{
        if(n.child.index < n.index){
            if (taskDequeSingle.length != 0){
                console.assert(n.next==null);
                var t = taskDequeSingle.pop();
                n = t.taskNode;
                draw_deque(context,'white',t.x,t.y,w,h,0);
            }
            else{
                n = null;
            }
        }
        else{
            if (taskDequeSingle.length != 0){
                upx = taskDequeSingle[taskDequeSingle.length - 1].x;
                upy = taskDequeSingle[taskDequeSingle.length - 1].y + h;
            }
            taskDequeSingle.push(new Task(upx,upy,n.next));
            draw_deque(context,color,upx,upy,w,h,n.next.index);
            n = n.child;
        }
    }
    var nextNodeSingle = new nextNode(n, taskDequeSingle);
    return nextNodeSingle;  
}

//find the next node of the given tree node (n), and the task set (taskDequeSingle)
function traverseOneDeque(context, n, taskDequeSingle,color = '#B8D9FE',upx = 5){    
    var w = 60, h = 30;
    var upy = 5;   
    for(var countj = 0; countj < n.parentSet.length; countj++){
        if (n.parentSet[countj].color == 'r'){
            //console.log("reach here 1");
            var nextNodeSingle = new nextNode(n, taskDequeSingle);
            return nextNodeSingle;  
        }
    }
    if(n.prev != null && n.prev.color == 'r'){
        //console.log("reach here 2");
        var nextNodeSingle = new nextNode(n, taskDequeSingle);
        return nextNodeSingle; 
    }

    draw_node(context, n.x, n.y, 0, 0, 40, n.index, 0, color);
    
    if (n.child == null){
        n = n.next;
    }
    else{
        if(n.child.index < n.index){
            if (taskDequeSingle.length != 0){
                console.assert(n.next==null);
                var t = taskDequeSingle.shift();
                n = t.taskNode;
                draw_deque(context,'white',t.x,t.y,w,h,0);
            }
            else{
                n = null;
            }
        }
        else{
            if (taskDequeSingle.length != 0){
                upx = 5;
                upy = taskDequeSingle[taskDequeSingle.length - 1].y + h;
            }
            taskDequeSingle.push(new Task(upx,upy,n.next));
            draw_deque(context,'black',upx,upy,w,h,n.next.index);
            n = n.child;
        }
    }
    var nextNodeSingle = new nextNode(n, taskDequeSingle);
    return nextNodeSingle;  
}


// Animation of work stealing
async function traversTreeWStealing(context,tree,delay = 300,pNum = 1)
{
    var w = 60, h = 30;
    if (delay && typeof delay !== "number"){
        alert("sort: First argument must be a typeof Number");
        return;
    }

    var taskDeque = [];
       
    await new Promise(resolve =>
        setTimeout(() => {
          resolve();
        }, delay)
    );
    
    var setNum = pNum < tree.length ? pNum : tree.length;
    var n = []; 
    var reArrangeTree = [];

    for (var countj = 0; countj < tree.length; countj++)
    {
        n[countj] =  tree[countj].tree[0];   
        reArrangeTree[countj] = countj;
    }

    for (var countj = 0; countj < pNum; countj++)
    {
        taskDeque[countj] = [];
        //draw_text1(context,  20 + 60 * countj, 160 ,'n','black');
        //draw_text1(context,  60 + 60 * countj, 160 ,'p','black');
        //draw_text1(context, 40 + 60 * countj, 160 ,'t','black');
    }

    var flag = 1;
    var countShow = 0;
           
    while (n != null)
    {    
        flag = 0;
        var x = [];
        var y = [];
        var index = [];
        var nextNodeSingle = [];
        var countj;
        var nodeColor = [];
        var treeLabel = [];

        var labelBlack = [];
        var queueWhite = [];
       
        var setNum = pNum > tree.length ? pNum : tree.length;
        var lastCheck = [];
        // for p processor
        for (var countj = 0; countj < pNum; countj++)
        {   
            var nodeAux = null;
            if (countj < tree.length && n[countj] != null)
            {
                x[countj] = n[countj].x;
                y[countj] = n[countj].y;
                index[countj] = n[countj].index;
                nodeAux = n[countj];  
                nextNodeSingle[countj] = traverse(context, n[countj], taskDeque[countj],colors[countj],tree[countj].tree[0].x - 120);
                n[countj] = nextNodeSingle[countj].node;
                taskDeque[countj] = nextNodeSingle[countj].taskDeque;
                if (nodeAux != n[countj])
                {
                    nodeColor.push(nodeAux);
                    labelBlack.push(nodeAux);
                    lastCheck.push(colors[countj]);
                    treeLabel.push(countj);
                    treeLabel.push(reArrangeTree[countj]);
                    console.log('ReArrangeSet',reArrangeTree[countj]);
                }
            }
            else{
                for (var j = 0; j < pNum; j++)
                {
                    if(taskDeque[j].length != 0 && n[countj] == null)
                    {   
                        var t = taskDeque[j][0].taskNode;
                        console.log(taskDeque[j][0].taskNode);
                        var flagReady = 1;
                        if(t.prev != null && t.prev.color == 'r'){
                            flagReady = 0;
                        }

                        console.log(taskDeque[j][0].taskNode,flagReady);
                        
                        if(flagReady == 1){

                            t = taskDeque[j].shift(); 
                            n[countj] = t.taskNode;
                            nodeColor.push(n[countj]);
                            labelBlack.push(n[countj]);
                            lastCheck.push(colors[countj]);
                            treeLabel.push(countj);
                            treeLabel.push(reArrangeTree[countj]);

                            draw_deque(context,'white',t.x,t.y,w,h,0);
                            console.log('ready',n[countj]);
                            break;
                        }
                        else{
                            t = taskDeque[j].shift(); 
                            n[countj] = t.taskNode;
                            draw_deque(context,'white',t.x,t.y,w,h,0);
                            if (countj >= tree.length ){
                                t.x = tree[tree.length - 1].tree[tree[tree.length - 1].tree.length - 1].x + 120 * (countj - tree.length + 1);
                            }   
                            else{
                                t.x = tree[countj].tree[0].x - 120;
                            } 
                            t.y = 5;
                            draw_deque(context,colors[countj],t.x,t.y,w,h,t.taskNode.index);
                            queueWhite.push(t);
                            console.log("get a task from deque but can not execute!",t.taskNode);
                        }
                        
                    }
                }

                if (n[countj] != null){
                    x[countj] = n[countj].x;
                    y[countj] = n[countj].y;
                    //console.log(n[countj].index);
                    index[countj] = n[countj].index;
                    var nodeAux = n[countj]; 
                    var xLocation; 
                    if (countj >= tree.length ){
                        xLocation = tree[tree.length - 1].tree[tree[tree.length - 1].tree.length - 1].x + 120 * (countj - tree.length + 1);
                        
                        nextNodeSingle[countj] = traverse(context, n[countj], taskDeque[countj],colors[countj],xLocation);
                        n[countj] = nextNodeSingle[countj].node;
                        if (nodeAux != n[countj])
                        {
                            nodeColor.push(nodeAux);
                            labelBlack.push(nodeAux);
                            lastCheck.push(colors[countj]);
                            treeLabel.push(countj);
                            treeLabel.push(reArrangeTree[countj]);
                            console.log('ReArrangeSet',reArrangeTree[countj]);
                        }
                        
                        taskDeque[countj] = nextNodeSingle[countj].taskDeque;
                    }else{

                        xLocation = tree[countj].tree[0].x - 120;
                        nextNodeSingle[countj] = traverse(context, n[countj], taskDeque[countj],colors[countj],xLocation);
                        n[countj] = nextNodeSingle[countj].node;
                        taskDeque[countj] = nextNodeSingle[countj].taskDeque;
                        //console.log("reach here no push",nodeAux);
                    }
                    
                }

            }

        }
        
        // for the taskset without processor
        for (var counti = pNum ; counti < setNum; counti ++){
            console.log("1111111111");
            
            if (n[counti] != null ){
                for (var countj = 0 ; countj < pNum; countj ++){
                    var flag1 = 0;
                    console.log("processor",countj);
                    // for the tree without any processor working on it
                    for (var jj = 0; jj < lastCheck.length; jj++){
                       if ( lastCheck[jj] == colors[countj]){
                         flag1 = 1; 
                         console.log('color confliction',"processor",countj,colors[countj],"tree",counti);
                         break;
                       }
                    }
                    
                    if (n[countj] == null && flag1 != 1){
                        console.log('success assign the processor',countj, 'to tree ', counti);
                        n[countj] = n[counti];
                        reArrangeTree[countj] = counti;
                        x[countj] = n[countj].x;
                        y[countj] = n[countj].y;
                        index[countj] = n[countj].index;
                        var nodeAux = n[countj];       
                        nextNodeSingle[countj] = traverse(context, n[countj], taskDeque[countj],colors[countj],tree[countj].tree[0].x - 120);
                        n[countj] = nextNodeSingle[countj].node;
                        taskDeque[countj] = nextNodeSingle[countj].taskDeque;
                        if (nodeAux != n[countj])
                        {
                            nodeColor.push(nodeAux);
                            labelBlack.push(nodeAux);
                            lastCheck.push(colors[countj]);
                            treeLabel.push(countj);
                            treeLabel.push(counti);
                            console.log('ReArrangeSet',reArrangeTree[countj]);
                            //print('counti',counti)
                        }
                        n[counti] = null;  
                        break;
                    }
                }
            }

        }

        for (var countj = 0; countj < nodeColor.length; countj++){
            nodeColor[countj].color = 'b';
        }

        await new Promise(resolve =>
            setTimeout(() => {
                resolve();
        }, delay));

        for (var countj = 0; countj < queueWhite.length; countj++){
            draw_deque(context,'white',queueWhite[countj].x,queueWhite[countj].y,w,h,0);
        }

        for (var countj = 0; countj < labelBlack.length; countj++){
            draw_node(context, labelBlack[countj].x, labelBlack[countj].y, 0, 0, 40, labelBlack[countj].index, 0, 'black');
            var locationX = 20 + countj*60;
            draw_text1 (context, labelBlack[countj].x + 30, labelBlack[countj].y ,'p'+treeLabel[countj*2],colors[treeLabel[countj*2]]);
            draw_text1 (context, labelBlack[countj].x + 50, labelBlack[countj].y ,'t'+countShow,colors[treeLabel[countj*2]]);
            //draw_text1 (context, locationX + 40, 180 + countShow*20 ,treeLabel[countj*2],colors[treeLabel[countj*2]]);
            //draw_text1 (context, locationX + 20, 180 + countShow*20 ,treeLabel[countj*2+1],colors[treeLabel[countj*2]]);
        }
        console.log('treeLabel',treeLabel);

        for (var countj = 0; countj < tree.length; countj++){
            if (n[countj] != null){
                flag = 1;
                break;
            }
        }
        for (var countj = 0; countj < pNum; countj++)
        {
            if (taskDeque[countj].length != 0){
                flag = 1;
                break;
            }
        }
        countShow = countShow + 1;
    }

};

// Animation of work sharing
async function traversTreeWSharing(context,tree,delay = 300,pNum = 1){

    var w = 60, h = 30;
    if (delay && typeof delay !== "number"){
        alert("sort: First argument must be a typeof Number");
        return;
    }

    var taskDeque = [];
       
    await new Promise(resolve =>
        setTimeout(() => {
          resolve();
        }, delay)
    );
    
    var setNum = pNum < tree.length ? pNum : tree.length;

    // save the next node need to be executed of each tasktree
    //if the whole tree is finished, set the n as null
    var n = []; 
    for (var j = 0; j < tree.length; j++)
    {
        n[j] =  tree[j].tree[0];
    }
    // Each pprocessor saves the next unfinished node of each task set
    var processor = [];
    for (var j = 0; j < setNum; j++){
        processor[j] = n[j];
        n[j] = null;
    }
    for (var j = setNum; j < pNum; j++){
        processor[j] = null;
    }

    console.log(pNum);

    var flag = 1;
    var sharedTaskDeque = [];
    
    var countShow = 0;

    while(1){
        var nodeColor = [];
        var labelBlack = [];
        var lastCheck = [];
        var processorLabel = [];
        for (var j = 0; j < pNum; j++){
            processorLabel[j] = 0;
        }
        for (var j = 0; j < pNum; j++){
            if (processor[j] != null){
                var nodeAux = processor[j];
                var nextNodeSingle =  traverseOneDeque(context, processor[j], sharedTaskDeque,colors[j]);
                processor[j] = nextNodeSingle.node;
                
                if (nodeAux != processor[j])
                {   
                    // find the next node to be executed, if it is validate
                    // then execute
                    processorLabel[j] = 1;
                    nodeColor.push(nodeAux);
                    labelBlack.push(nodeAux);
                    lastCheck.push(colors[j]);
                }
            }
        }
        
        for (var j = 0; j < nodeColor.length; j++){
            nodeColor[j].color = 'b';
        }

        await new Promise(resolve =>
            setTimeout(() => {
                resolve();
        }, delay));

        // Draw the finished node black color
        for (var j = 0; j < labelBlack.length; j++){
            draw_node(context, labelBlack[j].x, labelBlack[j].y, 0, 0, 40, labelBlack[j].index, 0, 'black');
            draw_text1 (context, labelBlack[j].x + 30, labelBlack[j].y ,'t'+countShow,'black');
            
        }

        for (var j = 0; j < pNum; j++){
            if (processor[j] == null ){
                for (var i = 0; i < tree.length; i++)
                {
                    if (n[i] != null){
                        // Assign the unexecuted task set to the idle processor
                        processor[j] = n[i];
                        n[i] = null;
                        break;
                    }
                }
                if (processor[j] == null ){
                    if (sharedTaskDeque.length != 0)
                    {   
                        //If the processor is idle and double ended deque is not empty, 
                        //then get a job from the deque 
                        var t = sharedTaskDeque.shift();
                        processor[j] = t.taskNode;
                        draw_deque(context,'white',t.x,t.y,w,h,0);
                    }
                }
                
            }
        }
        countShow = countShow + 1;

    }

}

var tree;

// Add events to the 'submit' button
var btn = document.getElementById('submitB');
btn.addEventListener("click", function() {
    console.log("press button submit");
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);
    
    var MT = document.getElementById("MT").value == '' ? document.getElementById("MT").getAttribute("placeholder") : document.getElementById("MT").value;
    var MS = document.getElementById("MS").value == '' ? document.getElementById("MS").getAttribute("placeholder") : document.getElementById("MS").value;
    var MTS = document.getElementById("MTS").value == '' ? document.getElementById("MTS").getAttribute("placeholder") : document.getElementById("MTS").value;
    var NP = document.getElementById("NP").value == '' ? document.getElementById("NP").getAttribute("placeholder") : document.getElementById("NP").value;
    
    NP = parseInt(NP);
    MT = parseInt(MT);
    MS = parseInt(MS);
    MTS = parseInt(MTS);

    if (MT < MS){
        console.log('error max node is too small!','max node:', MT , 'max depth:', MS);
        return;
    }

    if (NP >= colors.length){
        alert(" number of processor should be less than ", colors.length + 1);
        return;
    };
    tree = generateTree(MT,MS,MTS);
    drawTree(ctx,tree);
    
});

// Add events to the go button
var btn = document.getElementById('go');
btn.addEventListener("click", function() {
    console.log("press button go");
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    var obj_select = document.getElementById("alg_select");
    var MTS = document.getElementById("MTS").value == '' ? document.getElementById("MTS").getAttribute("placeholder") : document.getElementById("MTS").value;
    var NP = document.getElementById("NP").value == '' ? document.getElementById("NP").getAttribute("placeholder") : document.getElementById("NP").value;
    MTS = parseInt(MTS);
    NP = parseInt(NP);

    if (NP >= colors.length){
        alert(" number of processor should be less than ", colors.length + 1);
        return;
    };
    
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for (var countj = 0; countj < tree.length; countj++){
        for (var counti = 0; counti < tree[countj].tree.length; counti++){
            tree[countj].tree[counti].color = 'r';
        }
    }
    drawTree(ctx,tree); 
    if (obj_select.value == 1) {
        traversTreeOne(ctx,tree[0].tree, 600);
    }
    else if(obj_select.value == 2){
        traversTreeWStealing(ctx,tree,1000,NP);
    }
    else{
        traversTreeWSharing(ctx, tree,1000,NP);
    }
    
});