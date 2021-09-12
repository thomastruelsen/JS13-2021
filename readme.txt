Hello there, and thanks for reading! 
I will cover to things here, the game and the code.

The code. 

The idea was to have it as compact as possible, thus making unfortunately making it hard to read without some background informmation. 

The JS code is divided into 3 things. 

- The Class
- The Object
- The variables and global functions

The class (Tile) Each Metoer is build on an instance of this. This makes it possible to interact with this on the fly and manipulate it. 

The Object (window.g) makes for a really compact way to interact with every aspect of the game.
Try running "window.g" in the console, in chrome dev tools, you can hover over the elements and quickly discover the relations, and manipulate the vales.

The variables to quickly access the most needed elements and weird UTF-8 emojii and sign i found. 


DISCLAIMER so after tile i kindda panicked as i thought the combined unzipped file should be 13kb, only now sunday 15:10, realizing that this is not the case. 
So everything i could shorten has been shortened. 
This unfortunately also means variables before minifying code, making it hard to read, and i will redeem this if need be.
Example:
1-character: "g" = "game",  "t" = "tiles"/ "meteors", "b"="bombs", "q"= "curios"(I cant spell, sorry)
2-character: "sc" = Shield; "sc" = "Scanner"; "bl" = "Blaster";  