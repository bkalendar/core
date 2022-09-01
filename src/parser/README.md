Parse the timetable into a simple data representation to work with in later pass. It should be
"lossless" and faithful to the original timetable.

## Format

There's two way to get the timetable:

### JSON

A POST request can be sent to `https://mybk.hcmut.edu.vn/stinfo/lichthi/ajax_lichhoc` to fetch the
timetables in JSON format. You can observe this by open the Network tab on F12 when accessing the
HCMUT MyBK portal.

`zod` then parses and validates the JSON.

### Clipboard

Another way is to copy-and-paste the content of the webpage. A regex is used to match the content
and extract the timetables. The timetables obtained in this way have the format similar to the JSON
format above, so that we can reuse the JSON validator and parser.

## Weeks representation

When working with weeks, I made up some words:

-   **`base`** is the week with index 0. This is used to correctly reorganize the timerow.
-   **`newYear`** is the index of week 1. This is used to easily determine the correct year of the
    week.

We always have either of the two to calculate the `Date`. The logic of parsing weeks resides in
[weeks.ts](/src/parser/json/weeks.ts).
