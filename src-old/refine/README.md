This folder contains utils for working with the parsed timetables. Currently, there're two:

## Reorganize the timetables

There's a problem with the timetable in the past: **Timerows is organized by semesters, not by real
dates.** For example:

```
KY THUAT LAP TRINH (TN):
--|--|--|11|12|13|14|--|16|--|18|
DAI SO TUYEN TINH (BT):
--|--|--|--|--|--|--|--|--|--|--|--|--|--|--|23|
THI NGHIEM VAT LY:
--|--|--|--|--|--|--|--|--|--|--|--|--|46|47|
```

Those three of my courses were indeed enrolled in the same semester and resides in the same
timetable, but the weeks wasn't quite correct. This is due to the effect of COVID-19. Lab classes
were pushed back until later semesters. The weeks on the timetable no longer represented the correct
dates. The third course was pushed back one semester so we can't use the same year to calculate the
real date of both.

One way to resolve this is to base on the `base` (no puns intended) from the
[parser](/src/parser/README.md). We can see the top two has `base = 8`, while the bottom has
`base = 33`. We can then push the bottom course up to other timetables, and pick the one with
`base = 33`.

Take a look at [calcBase.ts](/src/refine/calcBase.ts) and
[reorganize.ts](/src/refine/reorganize.ts).

## Diff the versions

The timetables frequently change, so producing diffs is a valid concern.

My current approach is to generate all instances of the recurring timerows and associate them with
the date in a hashmap for faster comparisons. I'm a derp so there should be a better way.

Take a look at [diff.ts](/src/refine/diff.ts).
