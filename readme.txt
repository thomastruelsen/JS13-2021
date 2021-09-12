Hello there, and thanks for reading! 
I will cover to things here, the game and the code.

The game.
I wanted something simple yet challenging and with some replay value. So I created 🚀👾🪐.
A reimagined mine sweeper, with more depth and controlled RNG.


The code. 
The idea was to have it as compact as possible, thus unfortunately making it hard to read without some background informmation. 

The CSS and graphics. 
Having a limited budget in terms of size, retrospect i had way more than i thought, as i read it as 13 after zip, late in the progress.
I used the bare minimum and relied on weird symbols for art. 
Most static art is 3 seperate instances of before and and efter elements to make the meteoroides a bit more immersive. 
Animations are mostly happy mistakes that gives the player feedback using box shadows and transform.    


The JS code is divided into 3 things. 

- The Class
- The Object
- The variables and global functions

The class (Tile) Each Metoer is build on an instance of this. This makes it possible to interact with this on the fly and manipulate it. 

The Object (window.g) makes for a really compact way to interact with every aspect of the game.
Try running "window.g" in the console and play around. In chrome dev tools, you can hover over the elements and quickly discover the relations, and manipulate the vales.

The variables access the most needed elements and weird UTF-8 emojii and symbols i found for graphics. 



DISCLAIMER so after tile i kindda panicked as i thought the combined unzipped file should be 13kb, only now sunday 15:10, realizing that this is not the case. 
So everything i could shorten has been shortened. 
This unfortunately also means variables before minifying code, making it hard to read, and i will redeem this if need be.
Example:
1-character: "g" = "game",  "t" = "tiles"/ "meteors", "b"="bombs", "q"= "curios"(I cant spell, sorry)
2-character: "sc" = Shield; "sc" = "Scanner"; "bl" = "Blaster";  