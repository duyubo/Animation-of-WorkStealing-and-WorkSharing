# Animation-of-WorkStealing-and-WorkSharing

This project is the animation of work stealing and work sharing algorithm, which is written by javascript, CSS and html. It aims to help the beginners to know about the process of these two algorithms clearly.

## User Interface

![Screen shot of user interface.](https://github.com/duyubo/Animation-of-WorkStealing-and-WorkSharing/blob/master/images/Interface.PNG "User Interface")

* **Number of tasks**: How many task nodes in the first task set 
* **Critical path length**: The longestest path in the first task set
* **Number of task sets**: How many task sets 
* **Number of processors**: How many processors avaliable

We call each connected graph as one task set. To make the animation more clear, the length of the longest path decreases by 1.5 one after one.

Each task node can only spawn one child task set and the probability of the spawn depends on the longest length of itself. While, each task node can have many parent nodes and different children task sets of the same paren task set can return back to the same task node. 

## How to use it

Fill in the areas mention above. Press the 'submit' button, the program will draw some task sets. Choose 'Work Stealing' or 'Work Sharing' then press the 'go' button, the animation will begin.

Each processor is represented by a unique color. The colo on the task nodes means which processor is executing the task node. Double ended deques for different processors are also represented by different colors. 

And there will be a notation 'pX tY', where X means which processer and Y means finished at which time step.

Once the node is finished, they will become black.

## Examples

![Work Sharing.](https://github.com/duyubo/Animation-of-WorkStealing-and-WorkSharing/blob/master/images/WorkSharing.gif "Work Sharing")

![Work Stealing.](https://github.com/duyubo/Animation-of-WorkStealing-and-WorkSharing/blob/master/images/WorkStealing.gif "Work Stealing")


