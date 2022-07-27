# @bkalendar/core

<a href="https://npmjs.org/package/@bkalendar/core">
  <img src="https://img.shields.io/npm/v/@bkalendar/core.svg"
       alt="npm version">
</a>

In an effort to transform the HCMUT timetable format to other format like iCalendar, I made this
package.

Our school timetable page is doing its worst job at representing timetables:

-   From the machine-readable viewpoint: working with weeks with no year attached is pain. This
    leads to ambiguity documented below in the [resolver](#resolve-the-correct-timetable) section.
-   From the human-readable viewpoint: I agree that there is `table` inside `timetable`, but it is
    not a reason to just [use a table to represent something akin to a calendar][steve].

    (Well, could be just personal taste though.)

    [steve]: https://twitter.com/steveschoger/status/997125312411570176

---

Some helpful terminologies that I made up:

-   **timetable**: umm... the timetable?
-   **timerow**: a row of the timetable.

## Parser

Parse the timetable into a simple data representation to work with in later pass. It should be
"lossless" and faithful to the original timetable.

There's two way to get the timetable:

### JSON

A POST request can be sent to `https://mybk.hcmut.edu.vn/stinfo/lichthi/ajax_lichhoc` to fetch the
timetables in JSON format. You can observe this by open the Network tab on F12 when accessing the
HCMUT MyBK portal.

The JSON can be then parsed and validated using `zod`.

When working with weeks, I made up some words:

-   **`base`** is the week with index 0. This is used to correctly reorganize the timerow.
-   **`newYear`** is the index of week 1. This is used to easily determine the correct year.

We always have either of the two to calculate the `Date`. The logic of parsing weeks resides in
`src/parser/json/weeks.ts`.

### Clipboard

Another way is to copy-and-paste the content of the webpage. The content is then processed using
RegEx to extract the timetables. The timetables obtained in this way have the format similar to the
JSON format above, so that we can reuse the JSON validator and parser.

## Resolver

### Resolve the correct timetable

There's a problem with the timetable in the past so I decided to add this resolver: **Timerows is
organized by semesters, not by real dates.**

Due to the effect of COVID-19, lab classes were pushed back until later semester. The weeks on the
timetable no longer represented the correct dates. For example:

```
KY THUAT LAP TRINH (TN):
--|--|--|11|12|13|14|--|16|--|18|
DAI SO TUYEN TINH (BT):
--|--|--|--|--|--|--|--|--|--|--|--|--|--|--|23|
THI NGHIEM VAT LY:
--|--|--|--|--|--|--|--|--|--|--|--|--|46|47|
```

Those three of my courses were indeed enrolled in the same semester and resides in the same
timetable, but the weeks wasn't quite correct. The third course was pushed back one semester so we
can't use the same year to calculate the real date of both.

One way to resolve this is to base on the `base` (no puns intended). We can see the top two has
`base = 8`, while the bottom has `base = 33`. We can then push the bottom course up to other
timetables, and pick the one with `base = 33`.

### Other purposes

In the future, there may be needs to add another resolver. Just make sure the resolver doesn't
change the data structure produced by the parser and used by the transformer below.

## Transformer

The last part of the pipeline is to transform the timetable into your favorite format. I currently
implemented two:

-   `.ical`: Most common format for calendar export.
-   `gapi.EventInput`: Use this with Google Calendar API.

If you want to implement another format, take a look at:

-   `src/transformer/calcBase.ts` for calculating the real `Date` of the `base`.
-   `src/transformer/time.ts` for a helper to calculate the real `Date` of `start`, `end`, `until`,
    `exceptions`.
