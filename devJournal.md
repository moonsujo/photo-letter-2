implementation order
flow 1: demo
flow 2: write
- save data to database
flow 3: read
- fetch data from database

keep separate cards
1 to demo or read, 1 to write

progress check after finder flow
progress check after write flow: if Mom can get to the end in localhost
- use local state
progress check after read flow
- use local state
- use database

today
- set mobile friendly display window
- import font
- write opening message

feature: hand-write the letters
parse the font into points: done
generate the message - Sources - src/components/helpers/HandwrittenText.tsx

feature: balloons swipe across the screen

credit:
dammafra.dev christmas card

start the next project with Typescript.

012626
i don't completely understand everything i'm taking from dammafra's project.
if i simplified the feature, i would never have read someone else's code.
same goes for writing a video puzzle instead of photo puzzle.
i wish i was smart enough to learn all of these things at once.

parts of dammafra's card
chunking
canceling, sequence
writing font as points
camera control
code organization
typescript

i enjoyed reading dammafra's code
i don't enjoy copying code and debugging it. i don't understand what went wrong. i don't like relying on AI to debug.
i was hooked by the handwriting feature. i didn't think about how it was going to be incorporated into my idea.

learning
three.js journey certificate

handwriting
trick was to download the font from the vara repository. https://github.com/akzhy/Vara/blob/v2.0.0/fonts/Satisfy/SatisfySL.json
the font wasn't showing in 'Sources' because it was public. it wasn't the one that was shown. I grabbed the original and changed the name.

fonts
the ones i found online and converted (even the one included in dammafra's app) had two lines: the outlines - the inner and outer lines.
Vara has a procedure to produce a single-line font by tracing.

handwrite 'to you'
float 'next' button
pop open a polaroid film

animation
envelope opens
polaroid photo comes out
2. polaroid camera appears
take photo
photo slides out
"remember that time..."
photo (video) appears in a puzzle

float a video puzzle
can it be done in three.js?

draw heart shaped balloons
float across the screen
add confetti effect
it reveals a polaroid
it writes, 'remember that time...'
video puzzle fades in

include music

shoe dog
future, product, "own thing", "own business", "own idea"
do it while i'm young
stay in a business that's related, practicing my skills
websites, C++
will other people use it? what if someone wrote it for me?

2/3/2026
designed the envelope in blender
https://www.youtube.com/watch?v=1gbVsZIE8kM&t=50s
add handwritten text on it. rotate the envelope and run the animation. the polaroid is revealed. 

2/7/26
open animation complete.
wish the envelope had creases to make it look more real.
able to open and close with the button.
add balloons that spell 'Happy birthday!'
they should pop out on open. 
pop confetti.

2/13/26
came back after a few days. it was fun dragging the camera around the envelope with orbit controls.
relying on the agent to write the useSpring api to flip the envelope.
if I have to write the filename with an extension, or code syntax, i should write it in the script.

2/15/26
i'm writing a state specific to each component.
instead, i can write a ref to each component, and move it using gsap's timeline.
