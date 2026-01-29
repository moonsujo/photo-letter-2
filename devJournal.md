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