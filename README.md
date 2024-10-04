# Welcome to my Sudoku Solver app!

This was the fourth certification project out of five for freeCodeCamp's Quality Assurance course. I'm very proud of it, and completing it was one of the most fulfilling things I've done in the ~10 months since I first started learning how to code. Figuring out the flow of information was fairly straightforward and, while there were obviously times in which things weren't working, I was able to figure what it was that wasn't working and how to fix it fairly quickly most of the time, which was great for my confidence as a future developer; there were considerably few instances in which I was stuck for longer than just a few minutes. It must be noted that, performance-wise, this is not ideal code, as solving a sudoku string can take anywhere from just a few seconds to hours depending on the difficulty. So the obvious question is: 

# Why am I so proud of this code if its performance is so bad speed-wise? 

It's because I truly designed the logic *from scratch* , and managed to create a complex code while keeping track in my head of how a lot of processes, variables, flags, loops, etc. interacted with each other. 

# But, weren't you SUPPOSED to design the logic from scratch?

What I mean is that, while I imagine that there are special methods that sudoku pros apply in order to solve complex sudokus (in the same way that I know there are methods for solving Rubik's cubes), I do not know said methods and I did not research them. I imagine efficient sudoku-solving apps do build their code implementing said methods—which is what allows them to solve strings quickly—but I wanted to code this algorhythm based on the approach a casual sudoku enthusiast would use, which is the one I'm familiar with. So I did not have the help of any "Here's the mathematical method to solving sudokus" approaches.

# So...

would this mean that coding this app could probably be more complex, and that it would take more time for the app to solve difficult strings? Yes, but that would also mean a lot of *practice* for me, and since I'm a student, that was precisely what would help me improve my skills. And as is evident from the above text, I'm very glad I did it this way.

# The basic approach is

1: Starting from the first empty tile, look at the numbers present in its row, column and region, and see which available numbers could go in said empty tile. If there's only one possibility, then that's the answer. If there's more than one possibility, move on to the next empty tile and repeat the same process.
2: After having gone through every empty tile, go back to the first empty tile, and repeat the entire process. Having solved some tiles in the first pass/loop means that maybe some tiles that had multiple possible values now have only one possible value.
3: Keep going over the entire board again and again until all tiles are solved.

Easier sudokus will always have at least one tile in each round that only has one possible value, so they can be solved this way. *This was the easy part of this project*

Naturally, when solving medium to hard sudokus, this approach has limitations: if at any point there isn't a single tile that has only one possible value, the player is stuck: now the only option is to try every possible combination for all the remaining empty tiles of the board until one works. This could be extremely time-consuming, BUT it can be done. And this is where the project *really* got challenging:

# The Hard Part

A user (or in this case, the app) could try to fill in, say, 10 empty tiles without running into any issues, only to find out at the eleventh empty tile that it's not possible to complete this board with the current combination. In this case, the app would need to delete the value of the last completed tile, and try a new one, which might work, but also might not work. And if no other values work in this "step-back" tile, now it's necessary to go back ANOTHER tile and try a different value, and go back and forth. This process, when implemented correctly, WILL eventually find the right answer, but it required me to come up with code that would be able to go back SEVERAL steps if necessary, know when to try a new number (I used flag variables for that), know when no more numbers were available and so it would be necessary to go back one step (and either try a new number in said step and move forward, or go back another step), implement "save points" to remember what a string looked like in a previous step, even if very old, and there are objects sort of "running in the background" for numbers 1-9 which store data about in which rows, columns and regions said numbers are present, and these objects must be updated everytime one of those numbers is added to a tile, but must also be corrected when one of those numbers is erased from a tile because it wasn't possible to continue with that string...

If you wanna see this process in action, open your VS Code terminal and enter "npm run start", visit localhost:3000 on your browser, and enter a sudoku string with lots of empty tiles like:
..53.....8......2..7..1.5..4....53...1..7...6..32...8..6.5....9..4....3......97..
On the VSCode terminal, you will see all the possible combinations the string tries, going right as new tiles are worked on, and going left as it hits dead-ends and previously completed tiles need to be redone, trying from lower to highest (naturally, the last digits grow much more quickly than the first digits), and most importantly, you will see how many steps back the app can go without the whole thing crashing. This particular string will take a few seconds to solve which, again, I know is not optimal performance, but it's a good showcase of what I've been able to build.

This other string also goes through the same process, but it needs to try less combinations before finding the answer, so it lets you see on your terminal, at around the 4th and 5th log, the moment in which the program realizes that none of the remaining empty tiles have a single possible solution, and that it's time to try multiple combinations through trial and error.
..32....6....4..9.1.2...5..7...29....4.3.7.5....81...2..1...8.3.2..8....9....46..

Here's another hard string that will take a few seconds to solve.
..9..5.1.85.4..............1.........9.....6.62.71...9..............4.37.4.3..6..

All in all, there were A LOT of moving pieces to this puzzle and, like I said, I was very, very happy with myself for having been able to keep track of them. If you're a recruiter for a tech company and feel like having an interview, don't hesitate to ask me to tell you more about this project so we can go over in detail about how it works: I'll be more than happy to showcase it (though do give me a heads up before the interview so I have time to go over it beforehand and properly explain how it works... 

unless you want to make it more challenging and have me figure it out/remember on-the-go!)

Thanks for having taken the time to read this!

Rodrigo

<!-- This is the boilerplate for the Sudoku Solver project. Instructions to complete your project can be found at https://www.freecodecamp.org/learn/quality-assurance/quality-assurance-projects/sudoku-solver -->
